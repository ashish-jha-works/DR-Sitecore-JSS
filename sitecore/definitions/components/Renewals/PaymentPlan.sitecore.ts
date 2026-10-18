import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the PaymentPlan component to the disconnected manifest.
 */
export default function PaymentPlan(manifest: Manifest): void {
  manifest.addComponent({
    name: 'PaymentPlan',
    templateName: 'PaymentPlan',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'headerIcon', type: CommonFieldTypes.RichText },
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentOptionsHeaderIcon', type: CommonFieldTypes.RichText },
      { name: 'paymentOptionsTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
