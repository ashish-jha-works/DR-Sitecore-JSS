import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ContentCard component to the disconnected manifest.
 */
export default function ContentCard(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ContentCard',
    templateName: 'ContentCard',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'list', type: CommonFieldTypes.ContentList },
      { name: 'cta', type: CommonFieldTypes.GeneralLink },
      { name: 'ctaIcon', type: CommonFieldTypes.RichText },
      { name: 'icon', type: CommonFieldTypes.RichText },
      { name: 'communityName', type: CommonFieldTypes.SingleLineText },
      // Change 'image' to 'images' and use ContentList
      { name: 'images', type: CommonFieldTypes.ContentList },
      { name: 'version', type: CommonFieldTypes.Number },
      { name: 'applyMargin', type: CommonFieldTypes.Number },
    ],
  });
}
