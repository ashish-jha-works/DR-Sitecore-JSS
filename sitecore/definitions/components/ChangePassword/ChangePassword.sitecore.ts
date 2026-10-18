import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

export default function ChangePassword(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ChangePassword',
    templateName: 'ChangePassword',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'formTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'currentPasswordLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'newPasswordLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'confirmPasswordLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'newPasswordRulesText', type: CommonFieldTypes.SingleLineText },
      { name: 'submitButtonText', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
