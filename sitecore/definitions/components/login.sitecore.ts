import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the Login component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function Login(manifest: Manifest): void {
  manifest.addComponent({
    name: 'Login',
    templateName: 'Login',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'backgroundImage', type: CommonFieldTypes.Image },

      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'loginCTALabel', type: CommonFieldTypes.SingleLineText },

      { name: 'emailLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'emailHelper', type: CommonFieldTypes.SingleLineText },

      { name: 'passwordLabel', type: CommonFieldTypes.SingleLineText },

      { name: 'forgotPasswordLink', type: CommonFieldTypes.GeneralLink },

      { name: 'newAccountLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'registerLink', type: CommonFieldTypes.GeneralLink },

      { name: 'unableToLoginLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'unableToLoginLink', type: CommonFieldTypes.GeneralLink },
    ],
  });
}
