export type SignMethod = 'digital' | 'physical' | '';
export type PhysicalScheduleOption = 'collection' | 'delivery' | '';

export type SignContractView = 'method' | 'physical-schedule';

export interface DirectDebitDownloadResponse {
  Document?: string;
  FileName?: string;
}

export interface JourneyDocumentDownloadResponse {
  Document?: string;
  FileName?: string;
}

export interface RenewalSignContractFields {
  signMethodTitle?: { value?: string };
  digitalSignIcon?: { value?: string };
  digitalSignTitle?: { value?: string };
  digitalSignDescription?: { value?: string };
  digitalSignFootnote?: { value?: string };
  physicalSignIcon?: { value?: string };
  physicalSignTitle?: { value?: string };
  physicalSignDescription?: { value?: string };
  physicalSignFootnote?: { value?: string };
  downloadDraftLabel?: { value?: string };
  downloadCTALabel?: { value?: string };
  agreementTermsText?: { value?: string };
  confirmCTALabel?: { value?: string };
  physicalScheduleTitle?: { value?: string };
  collectionIcon?: { value?: string };
  collectionTitle?: { value?: string };
  collectionDescription?: { value?: string };
  deliveryIcon?: { value?: string };
  deliveryTitle?: { value?: string };
  deliveryDescription?: { value?: string };
  documentsReadyTitle?: { value?: string };
  documentsReadyDescription?: { value?: string };
  documentsDeliveredTitle?: { value?: string };
  documentsDeliveredDescription?: { value?: string };
  renewalProposalLabel?: { value?: string };
  pdcDocumentLabel?: { value?: string };
  directDebitFormLabel?: { value?: string };
  thirdPartyLetterLabel?: { value?: string };
  directDebitSideLetterLabel?: { value?: string };
  viewPdcCTALabel?: { value?: string };
  proceedCTALabel?: { value?: string };
}

export interface RenewalSignContractProps {
  fields?: RenewalSignContractFields;
}
