import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the HeroBanner component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function HeroBanner(manifest: Manifest): void {
  manifest.addComponent({
    name: 'HeroBanner',
    templateName: 'HeroBanner',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'isFullBanner', type: CommonFieldTypes.Checkbox },
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'userName', type: CommonFieldTypes.SingleLineText },
      { name: 'address', type: CommonFieldTypes.SingleLineText },
      { name: 'addressIcon', type: CommonFieldTypes.Image },
      { name: 'heroImage', type: CommonFieldTypes.Image },
      { name: 'bannerSm', type: CommonFieldTypes.Checkbox },
    ],
  });
}
