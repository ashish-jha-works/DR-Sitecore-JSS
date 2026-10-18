import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the Footer component to the disconnected manifest.
 */
export default function Footer(manifest: Manifest): void {
  manifest.addComponent({
    name: 'Footer',
    templateName: 'Footer',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'version', type: CommonFieldTypes.Number },

      // Logo Section
      { name: 'logoLink', type: CommonFieldTypes.GeneralLink },
      { name: 'logoImage', type: CommonFieldTypes.Image },

      // App Store Section
      { name: 'appStoreLink', type: CommonFieldTypes.GeneralLink },
      { name: 'appStoreImage', type: CommonFieldTypes.Image },
      { name: 'googlePlayLink', type: CommonFieldTypes.GeneralLink },
      { name: 'googlePlayImage', type: CommonFieldTypes.Image },

      // Customer Care Section
      { name: 'customerCareLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'customerCareNumber', type: CommonFieldTypes.SingleLineText },
      { name: 'customerCareIcon', type: CommonFieldTypes.RichText },

      // Footer Text Content
      { name: 'copyrightText', type: CommonFieldTypes.SingleLineText },
      { name: 'downloadAppText', type: CommonFieldTypes.SingleLineText },

      // Links & Lists (Arrays in YAML)
      { name: 'navLinks', type: CommonFieldTypes.ContentList },
      { name: 'legalLinks', type: CommonFieldTypes.ContentList },
      { name: 'socialLinks', type: CommonFieldTypes.ContentList },
    ],
  });
}
