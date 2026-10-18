import { Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface MoveOutUploadDocumentsFields {
  uploadUtilityDocumentHeadingIcon: Field<string>;

  title: Field<string>;

  acceptedFormatsLabel: Field<string>;
  acceptedFormatsTerms: Field<string>;

  DEWAConnectionAcknowledgementLabel: Field<string>;
  dubaiACConnectionAcknowledgementLabel: Field<string>;
  emiratesGasConnectionAcknowledgementLabel: Field<string>;

  documentUploadInfoText: Field<string>;

  uploadErrorMessage: Field<string>;

  submitCTALabel: Field<string>;

  documentsUploadSuccessModalTitle: Field<string>;
  documentsUploadSuccessModalDescription: Field<string>;
  proceedCTALabel: Field<string>;
}

export interface MoveOutUploadDocumentsProps {
  fields: MoveOutUploadDocumentsFields;
}
