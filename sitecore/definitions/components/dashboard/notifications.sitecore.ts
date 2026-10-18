import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the Notifications component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function Notifications(manifest: Manifest): void {
  manifest.addComponent({
    name: 'Notifications',
    templateName: 'Notifications',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'outstandingPaymentLink', type: CommonFieldTypes.GeneralLink },
      { name: 'renewLeaseLink', type: CommonFieldTypes.GeneralLink },
      { name: 'moveOutNoticeLink', type: CommonFieldTypes.GeneralLink },
      { name: 'contactUsLink', type: CommonFieldTypes.GeneralLink },
      { name: 'moveInLink', type: CommonFieldTypes.GeneralLink },
      { name: 'resumeMoveInLink', type: CommonFieldTypes.GeneralLink },
      { name: 'keyHandoverLink', type: CommonFieldTypes.GeneralLink },
      { name: 'resumeMoveOutLink', type: CommonFieldTypes.GeneralLink },
      { name: 'moveOutRefundLink', type: CommonFieldTypes.GeneralLink },
      { name: 'viewAllNotificationsLink', type: CommonFieldTypes.GeneralLink },
    ],
  });
}
