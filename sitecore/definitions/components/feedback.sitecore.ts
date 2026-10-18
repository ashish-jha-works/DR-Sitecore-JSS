import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the Feedback component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function Feedback(manifest: Manifest): void {
  manifest.addComponent({
    name: 'Feedback',
    templateName: 'Feedback',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'backgroundImage', type: CommonFieldTypes.Image },
      { name: 'heading', type: CommonFieldTypes.SingleLineText },

      { name: 'namePlaceHolder', type: CommonFieldTypes.SingleLineText },
      { name: 'emailPlaceHolder', type: CommonFieldTypes.SingleLineText },
      { name: 'mobilePlaceHolder', type: CommonFieldTypes.SingleLineText },
      { name: 'communityPlaceHolder', type: CommonFieldTypes.SingleLineText },
      { name: 'buildingPlaceHolder', type: CommonFieldTypes.SingleLineText },
      { name: 'issueDescriptionLabel', type: CommonFieldTypes.MultiLineText },
      { name: 'issueDescriptionPlaceHolder', type: CommonFieldTypes.SingleLineText },
      { name: 'issueWithRegistrationLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'issueWithLoginLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'uploadImageLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'uploadHelper', type: CommonFieldTypes.SingleLineText },
      { name: 'uploadImageCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
