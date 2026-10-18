import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the MoveOutRefundInProgress component to the disconnected manifest.
 */
export default function MoveOutRefundInProgress(manifest: Manifest): void {
  manifest.addComponent({
    name: 'MoveOutRefundInProgress',
    templateName: 'MoveOutRefundInProgress',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'titleIcon', type: CommonFieldTypes.RichText },
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'processingTimePrefix', type: CommonFieldTypes.SingleLineText },
      { name: 'processingTimeSuffix', type: CommonFieldTypes.SingleLineText },
      { name: 'beneficiaryNameLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'beneficiaryBankLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentMethodLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'accountNumberLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentOption1', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentOption2', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentOption3', type: CommonFieldTypes.SingleLineText },
      { name: 'phoneIcon', type: CommonFieldTypes.RichText },
      { name: 'queryPrefixText', type: CommonFieldTypes.SingleLineText },
      { name: 'customerCareNumber', type: CommonFieldTypes.SingleLineText },
      { name: 'warningIcon', type: CommonFieldTypes.RichText },
      { name: 'warningMessage', type: CommonFieldTypes.SingleLineText },
      { name: 'backToHomeText', type: CommonFieldTypes.SingleLineText },
      { name: 'backToHomeLink', type: CommonFieldTypes.GeneralLink },
      { name: 'loadingText', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
