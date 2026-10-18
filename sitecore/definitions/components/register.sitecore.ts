import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the Register component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function Register(manifest: Manifest): void {
  manifest.addComponent({
    name: 'Register',
    templateName: 'Register',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'backgroundImage', type: CommonFieldTypes.Image },

      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'registerCTALabel', type: CommonFieldTypes.SingleLineText },

      { name: 'emailLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'emailHelper', type: CommonFieldTypes.SingleLineText },

      { name: 'passwordLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'passwordHelper', type: CommonFieldTypes.SingleLineText },

      { name: 'confirmPasswordLabel', type: CommonFieldTypes.SingleLineText },

      { name: 'termsAndConditionLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'termsAndConditionLink', type: CommonFieldTypes.GeneralLink },

      { name: 'existingAccountLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'loginLink', type: CommonFieldTypes.GeneralLink },

      { name: 'unableToRegisterLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'unableToRegisterLink', type: CommonFieldTypes.GeneralLink },
    ],
  });
}
