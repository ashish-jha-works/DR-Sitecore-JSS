import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the QuickLinks component to the disconnected manifest.
 */
export default function QuickLinks(manifest: Manifest): void {
  // Parent component
  manifest.addComponent({
    name: 'QuickLinks',
    templateName: 'QuickLinks',
    icon: SitecoreIcon.Link,
    fields: [
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      {
        name: 'children',
        type: CommonFieldTypes.ContentList, // matches your YAML 'children'
        // Each child will be a QuickLinkItem
      },
      { name: 'version', type: CommonFieldTypes.Number },
    ],
  });

  // Child component (slide)
  manifest.addComponent({
    name: 'QuickLinkItem',
    templateName: 'QuickLinkItem',
    fields: [
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.RichText },
      { name: 'cardIcon', type: CommonFieldTypes.Image },
    ],
  });
}
