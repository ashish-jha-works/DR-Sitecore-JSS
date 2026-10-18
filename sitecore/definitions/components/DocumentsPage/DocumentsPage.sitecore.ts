import { SitecoreIcon, Manifest, CommonFieldTypes } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the NotificationsPage component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function DocumentsPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'DocumentsPage',
    templateName: 'DocumentsPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'documentUploadInfoText', type: CommonFieldTypes.SingleLineText },
      { name: 'downloadErrorModalTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'statusReviewInProgress', type: CommonFieldTypes.SingleLineText },
      { name: 'statusDocumentRejected', type: CommonFieldTypes.SingleLineText },
      { name: 'noUtilityDocumentImage', type: CommonFieldTypes.RichText },
      { name: 'noUtilityDocumentMessage', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
