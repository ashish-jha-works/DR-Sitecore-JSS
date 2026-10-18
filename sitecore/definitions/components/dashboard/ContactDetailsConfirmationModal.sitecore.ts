import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ContactDetailsConfirmationModal component to the disconnected manifest.
 */
export default function ContactDetailsConfirmationModal(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ContactDetailsConfirmationModal',
    templateName: 'ContactDetailsConfirmationModal',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'heaidng1', type: CommonFieldTypes.SingleLineText },
      { name: 'heaidng2', type: CommonFieldTypes.SingleLineText },
      { name: 'desc1', type: CommonFieldTypes.SingleLineText },
      { name: 'desc2', type: CommonFieldTypes.SingleLineText },
      { name: 'dismissCTA', type: CommonFieldTypes.SingleLineText },
      { name: 'confirmCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'icon', type: CommonFieldTypes.Image },
    ],
  });
}
