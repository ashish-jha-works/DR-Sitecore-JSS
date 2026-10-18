import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ReviewContract component to the disconnected manifest.
 */
export default function ReviewContract(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ReviewContract',
    templateName: 'ReviewContract',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'backCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'clipBoardIcon', type: CommonFieldTypes.RichText },
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'acknowledgementText', type: CommonFieldTypes.SingleLineText },
      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
