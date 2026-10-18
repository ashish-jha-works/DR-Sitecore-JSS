import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the CtaTextCard component to the disconnected manifest.
 */
export default function CtaTextCard(manifest: Manifest): void {
  manifest.addComponent({
    name: 'CtaTextCard',
    templateName: 'CtaTextCard',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'cta', type: CommonFieldTypes.GeneralLink },
      { name: 'icon', type: CommonFieldTypes.RichText },
      { name: 'communityName', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
