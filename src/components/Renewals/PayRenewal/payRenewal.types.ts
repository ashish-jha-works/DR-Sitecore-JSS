import { Field, LinkField, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface PayRenewalFields {
  headerIcon: RichTextField;
  title: Field<string>;
  backCTA: Field<LinkField> | any;
  submitCTALabel: Field<string>;
  cancelCTALabel: Field<string>;
  selectPaymentCardLabel: Field<string>;
  noSavedCardDescription: Field<string>;
  cvvLabel: Field<string>;
  cvvHelpText: Field<string>;
  addNewCardText: Field<string>;
  addCardInfoMessage: Field<string>;
  termsPrefixText: Field<string>;
  termsLinkText: Field<string>;
  paymentTermsLinkText: Field<string>;
  '12MonthsAdditionalFeeText': Field<string>;
  installmentPlanAcknowledgementText: Field<string>;
  selectedCardInfoMessage: Field<string>;
}

export interface PayRenewalProps {
  fields: PayRenewalFields;
}
