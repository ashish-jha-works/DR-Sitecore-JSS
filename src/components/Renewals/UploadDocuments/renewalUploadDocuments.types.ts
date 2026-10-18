export interface RenewalUploadDocumentsFields {
  headerIcon?: { value?: string };
  title?: { value?: string };
  acceptedFormatsTerms?: { value?: string };
  documentUploadInfoText?: { value?: string };
  submitCTALabel?: { value?: string };
  statusReviewInProgress?: { value?: string };
  statusDocumentRejected?: { value?: string };
  downloadErrorModalTitle?: { value?: string };
  uploadErrorMessage?: { value?: string };
}

export interface RenewalUploadDocumentsProps {
  fields?: RenewalUploadDocumentsFields;
}

export interface RenewalDocument {
  Attachment_Type: string;
  DisplayName: string;
  TemplateCode: string;
  Status: string;
  version: number;
  File_Name?: string;
  hAttachment?: string | boolean;
  expiryDate?: string;
  ObjectType?: string;
  ObjectReference?: string;
  resultStatus?: 'InProgress' | 'Rejected' | 'Completed';
}
