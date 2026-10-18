import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the PayRenewal component to the disconnected manifest.
 */
export default function PayRenewal(manifest: Manifest): void {
  manifest.addComponent({
    name: 'PayRenewal',
    templateName: 'PayRenewal',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      // Installment Breakdown fields
      { name: 'headerIcon', type: CommonFieldTypes.RichText },
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'backCTA', type: CommonFieldTypes.SingleLineText },
      // Payment By Card Fields
      { name: 'selectPaymentCardLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'noSavedCardDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'cvvLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cvvHelpText', type: CommonFieldTypes.SingleLineText },
      { name: 'addNewCardText', type: CommonFieldTypes.SingleLineText },
      { name: 'addCardInfoMessage', type: CommonFieldTypes.SingleLineText },
      { name: 'termsPrefixText', type: CommonFieldTypes.SingleLineText },
      { name: 'termsLinkText', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentTermsLinkText', type: CommonFieldTypes.SingleLineText },
      { name: '12MonthsAdditionalFeeText', type: CommonFieldTypes.SingleLineText },
      { name: 'installmentPlanAcknowledgementText', type: CommonFieldTypes.SingleLineText },
      { name: 'selectedCardInfoMessage', type: CommonFieldTypes.SingleLineText },
      // CTA Labels
      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
