import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the SpecialOffers component to the disconnected manifest.
 */
export default function SpecialOffers(manifest: Manifest): void {
  // 1. Define the Parent Slider Component
  manifest.addComponent({
    name: 'SpecialOffers',
    templateName: 'SpecialOffers',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'Title', type: CommonFieldTypes.SingleLineText },
      { name: 'URL', type: CommonFieldTypes.GeneralLink },
      { name: 'DetailsURL', type: CommonFieldTypes.GeneralLink },
      {
        name: 'items',
        type: CommonFieldTypes.ContentList,
      },
      { name: 'applyMargin', type: CommonFieldTypes.Number },
    ],
  });

  manifest.addComponent({
    name: 'SpecialOffersItem',
    templateName: 'SpecialOffersItem',
    fields: [
      { name: 'Title', type: CommonFieldTypes.SingleLineText },
      { name: 'SubTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'images', type: CommonFieldTypes.ContentList },
    ],
  });
}
