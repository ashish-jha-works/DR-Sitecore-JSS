import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

export default function ContactUs(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ContactUs',
    templateName: 'ContactUs',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'address', type: CommonFieldTypes.RichText },
      { name: 'phoneText', type: CommonFieldTypes.RichText },
      { name: 'emailText', type: CommonFieldTypes.RichText },
      { name: 'mapLatitude', type: CommonFieldTypes.Number },
      { name: 'mapLongitude', type: CommonFieldTypes.Number },
      { name: 'formTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'messageLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'termsText', type: CommonFieldTypes.RichText },
      { name: 'privacyText', type: CommonFieldTypes.RichText },
      { name: 'submitButtonText', type: CommonFieldTypes.SingleLineText },
      { name: 'followUsTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'socialLinks', type: CommonFieldTypes.ContentList },
    ],
  });
}
