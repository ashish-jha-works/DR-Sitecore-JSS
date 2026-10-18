import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the EventDetails component to the disconnected manifest.
 */
export default function EventDetails(manifest: Manifest): void {
  manifest.addComponent({
    name: 'EventDetails',
    templateName: 'EventDetails',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'backCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'items', type: CommonFieldTypes.ContentList },
    ],
  });
}
