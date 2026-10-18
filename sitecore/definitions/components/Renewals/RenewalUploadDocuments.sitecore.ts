import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the RenewalUploadDocuments component to the disconnected manifest.
 */
export default function RenewalUploadDocuments(manifest: Manifest): void {
  manifest.addComponent({
    name: 'RenewalUploadDocuments',
    templateName: 'RenewalUploadDocuments',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'headerIcon', type: CommonFieldTypes.RichText },
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'acceptedFormatsTerms', type: CommonFieldTypes.SingleLineText },
      { name: 'documentUploadInfoText', type: CommonFieldTypes.SingleLineText },
      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'statusReviewInProgress', type: CommonFieldTypes.SingleLineText },
      { name: 'statusDocumentRejected', type: CommonFieldTypes.SingleLineText },
      { name: 'downloadErrorModalTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'uploadErrorMessage', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
