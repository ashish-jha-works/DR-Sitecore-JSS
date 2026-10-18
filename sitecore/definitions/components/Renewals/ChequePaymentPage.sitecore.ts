import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ChequePaymentPage component to the disconnected manifest.
 */
export default function ChequePaymentPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ChequePaymentPage',
    templateName: 'ChequePaymentPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      // General
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'warningInfoText', type: CommonFieldTypes.SingleLineText },
      {
        name: 'chequeIssuedByThirdPartyOptionsLabel',
        type: CommonFieldTypes.SingleLineText,
      },

      // Cheque Issuer Details
      { name: 'chequeIssuerDetailsHeadingIcon', type: CommonFieldTypes.RichText },
      { name: 'chequeIssuerDetailsHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'chequeIssuerDetailsDesc', type: CommonFieldTypes.SingleLineText },
      { name: 'chequeIssuerNameLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'passportNumberLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'passportExpiryLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'EIDNumberLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'EIDExpiryLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'tradeLicenseNumberLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'tradeLicenseExpiryLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'chequeIssuerCancelCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'chequeIssuerSaveCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'chequeIssuerEditCTALabel', type: CommonFieldTypes.SingleLineText },

      // Cheque Details
      { name: 'chequeDetailsHeadingIcon', type: CommonFieldTypes.RichText },
      { name: 'chequeDetailsDesc', type: CommonFieldTypes.SingleLineText },
      { name: 'chequeDetailsHeading', type: CommonFieldTypes.SingleLineText },
      {
        name: 'chequeBankNameToAllChequeOptionLabel',
        type: CommonFieldTypes.SingleLineText,
      },
      { name: 'chequeDateLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'chequeAmountLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'chequeNumberLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'bankNameLabel', type: CommonFieldTypes.SingleLineText },

      // CTA Labels
      { name: 'cancelCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
