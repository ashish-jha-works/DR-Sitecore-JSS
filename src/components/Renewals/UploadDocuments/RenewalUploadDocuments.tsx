'use client';

import InfoIcon from 'assets/icons/InfoIcon';
import UploadDocument from 'components/DocumentsPage/UploadDocument';
import InfoMessage from 'components/InfoMessage';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';

import RenewalStepper from '../Stepper/RenewalsStepper';
import {
  getDocumentHelperText,
  RENEWAL_ACCEPTED_FILE_TYPES,
  RENEWAL_MAX_FILE_SIZE,
} from './renewalUploadDocumentsConstants';
import type { RenewalUploadDocumentsProps } from './renewalUploadDocuments.types';
import { getFieldValue, toSitecoreField } from './renewalUploadDocuments.utils';
import { useRenewalUploadDocuments } from './useRenewalUploadDocuments';

export default function RenewalUploadDocuments({ fields = {} }: RenewalUploadDocumentsProps) {
  const {
    documents,
    selectedFilesByType,
    setSelectedFilesByType,
    isLoading,
    isSubmitting,
    isProceedAvailable,
    handleSendForApproval,
  } = useRenewalUploadDocuments();

  const uploadDocumentFields = {
    statusReviewInProgress: toSitecoreField(
      fields?.statusReviewInProgress,
      'Document uploaded successfully. Review in progress.'
    ),
    statusDocumentRejected: toSitecoreField(
      fields?.statusDocumentRejected,
      'Your document was rejected. Kindly upload valid document.'
    ),
    downloadErrorModalTitle: toSitecoreField(
      fields?.downloadErrorModalTitle,
      "We couldn't retrieve this information due to a technical issue. Please try again later."
    ),
  };

  const headerIconField = toSitecoreField(fields?.headerIcon);

  return (
    <section className="RenewalUploadDocuments contract-renewal">
      <RenewalStepper />
      {!isLoading ? (
        <div className="container-sm relative -top-16.5 lg:static py-8 md:py-10 flex flex-col gap-5 md:gap-6">
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
            <div className="flex flex-col gap-2 lg:gap-3">
              <div className="flex items-center gap-4">
                <CustomRichText field={headerIconField} />
                <Text
                  tag="h1"
                  field={toSitecoreField(fields?.title, 'Upload your documents')}
                  className="text-body md:text-heading-3 font-medium text-navy-500"
                />
              </div>
              <Text
                tag="p"
                field={toSitecoreField(
                  fields?.acceptedFormatsTerms,
                  'Each individual document should not exceed 5 MB in size. Acceptable file types - JPG, PDF.'
                )}
                className="font-light text-body text-navy-500"
              />
            </div>

            <div className="flex flex-col gap-5 lg:gap-6 upload-section">
              {(documents ?? []).map((document) => (
                <UploadDocument
                  key={document.Attachment_Type}
                  label={document.DisplayName}
                  labelClassName="text-body! font-medium"
                  helperText={getDocumentHelperText(document.DisplayName)}
                  accept={RENEWAL_ACCEPTED_FILE_TYPES}
                  files={selectedFilesByType[document.Attachment_Type] ?? []}
                  onChange={(files) =>
                    setSelectedFilesByType((prev) => ({
                      ...prev,
                      [document.Attachment_Type]: files ?? [],
                    }))
                  }
                  disabled={false}
                  document={document}
                  maxFiles={1}
                  documentType="PERSONAL"
                  maxSize={RENEWAL_MAX_FILE_SIZE}
                  showFileName={true}
                  containerClassName="border border-lilac-100 rounded-lg lg:py-8.5"
                  errorText={getFieldValue(
                    fields?.uploadErrorMessage,
                    'Upload failed. File size exceeds 5 MB, please upload the document again.'
                  )}
                  fields={uploadDocumentFields}
                />
              ))}

              <InfoMessage IconComponent={InfoIcon} status="normal">
                <p className="text-body font-light">
                  {getFieldValue(
                    fields?.documentUploadInfoText,
                    'Once you upload your documents, they will be sent for approval. You will be notified once your documents have been approved.'
                  )}
                </p>
              </InfoMessage>
            </div>
          </div>

          <div className="btn-wrapper flex flex-col justify-center items-end gap-2 md:gap-3">
            <button
              type="button"
              className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase ${
                !isProceedAvailable || isSubmitting ? 'disabled' : ''
              }`}
              disabled={!isProceedAvailable || isSubmitting}
              onClick={handleSendForApproval}
            >
              {getFieldValue(fields?.submitCTALabel, 'Send for approval')}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
