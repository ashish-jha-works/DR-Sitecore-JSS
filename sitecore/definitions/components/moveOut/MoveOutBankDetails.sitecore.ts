import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the MoveOutBankDetails component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance
 */
export default function MoveOutBankDetails(manifest: Manifest): void {
  manifest.addComponent({
    name: 'MoveOutBankDetails',
    templateName: 'MoveOutBankDetails',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'titleIcon', type: CommonFieldTypes.RichText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'formInstruction', type: CommonFieldTypes.SingleLineText },
      { name: 'warningIcon', type: CommonFieldTypes.RichText },
      { name: 'warningMessage', type: CommonFieldTypes.RichText },
      { name: 'backLinkText', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentModeLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentOption1', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentOption2', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentOption3', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelButtonText', type: CommonFieldTypes.SingleLineText },
      { name: 'nextButtonText', type: CommonFieldTypes.SingleLineText },
      { name: 'infoBannerIcon', type: CommonFieldTypes.RichText },
      { name: 'infoBannerMessage', type: CommonFieldTypes.SingleLineText },
      { name: 'payableCountryFlagIcon', type: CommonFieldTypes.RichText },
      { name: 'payCurrencySymbol', type: CommonFieldTypes.SingleLineText },
      { name: 'outstandingTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'outstandingDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'costBreakdownLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'outstandingTotalLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'branchDetailsLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'branchLocationIcon', type: CommonFieldTypes.RichText },
      { name: 'branchPhoneIcon', type: CommonFieldTypes.RichText },
      { name: 'branchPhoneMessage', type: CommonFieldTypes.MultiLineText },
      { name: 'outstandingInfoMessage', type: CommonFieldTypes.SingleLineText },
      { name: 'selectPaymentCardLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'noSavedCardDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'cvvLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cvvHelpText', type: CommonFieldTypes.SingleLineText },
      { name: 'addNewCardText', type: CommonFieldTypes.SingleLineText },
      { name: 'addCardInfoMessage', type: CommonFieldTypes.SingleLineText },
      { name: 'termsPrefixText', type: CommonFieldTypes.SingleLineText },
      { name: 'termsLinkText', type: CommonFieldTypes.SingleLineText },
      { name: 'confirmAndPayText', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
