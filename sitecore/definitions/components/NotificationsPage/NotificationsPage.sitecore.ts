import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the NotificationsPage component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function NotificationsPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'NotificationsPage',
    templateName: 'NotificationsPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      {
        name: 'NoResultsFoundImage',
        type: CommonFieldTypes.Image,
      },
      {
        name: 'NoNewNofiticationMessage',
        type: CommonFieldTypes.SingleLineText,
      },
      {
        name: 'NoArchiveNofiticationMessage',
        type: CommonFieldTypes.SingleLineText,
      },
    ],
  });
}
