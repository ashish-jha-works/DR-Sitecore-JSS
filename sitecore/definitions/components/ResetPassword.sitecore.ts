import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ResetPassword component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function ResetPassword(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ResetPassword',
    templateName: 'ResetPassword',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'backgroundImage', type: CommonFieldTypes.Image },

      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'passwordLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'passwordHelper', type: CommonFieldTypes.SingleLineText },

      { name: 'confirmPasswordLabel', type: CommonFieldTypes.SingleLineText },

      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
