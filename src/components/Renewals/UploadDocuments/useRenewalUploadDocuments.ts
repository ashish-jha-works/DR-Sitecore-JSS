import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { DOCUMENT_STATUS_TYPE } from 'components/DocumentsPage/constants';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';
import { getFileMetaData } from 'lib/utils/helper';

import {
  RENEWAL_CORPORATE_DOCUMENTS,
  RENEWAL_PERSONAL_DOCUMENTS,
} from './renewalUploadDocumentsConstants';
import type { RenewalDocument } from './renewalUploadDocuments.types';
import { useRenewalDocumentValidation } from './useRenewalDocumentValidation';

const isDocumentExpired = (expiryDate?: string): boolean => {
  if (!expiryDate) return false;

  const [day, month, year] = expiryDate.split('/');
  const expiry = new Date(`${year}-${month}-${day}`);
  return expiry < new Date();
};

const isReviewInProgress = (status?: string): boolean =>
  status === DOCUMENT_STATUS_TYPE.IN_PROGRESS;

const isDocumentRejected = (status?: string): boolean => status === DOCUMENT_STATUS_TYPE.CANCELLED;

export function useRenewalUploadDocuments() {
  const { tCode, ProfileType } = useUserStore();
  const { openModal } = useUIStore();
  const router = useRouter();

  const [documents, setDocuments] = useState<RenewalDocument[]>(
    ProfileType === 6
      ? RENEWAL_CORPORATE_DOCUMENTS.map((doc) => ({ ...doc }))
      : RENEWAL_PERSONAL_DOCUMENTS.map((doc) => ({ ...doc }))
  );
  const [selectedFilesByType, setSelectedFilesByType] = useState<Record<string, File[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apisReady, setApisReady] = useState({
    attachments: false,
    status: false,
    tenant: false,
  });

  const { fetchRenewalDocumentValidation } = useRenewalDocumentValidation();

  const { mutate: uploadDocument } = useApiMutation<any, any>(
    () => `/MyDocuments/Attachment/Create`,
    'POST',
    true
  );

  const { mutate: trackContractDetails } = useApiMutation<any, any>(
    () => `ContractRenewal/TrackContractDetails`,
    'POST',
    true
  );

  useEffect(() => {
    if (!tCode) {
      setIsLoading(false);
      return;
    }

    const loadDocuments = async () => {
      setIsLoading(true);

      try {
        const validation = await fetchRenewalDocumentValidation();
        setDocuments(validation.documents);
        setApisReady(validation.apisReady);
      } catch {
        openModal('error-modal');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [tCode, ProfileType, fetchRenewalDocumentValidation, openModal]);

  const canProceedDocument = (doc: RenewalDocument, selectedFiles: File[]): boolean => {
    const hasNewUpload = selectedFiles.length > 0;
    const hasExistingFile = !!doc.File_Name;
    const expired = isDocumentExpired(doc.expiryDate);
    const inReview = isReviewInProgress(doc.Status);
    const rejected = isDocumentRejected(doc.Status);

    if (expired && !inReview && !hasNewUpload) return false;
    if (rejected && !hasNewUpload) return false;
    if (!hasExistingFile && !hasNewUpload && !inReview) return false;

    return true;
  };

  const isProceedAvailable = useMemo(() => {
    const docList = documents ?? [];
    if (!docList.length) return false;
    if (!apisReady.tenant || !apisReady.status) return false;

    if (!apisReady.attachments) {
      return docList.every((doc) => isReviewInProgress(doc.Status));
    }

    return docList.every((doc) =>
      canProceedDocument(doc, selectedFilesByType[doc.Attachment_Type] ?? [])
    );
  }, [apisReady, documents, selectedFilesByType]);

  const getModifiedFileName = (originalName: string) => {
    const nameNoSpaces = originalName.replace(/\s/g, '');
    const ext = nameNoSpaces.split('.').pop();
    const nameWithoutExt = nameNoSpaces.substr(0, nameNoSpaces.lastIndexOf('.'));
    return `${nameWithoutExt}_${Date.now()}.${ext}`;
  };

  const uploadSelectedDocuments = async (): Promise<boolean> => {
    const docList = documents ?? [];
    const uploads = docList
      .map((doc) => ({
        attachmentType: doc.Attachment_Type,
        files: selectedFilesByType[doc.Attachment_Type] ?? [],
      }))
      .filter(({ files }) => files.length > 0);

    if (!uploads.length) return true;

    for (const { attachmentType, files } of uploads) {
      const file = files[0];
      const modifiedFileName = getModifiedFileName(file.name);
      const { base64 }: any = await getFileMetaData(file);

      const uploadResult = await new Promise<boolean>((resolve) => {
        uploadDocument(
          {
            Object_Type: 'Tenant',
            Object_Reference: tCode,
            File_Name: modifiedFileName.substr(0, modifiedFileName.lastIndexOf('.')),
            Attachment_Type: attachmentType,
            File_Extension: `.${modifiedFileName.split('.').pop()}`,
            Attachment: base64,
          },
          {
            onSuccess: (res) => resolve(res?.CreateAttachment !== null),
            onError: () => resolve(false),
          }
        );
      });

      if (!uploadResult) return false;
    }

    return true;
  };

  const handleSendForApproval = async () => {
    if (!isProceedAvailable || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const uploadsSucceeded = await uploadSelectedDocuments();
      if (!uploadsSucceeded) {
        openModal('error-modal');
        return;
      }

      trackContractDetails(
        {
          ProfileId: tCode,
          UserState: 2,
        },
        {
          onSuccess: (response: any) => {
            if (
              response?.Code === 200 ||
              response?.Status === 'Success' ||
              (response && response !== 'null')
            ) {
              router.push('/contract-renewal/sign-contract');
            } else {
              openModal('error-modal');
            }
          },
          onError: () => openModal('error-modal'),
        }
      );
    } catch {
      openModal('error-modal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    documents,
    selectedFilesByType,
    setSelectedFilesByType,
    isLoading,
    isSubmitting,
    isProceedAvailable,
    handleSendForApproval,
  };
}
