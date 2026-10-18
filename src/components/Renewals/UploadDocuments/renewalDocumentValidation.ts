import { DOCUMENT_STATUS_TYPE, DOCUMENTS_STATUSES } from 'components/DocumentsPage/constants';

import {
  RENEWAL_CORPORATE_DOCUMENTS,
  RENEWAL_PERSONAL_DOCUMENTS,
} from './renewalUploadDocumentsConstants';

import type { RenewalDocument } from './renewalUploadDocuments.types';

export type DocumentValidationStatus = 'InProgress' | 'Rejected' | 'Completed' | undefined;

export interface RenewalDocumentValidationResult {
  Attachment_Type: string;
  TemplateCode: string;
  File_Name?: string;
  Expired: boolean;
  Status: DocumentValidationStatus;
  version?: number;
  StatusLabel?: string;
}

export interface RenewalDocumentValidationResponse {
  documents: RenewalDocument[];
  results: RenewalDocumentValidationResult[];
  documentsFailed: boolean;
  apisReady: {
    attachments: boolean;
    status: boolean;
    tenant: boolean;
  };
}

const isDateExpired = (expiryDate?: string): boolean => {
  if (!expiryDate) return false;

  const [day, month, year] = expiryDate.split('/');
  const expiry = new Date(`${year}-${month}-${day}`);
  return expiry < new Date();
};

const getRenewalDocumentDefinitions = (profileType?: number) =>
  profileType === 6
    ? RENEWAL_CORPORATE_DOCUMENTS.map((doc) => ({ ...doc }))
    : RENEWAL_PERSONAL_DOCUMENTS.map((doc) => ({ ...doc }));

const applyExpiryDatesToDocuments = (
  docs: RenewalDocument[],
  details: Record<string, string>
): RenewalDocument[] =>
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
    if (!expiryDate || doc.expiryDate === expiryDate) return doc;

    return { ...doc, expiryDate };
  });

export const resolveDocumentStatus = (reqStatus: string): DocumentValidationStatus => {
  if (DOCUMENTS_STATUSES.UNDER_REVIEW_STATUSES.includes(reqStatus)) return 'InProgress';
  if (reqStatus === DOCUMENTS_STATUSES.CANCELLED) return 'Rejected';
  if (reqStatus === DOCUMENTS_STATUSES.WORK_COMPLETED) return 'Completed';
  return undefined;
};

export const checkDocumentFailing = (results: RenewalDocumentValidationResult[]): boolean => {
  for (const doc of results) {
    if (doc.File_Name === undefined && doc.Status !== 'InProgress' && doc.Status !== undefined) {
      return true;
    }

    if (doc.Expired === true && doc.Status !== 'InProgress') {
      return true;
    }

    if (doc.Status === 'Rejected' || doc.Status === undefined) {
      return true;
    }
  }

  return false;
};

const buildValidationResults = (documents: RenewalDocument[]): RenewalDocumentValidationResult[] =>
  documents.map((doc) => ({
    Attachment_Type: doc.Attachment_Type,
    TemplateCode: doc.TemplateCode,
    File_Name: doc.File_Name,
    Expired: isDateExpired(doc.expiryDate),
    // paymentPlan.js stores validation status on resultDetails (includes Completed)
    Status:
      doc.resultStatus ??
      (doc.Status === DOCUMENT_STATUS_TYPE.IN_PROGRESS
        ? 'InProgress'
        : doc.Status === DOCUMENT_STATUS_TYPE.CANCELLED
        ? 'Rejected'
        : undefined),
    version: doc.version,
    StatusLabel: doc.Status,
  }));

/** Build validation result from the three API response bodies. */
export function buildRenewalDocumentValidation(
  attachmentsData: any,
  statusData: any,
  tenantData: any,
  profileType?: number
): RenewalDocumentValidationResponse {
  let documents = getRenewalDocumentDefinitions(profileType);

  const attachmentsReady = true;
  const attachmentList =
    attachmentsData && attachmentsData !== 'null'
      ? attachmentsData?.Attachment_Details?.DPG_Attachment_Details_V
      : [];
  const attachments = Array.isArray(attachmentList) ? attachmentList : [];

  // Status: null/empty body → not ready (paymentPlan.js status_API_fetched = false)
  const statusReady = !!(statusData && statusData !== 'null');
  const serviceRequests = statusReady
    ? Array.isArray(statusData?.ServiceRequest)
      ? statusData.ServiceRequest
      : []
    : [];

  // Tenant: null/empty → not ready
  const tenantDetails = tenantData?.Tenant_Details?.[0];
  const tenantReady = !!tenantDetails;

  const apisReady = {
    attachments: attachmentsReady,
    status: statusReady,
    tenant: tenantReady,
  };

  if (attachments.length) {
    documents = documents.map((doc) => {
      const attachment = attachments.find(
        (item: any) => item.Attachment_Type === doc.Attachment_Type
      );
      if (!attachment) return doc;

      return {
        ...doc,
        ...attachment,
        TemplateCode: doc.TemplateCode,
      };
    });
  }

  if (serviceRequests.length) {
    // Match paymentPlan.js Status index mapping → resultDetails.Status
    const statusByTemplateCode = new Map<
      string,
      { Status: string; version?: number; resultStatus?: DocumentValidationStatus }
    >();

    serviceRequests.forEach((req: any) => {
      const code = req.Template_Code?.trim();
      const documentStatus = resolveDocumentStatus(req.Status);

      let resolvedStatus = '';
      let version: number | undefined;
      let resultStatus: DocumentValidationStatus;

      if (documentStatus === 'InProgress') {
        // Status index 0–7 → under review
        resolvedStatus = DOCUMENT_STATUS_TYPE.IN_PROGRESS;
        version = 2;
        resultStatus = 'InProgress';
      } else if (documentStatus === 'Completed') {
        // Status index 8 → Work Completed (card Status cleared, resultStatus = Completed)
        resolvedStatus = '';
        resultStatus = 'Completed';
      } else if (documentStatus === 'Rejected') {
        // Status index 9 → Canceled
        resolvedStatus = DOCUMENT_STATUS_TYPE.CANCELLED;
        resultStatus = 'Rejected';
      } else {
        resultStatus = undefined;
      }

      statusByTemplateCode.set(code, { Status: resolvedStatus, version, resultStatus });
    });

    documents = documents.map((doc) => {
      const match = statusByTemplateCode.get(doc.TemplateCode);
      if (!match) return doc;

      return {
        ...doc,
        Status: match.Status,
        resultStatus: match.resultStatus,
        ...(match.version !== undefined && { version: match.version }),
      };
    });
  }

  if (tenantDetails) {
    documents = applyExpiryDatesToDocuments(documents, tenantDetails);
  }

  const results = buildValidationResults(documents);
  const validationFailed = checkDocumentFailing(results);
  const documentsFailed = !apisReady.status || !apisReady.tenant ? true : validationFailed;

  return {
    documents,
    results,
    documentsFailed,
    apisReady,
  };
}

/** paymentPlan.js routing after TrackContractDetails (UserState only). */
export const getRenewalRouteAfterDocumentTrack = (userState: number): string => {
  // UserState 2 → confirmRedirectToSchedule; UserState 1 → confirmRedirectToDocument
  return userState === 2 ? '/contract-renewal/sign-contract' : '/contract-renewal/upload-documents';
};
