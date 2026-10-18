import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';

import InfoIcon from 'assets/icons/InfoIcon';
import InfoMessage from 'components/InfoMessage';

import { categoryMap, CONTRACT_ATTACHMENT_TYPES, fileMaxSize } from './constants';
import UploadDocument from './UploadDocument';
import { DocumentsState } from './useDocuments';

interface DocumentsProps {
  fields: any;
  documentType: 'PERSONAL' | 'UTILITY' | 'CONTRACT';
  documentsState: DocumentsState;
}

const getDocumentHelperText = (displayName: string): string => {
  const requiresFrontBack = ['Passport', 'Emirates ID', 'Emirates_ID'];
  return requiresFrontBack.some((name) => displayName.includes(name))
    ? `Please upload the front and back of your ${displayName} in a single document`
    : '';
};

const Documents = ({ fields, documentType, documentsState }: DocumentsProps) => {
  const { tCode } = useUserStore();
  const { ProfileType } = useUserStore();
  const router = useRouter();
  const { documents, tenantDetails, selectedFilesByType, setSelectedFilesByType } = documentsState;

  // ─── Filtering ──────────────────────────────────────────────────────────────

  const allowedDisplayNames = categoryMap[documentType] ?? [];
  const visibleDocuments = documents.filter((doc) => {
    const normalizedDisplayName = String(doc.DisplayName ?? '').toUpperCase();
    const matchesDisplayName = allowedDisplayNames.some(
      (name) => String(name ?? '').toUpperCase() === normalizedDisplayName
    );

    if (documentType === 'CONTRACT') {
      return matchesDisplayName || CONTRACT_ATTACHMENT_TYPES.includes(doc.Attachment_Type);
    }

    return matchesDisplayName;
  });

  const hasSelectedFiles = visibleDocuments.some(
    (doc) => (selectedFilesByType[doc.Attachment_Type] ?? []).length > 0
  );

  const { mutate: uploadDocument } = useApiMutation<any, any>(
    () => `/MyDocuments/Attachment/Create`,
    'POST',
    true
  );

  // ─── Visibility guards ──────────────────────────────────────────────────────

  const checkSpecificDocumentHasAttachment = (attachmentType: string): boolean => {
    if (!attachmentType) return true;

    const contractTypes = [
      'Ejari Document',
      'Memorandum of Understanding',
      'Renewal Contract - Fully Executed',
      'New Contract - Fully Executed',
      'Move In Permit',
    ];

    if (contractTypes.includes(attachmentType)) {
      const document = documents.find((doc) => doc.Attachment_Type === attachmentType);
      return !!document?.File_Name;
    }

    return true;
  };

  const checkIfItsCommunityDocument = (attachmentType: string): boolean => {
    if (!attachmentType) return false;
    // check for SUC and mounted then only show in case of Trade License or Power of Attorney or else hide it
    else if (attachmentType === 'Trade License' || attachmentType === 'Power of Attorney') {
      if (ProfileType === 6) {
        return true;
      } else return false;
    }

    // hide emirates id in case of SUC
    else if (attachmentType === 'Emirates ID Copy') {
      return ProfileType !== 6;
    }

    // For Tenant community Name return true
    return !!tenantDetails?.Tenant_Project_Name?.trim();
  };

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleSaveChanges = () => {
    const uploadsForTab = visibleDocuments
      .map((doc) => ({
        attachmentType: doc.Attachment_Type,
        files: selectedFilesByType[doc.Attachment_Type] ?? [],
      }))
      .filter(({ files }) => files.length > 0);

    uploadsForTab.forEach(({ attachmentType, files }) => {
      const file = files[0];

      // Validate extension
      const rawName = file.name.replace(/\s/g, '');
      const extension = rawName.split('.').pop() ?? '';

      // Append timestamp before extension
      const nameWithoutExt = rawName.substr(0, rawName.lastIndexOf('.'));
      const fileNameWithTimeStamp = `${nameWithoutExt}_${new Date().getTime()}.${extension}`;

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.substr(result.indexOf(',') + 1);

        uploadDocument(
          {
            Object_Type: 'Tenant',
            Object_Reference: tCode,
            File_Name: fileNameWithTimeStamp.substr(0, fileNameWithTimeStamp.lastIndexOf('.')),
            Attachment_Type: attachmentType,
            File_Extension: `.${extension}`,
            Attachment: base64,
          },
          {
            onSuccess: () => {
              router.refresh();
            },
            onError: () => {
              router.refresh();
            },
          }
        );
      };

      reader.readAsDataURL(file);
    });
  };

  const isUtilityEmptyCase = useMemo((): boolean => {
    if (documentType !== 'UTILITY') return false;

    // If there are non-DEWA documents, it's not empty
    const nonDewaDocuments = visibleDocuments.filter(
      (doc) => !(doc.DisplayName === 'DEWA Connection Acknowledgement')
    );
    if (nonDewaDocuments.length > 0) return false;

    // Only DEWA remains — check if it has neither a File_Name nor a Status
    const dewaDocument = visibleDocuments.find(
      (doc) => doc.DisplayName === 'DEWA Connection Acknowledgement'
    );
    if (!dewaDocument) return true; // no documents at all under utility

    const hasFile = !!dewaDocument.File_Name;
    const hasStatus = !!dewaDocument.Status;

    return !hasFile && !hasStatus;
  }, [documentType]);

  return (
    <div className="Documents">
      <div className="container-sm mt-8 md:mt-10">
        {isUtilityEmptyCase ? (
          <div className="flex flex-col items-center lg:py-10">
            <CustomRichText
              field={fields?.noUtilityDocumentImage}
              className="lg:mt-5 mb-8 lg:mb-6"
            />
            <Text tag="p" className="font-light" field={fields?.noUtilityDocumentMessage} />
          </div>
        ) : (
          <>
            <InfoMessage IconComponent={InfoIcon} status="normal">
              <p className="text-body">{fields?.documentUploadInfoText?.value}</p>
            </InfoMessage>

            {visibleDocuments.map((document) => {
              const canShowAttachment = checkSpecificDocumentHasAttachment(
                document?.Attachment_Type
              );
              const isCommunityDocument = checkIfItsCommunityDocument(document?.Attachment_Type);

              return (
                canShowAttachment &&
                isCommunityDocument && (
                  <div
                    key={document.Attachment_Type}
                    className="bg-white-pure rounded-xl border border-solid border-lilac-300 p-4 lg:p-8 mt-5 lg:mt-6"
                  >
                    <UploadDocument
                      label={document?.DisplayName}
                      labelClassName="text-body! font-medium"
                      helperText={getDocumentHelperText(document?.DisplayName)}
                      accept={['.jpg', '.pdf']}
                      files={selectedFilesByType[document.Attachment_Type] ?? []}
                      onChange={(files) =>
                        setSelectedFilesByType((prev) => ({
                          ...prev,
                          [document.Attachment_Type]: files,
                        }))
                      }
                      disabled={false}
                      document={document}
                      maxFiles={1}
                      documentType={documentType}
                      maxSize={fileMaxSize}
                      fields={fields}
                      showFileName={true}
                    />
                  </div>
                )
              );
            })}

            {/* Show save Changes button only when there's at least one file selected across the visible documents */}
            {hasSelectedFiles && (
              <div className="btn-wrapper flex flex-col lg:flex-row justify-end items-end gap-4 md:gap-6 mt-5 lg:mt-6">
                <button
                  type="button"
                  className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Documents;
