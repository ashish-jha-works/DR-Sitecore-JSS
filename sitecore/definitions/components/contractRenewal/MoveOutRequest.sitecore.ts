import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the MoveOutRequest component to the disconnected manifest.
 * @param {Manifest} manifest Manifest instance
 */
export default function MoveOutRequest(manifest: Manifest): void {
  manifest.addComponent({
    name: 'MoveOutRequest',
    templateName: 'MoveOutRequest',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'reasonTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'specifyTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelButtonText', type: CommonFieldTypes.SingleLineText },
      { name: 'submitButtonText', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
