import { useEffect, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import {
  definedUtilityData,
  DOCUMENT_STATUS_TYPE,
  DOCUMENTS_STATUSES,
  existingDocumentsList,
} from './constants';

// ─── Helpers (pure, no side effects) ─────────────────────────────────────────

const isNotFoundError = (error: any) => error?.response?.status === 404;

const resolveUserType = (
  IsMoveOut?: boolean | null,
  IsMoveIn?: boolean | null,
  IsNewLease?: boolean | null
) => {
  // 0 normal, 1 moveout, 2 movein, 3 new lease
  if (IsMoveOut) return 1;
  if (IsMoveIn) return 2;
  if (IsNewLease) return 3;
  return 0;
};

const getInitialDocumentsByUserType = (type: number) => {
  const map: Record<number, any[]> = {
    1: definedUtilityData.cardDetailsMoveOut,
    2: definedUtilityData.cardDetailsMovein,
    3: definedUtilityData.cardDetailsNewLease,
  };
  return [...(map[type] ?? existingDocumentsList)];
};

// Returns extra utility-specific document cards to append based on utility type and user type
const getUtilityExtraCards = (
  utilityType: string,
  projectName: string,
  currentUserType: number
): any[] => {
  const normalizedType = utilityType.toUpperCase().trim();
  const normalizedProject = projectName.trim().replace(/\s+/g, '').toUpperCase();

  // API may return "Gas" or "AC Cooling" — match by prefix/includes, not exact equality
  const isGas = normalizedType === 'GAS' || normalizedType.includes('GAS');
  const isAc =
    normalizedType === 'AC' ||
    normalizedType.startsWith('AC ') ||
    normalizedType.includes('AC COOLING') ||
    normalizedType.includes('COOLING');

  if (isGas) {
    if (currentUserType === 0 || currentUserType === 2)
      return [...definedUtilityData.cardDetailsMoveinEmgas];
    if (currentUserType === 1) return [...definedUtilityData.cardDetailsMoveOutEmgas];
  }

  if (isAc) {
    const isChillerProject =
      normalizedProject === 'DUBAIWHARF' || normalizedProject === 'MANAZELALKHOR';

    if (isChillerProject) {
      if (currentUserType === 0 || currentUserType === 2)
        return [...definedUtilityData.cardDetailsMoveinChiller];
      if (currentUserType === 1) return [...definedUtilityData.cardDetailsMoveOutChiller];
    } else {
      if (currentUserType === 0 || currentUserType === 2)
        return [...definedUtilityData.cardDetailsMoveinEmpower];
      if (currentUserType === 1) return [...definedUtilityData.cardDetailsMoveOutEmpower];
    }
  }

  return [];
};

const mergeAttachmentDataIntoDocs = (docs: any[], attachmentList: any[]) => {
  const updatedDocs = [...docs];

  attachmentList.forEach((attachment) => {
    const index = updatedDocs.findIndex(
      (doc) => doc.Attachment_Type === attachment.Attachment_Type
    );
    if (index > -1) {
      updatedDocs[index] = {
        ...updatedDocs[index],
        ...attachment,
        DisplayName: attachment.DisplayName ?? updatedDocs[index].DisplayName,
        // TemplateCode is set on the frontend; BE returns null for this field
        TemplateCode: updatedDocs[index].TemplateCode,
      };
    }
  });

  return updatedDocs;
};

const applyExpiryDates = (docs: any[], details: Record<string, string>) =>
  docs.map((doc) => {
    const nameUpper = doc.DisplayName?.toUpperCase() ?? '';
    const separator = nameUpper.includes('_') ? '_' : nameUpper.includes(' ') ? ' ' : '';
    const prefix = separator ? nameUpper.split(separator)[0] : nameUpper;

    const matchedEntry = Object.entries(details).find(([key]) => {
      const keyUpper = key.toUpperCase();
      return (
        keyUpper.includes(prefix) &&
        (keyUpper.includes('EXP_DATE') || keyUpper.includes('END_DATE'))
      );
    });

    const expiryDate = matchedEntry?.[1];
    if (doc.expiryDate === expiryDate) return doc;

    return { ...doc, expiryDate };
  });

const applyStatusesToDocs = (docs: any[], serviceRequests: any[]) => {
  const statusByTemplateCode = new Map<string, { Status: string; version?: number }>();

  serviceRequests.forEach((req) => {
    const code = req.Template_Code;
    const reqStatus = req.Status;

    let resolvedStatus = '';
    let version: number | undefined;

    if (DOCUMENTS_STATUSES?.UNDER_REVIEW_STATUSES?.includes(reqStatus)) {
      resolvedStatus = DOCUMENT_STATUS_TYPE.IN_PROGRESS;
      version = 2;
    } else if (reqStatus === DOCUMENTS_STATUSES?.CANCELLED) {
      resolvedStatus = DOCUMENT_STATUS_TYPE.CANCELLED;
    }

    statusByTemplateCode.set(code, { Status: resolvedStatus, version });
  });

  return docs.map((doc) => {
    const templateCodes = Array.isArray(doc.TemplateCode) ? doc.TemplateCode : [doc.TemplateCode];
    const match = templateCodes.map((code: string) => statusByTemplateCode.get(code)).find(Boolean);

    if (!match) return doc;

    return {
      ...doc,
      Status: match.Status,
      ...(match.version !== undefined && { version: match.version }),
    };
  });
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface DocumentsState {
  documents: any[];
  tenantDetails: any;
  selectedFilesByType: Record<string, File[]>;
  setSelectedFilesByType: React.Dispatch<React.SetStateAction<Record<string, File[]>>>;
  isLoading: boolean;
}

export const useDocuments = (): DocumentsState => {
  const { tCode, IsMoveIn, IsMoveOut, IsNewLease, setUserData } = useUserStore();
  const { openModal } = useUIStore();
  const [userType, setUserType] = useState<number | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedFilesByType, setSelectedFilesByType] = useState<Record<string, File[]>>({});
  const [tenantDetails, setTenantDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusLoading, setIsStatusLoading] = useState(false);

  // ─── API Hooks ──────────────────────────────────────────────────────────────

  const { mutate: fetchAttachments } = useApiMutation<any, any>(
    () => `/MyDocuments/Attachment/${tCode}`,
    'GET',
    false
  );

  const { mutate: fetchTenantDetails } = useApiMutation<any, any>(
    () => `/Yardi/GetDetails?tCode=${tCode}`,
    'GET',
    false
  );

  const { mutate: fetchUtilities } = useApiMutation<any, any>(
    () => `/Community/Utilities/${tCode}`,
    'GET',
    false
  );

  const { mutate: fetchDocumentsStatus } = useApiMutation<any, any>(
    (params) => `/MyDocuments/Status?tCode=${tCode}&templateCodes=${params.templateCode}`,
    'GET',
    false
  );

  const { mutate: mutateProfileData } = useApiMutation<any, any>(
    () => `/Tenant/${tCode}/Notifications/ProfileLiteApps`,
    'GET',
    false
  );

  // Always resolve journey flags from ProfileLiteApps before building cards.
  // Store defaults IsMoveOut/IsMoveIn/IsNewLease to false, so we must not trust them alone.
  useEffect(() => {
    if (!tCode) return;

    setIsLoading(true);
    setUserType(null);

    mutateProfileData(null, {
      onSuccess: (response) => {
        setUserData({
          IsMoveIn: response?.IsMoveIn,
          IsMoveOut: response?.IsMoveOut,
          IsNewLease: response?.IsNewLease,
          ProfileType: response?.ProfileType,
        });
        setUserType(resolveUserType(response?.IsMoveOut, response?.IsMoveIn, response?.IsNewLease));
      },
      onError: () => {
        // Fall back to store flags if ProfileLiteApps fails
        setUserType(resolveUserType(IsMoveOut, IsMoveIn, IsNewLease));
        openModal('error-modal');
      },
    });
  }, [tCode]);

  // Load documents only after userType is resolved (avoids wrong base + wrong utility cards)
  useEffect(() => {
    if (!tCode || userType === null) return;

    const fetchAll = async () => {
      setIsLoading(true);

      try {
        const [utilitiesRes, attachmentsRes, tenantDetailsRes]: any = await Promise.all([
          new Promise((resolve, reject) =>
            fetchUtilities(null, { onSuccess: resolve, onError: reject })
          ),
          new Promise((resolve, reject) =>
            fetchAttachments(null, {
              onSuccess: resolve,
              onError: (error) => {
                if (isNotFoundError(error)) resolve(null);
                else reject(error);
              },
            })
          ),
          new Promise((resolve, reject) =>
            fetchTenantDetails(null, { onSuccess: resolve, onError: reject })
          ),
        ]);

        const _tenantDetails = tenantDetailsRes?.Tenant_Details?.[0];
        if (!_tenantDetails) {
          openModal('error-modal');
          setIsLoading(false);
          return;
        }

        setTenantDetails(_tenantDetails);

        let docs = getInitialDocumentsByUserType(userType);

        if (userType !== 3 && Array.isArray(utilitiesRes)) {
          utilitiesRes.forEach((utility: any) => {
            const extraCards = getUtilityExtraCards(
              utility?.Type ?? '',
              _tenantDetails.Tenant_Project_Name ?? '',
              userType
            );
            if (extraCards.length) docs = [...docs, ...extraCards];
          });
        }

        docs.push({
          DisplayName: 'Dubai Residential IBAN Details',
          Attachment_Type: 'Dubai Residential IBAN Details',
          TemplateCode: 'IBAN_DETAILS',
          File_Name: 'Dubai_Residential_IBAN.pdf',
          hAttachment: true,
        });

        docs = applyExpiryDates(docs, _tenantDetails);

        const attachmentList = attachmentsRes?.Attachment_Details?.DPG_Attachment_Details_V;
        if (attachmentList?.length) {
          docs = mergeAttachmentDataIntoDocs(docs, attachmentList);
        }

        setDocuments(docs);
        setIsLoading(false);

        if (userType !== 3) {
          setIsStatusLoading(true);
          fetchDocumentsStatus(
            { templateCode: 'ALL' },
            {
              onSuccess: (res) => {
                const serviceRequests = res?.ServiceRequest;
                if (serviceRequests?.length) {
                  setDocuments((prev) => applyStatusesToDocs(prev, serviceRequests));
                }
                setIsStatusLoading(false);
              },
              onError: (error) => {
                setIsStatusLoading(false);
                if (!isNotFoundError(error)) openModal('error-modal');
              },
            }
          );
        }
      } catch {
        openModal('error-modal');
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [tCode, userType]);

  return {
    documents,
    tenantDetails,
    selectedFilesByType,
    setSelectedFilesByType,
    isLoading: isLoading || isStatusLoading,
  };
};
