import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the MoveOutUploadDocuments component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function MoveOutUploadDocuments(manifest: Manifest): void {
  manifest.addComponent({
    name: 'MoveOutUploadDocuments',
    templateName: 'MoveOutUploadDocuments',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'uploadUtilityDocumentHeadingIcon', type: CommonFieldTypes.RichText },

      { name: 'title', type: CommonFieldTypes.SingleLineText },

      { name: 'acceptedFormatsLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'acceptedFormatsTerms', type: CommonFieldTypes.SingleLineText },

      { name: 'documentUploadInfoText', type: CommonFieldTypes.SingleLineText },

      { name: 'uploadErrorMessage', type: CommonFieldTypes.SingleLineText },

      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },

      { name: 'documentsUploadSuccessModalTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'documentsUploadSuccessModalDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'proceedCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
