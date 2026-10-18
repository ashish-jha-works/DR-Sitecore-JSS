import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

export default function LegalContentPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'LegalContentPage',
    templateName: 'LegalContentPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'content', type: CommonFieldTypes.RichText, displayName: 'Page content (HTML)' },
    ],
  });
}
