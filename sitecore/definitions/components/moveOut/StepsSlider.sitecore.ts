import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the StepsSlider component to the disconnected manifest.
 */
export default function StepsSlider(manifest: Manifest): void {
  manifest.addComponent({
    name: 'StepsSlider',
    templateName: 'StepsSlider',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'cta', type: CommonFieldTypes.GeneralLink },
      { name: 'list', type: CommonFieldTypes.RichText },
    ],
  });
}
