import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ContentCardSlider component to the disconnected manifest.
 */
export default function ContentCardSlider(manifest: Manifest): void {
  // 1. Define the Parent Slider Component
  manifest.addComponent({
    name: 'ContentCardSlider',
    templateName: 'ContentCardSlider',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'version', type: CommonFieldTypes.Number },
      {
        name: 'cards',
        type: CommonFieldTypes.ContentList,
      },
    ],
  });

  manifest.addComponent({
    name: 'ContentCardSliderItem',
    templateName: 'ContentCardSliderItem',
    fields: [
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.MultiLineText },
      { name: 'cta', type: CommonFieldTypes.GeneralLink },
      { name: 'image', type: CommonFieldTypes.Image },
      { name: 'images', type: CommonFieldTypes.ContentList },
      { name: 'version', type: CommonFieldTypes.Number },
    ],
  });
}
