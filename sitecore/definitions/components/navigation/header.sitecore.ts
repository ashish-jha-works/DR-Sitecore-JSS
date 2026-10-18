import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the Header component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function Header(manifest: Manifest): void {
  manifest.addComponent({
    name: 'Header',
    templateName: 'Header',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      // Logo Section
      { name: 'logoLink', type: CommonFieldTypes.GeneralLink },
      { name: 'logoImage', type: CommonFieldTypes.Image },

      // Navigation Links
      { name: 'navigationLinks', type: CommonFieldTypes.ContentList },

      // Current Page Name
      { name: 'pageName', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
