import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the DirectDebitPage component to the disconnected manifest.
 */
export default function DirectDebitPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'DirectDebitPage',
    templateName: 'DirectDebitPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'headerIcon', type: CommonFieldTypes.RichText },
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'desc', type: CommonFieldTypes.SingleLineText },
      // CTA Labels
      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
