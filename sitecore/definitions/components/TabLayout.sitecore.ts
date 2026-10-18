import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

export default function TabLayout(manifest: Manifest): void {
  manifest.addComponent({
    name: 'TabLayout',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      {
        name: 'items',
        type: CommonFieldTypes.ContentList,
        displayName: 'Tab Items',
      },
    ],
    placeholders: ['tab-content-1', 'tab-content-2', 'tab-content-3', 'tab-content-4'],
  });

  manifest.addComponent({
    name: 'TabLayoutItem',
    templateName: 'TabLayoutItem',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'Label', type: CommonFieldTypes.SingleLineText },
      { name: 'Key', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
