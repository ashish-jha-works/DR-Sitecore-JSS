import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the CardSlider component to the disconnected manifest.
 */
export default function CardSlider(manifest: Manifest): void {
  manifest.addComponent({
    name: 'CardSlider',
    templateName: 'CardSlider',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'Title', type: CommonFieldTypes.SingleLineText },
      { name: 'URL', type: CommonFieldTypes.GeneralLink },
      { name: 'DetailsURL', type: CommonFieldTypes.GeneralLink },
      {
        name: 'items',
        type: CommonFieldTypes.ContentList,
        // In a real Sitecore environment, you'd likely use a Template ID or
        // a specific Datasource location for these items.
      },
      { name: 'applyMargin', type: CommonFieldTypes.Number },
    ],
  });

  // Defining the structure for the individual Card items
  manifest.addComponent({
    name: 'CardSliderItem',
    templateName: 'CardSliderItem',
    fields: [
      { name: 'link', type: CommonFieldTypes.GeneralLink },
      { name: 'image', type: CommonFieldTypes.Image },
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'desc', type: CommonFieldTypes.SingleLineText },
      { name: 'list', type: CommonFieldTypes.ContentList },
      { name: 'SubTitle', type: CommonFieldTypes.SingleLineText },
    ],
  });

  // Defining the structure for the nested list items (Icon + Text)
  manifest.addComponent({
    name: 'CardsListItem',
    templateName: 'CardsListItem',
    fields: [
      { name: 'icon', type: CommonFieldTypes.RichText }, // RichText is used to store the raw SVG string
      { name: 'text', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
