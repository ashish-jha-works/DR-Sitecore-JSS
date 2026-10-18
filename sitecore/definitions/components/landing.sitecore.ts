import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the Landing component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function Landing(manifest: Manifest): void {
  manifest.addComponent({
    name: 'Landing',
    templateName: 'Landing',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      // Header Section
      { name: 'logoLink', type: CommonFieldTypes.GeneralLink },
      { name: 'logoImage', type: CommonFieldTypes.Image },
      { name: 'loginCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'registerCTA', type: CommonFieldTypes.GeneralLink },

      // Hero Content Section
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'subTitle', type: CommonFieldTypes.SingleLineText },

      // Features List (Using ContentList to handle the array in your YAML)
      { name: 'features', type: CommonFieldTypes.ContentList },

      // App Store Links & Visuals
      { name: 'qrCode', type: CommonFieldTypes.Image },
      { name: 'appStoreLink', type: CommonFieldTypes.GeneralLink },
      { name: 'appStoreImage', type: CommonFieldTypes.Image },
      { name: 'googlePlayLink', type: CommonFieldTypes.GeneralLink },
      { name: 'googlePlayImage', type: CommonFieldTypes.Image },
      { name: 'downloadText', type: CommonFieldTypes.SingleLineText },
      { name: 'backgroundImage', type: CommonFieldTypes.Image },

      // Hero Phone Image
      { name: 'heroImage', type: CommonFieldTypes.Image },
    ],
  });
}
