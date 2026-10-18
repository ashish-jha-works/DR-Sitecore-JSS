import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the MyBookings component to the disconnected manifest.
 */
export default function MyBookings(manifest: Manifest): void {
  manifest.addComponent({
    name: 'MyBookings',
    templateName: 'MyBookings',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'icon', type: CommonFieldTypes.RichText },
      { name: 'viewCalendarCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'viewCalendarCTAIcon', type: CommonFieldTypes.RichText },
      { name: 'emptyStateImage', type: CommonFieldTypes.Image },
      { name: 'emptyStateText', type: CommonFieldTypes.SingleLineText },
      { name: 'applyMargin', type: CommonFieldTypes.Number },
    ],
  });
}
