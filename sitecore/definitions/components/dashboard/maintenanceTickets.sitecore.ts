import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the MaintenanceTickets component to the disconnected manifest.
 */
export default function MaintenanceTickets(manifest: Manifest): void {
  // 1. Define the Parent Slider Component
  manifest.addComponent({
    name: 'MaintenanceTickets',
    templateName: 'MaintenanceTickets',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'viewAllLink', type: CommonFieldTypes.GeneralLink },
    ],
  });
}
