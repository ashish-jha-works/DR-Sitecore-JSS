import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the VerifyOTP component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function VerifyOTP(manifest: Manifest): void {
  manifest.addComponent({
    name: 'VerifyOTP',
    templateName: 'VerifyOTP',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'backgroundImage', type: CommonFieldTypes.Image },

      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'subHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'resendCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
