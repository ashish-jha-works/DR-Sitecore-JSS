import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the VerifyEmail component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function VerifyEmail(manifest: Manifest): void {
  manifest.addComponent({
    name: 'VerifyEmail',
    templateName: 'VerifyEmail',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'backgroundImage', type: CommonFieldTypes.Image },

      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'subHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'alreadySentHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'alreadyResentHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelLabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
