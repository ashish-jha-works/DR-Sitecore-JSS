import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the MoveOutPermit component to the disconnected manifest.
 */
export default function MoveOutPermit(manifest: Manifest): void {
  manifest.addComponent({
    name: 'MoveOutPermit',
    templateName: 'MoveOutPermit',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'icon', type: CommonFieldTypes.RichText },
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.RichText },
      { name: 'ctaLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'ctaIcon', type: CommonFieldTypes.RichText },
      { name: 'proceedCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'downloadErrorModalHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'downloadErrorModalDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'downloadErrorModalCloseLabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
