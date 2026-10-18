import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the PageBanner component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function PageBanner(manifest: Manifest): void {
  manifest.addComponent({
    name: 'PageBanner',
    templateName: 'PageBanner',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'bannerImage', type: CommonFieldTypes.Image },
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
