import { SitecoreIcon, Manifest, CommonFieldTypes } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the EventCards component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function EventCards(manifest: Manifest): void {
  manifest.addComponent({
    name: 'EventCards',
    templateName: 'EventCards',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'Title', type: CommonFieldTypes.SingleLineText },
      { name: 'DetailsURL', type: CommonFieldTypes.GeneralLink },
      { name: 'items', type: CommonFieldTypes.ContentList },
      { name: 'noResultFoundImage', type: CommonFieldTypes.RichText },
      { name: 'noResultFoundText', type: CommonFieldTypes.SingleLineText },
      { name: 'SubTitle', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
