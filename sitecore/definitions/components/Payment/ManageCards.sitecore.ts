import { SitecoreIcon, Manifest, CommonFieldTypes } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ManageCards component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function ManageCards(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ManageCards',
    templateName: 'ManageCards',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'noSavedCardDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'infoMessage', type: CommonFieldTypes.SingleLineText },
      { name: 'primaryCardDeleteMessage', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
