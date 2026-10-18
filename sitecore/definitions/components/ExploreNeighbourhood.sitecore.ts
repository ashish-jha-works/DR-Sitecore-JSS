import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ExploreNeighbourhood component to the disconnected manifest.
 */
export default function ExploreNeighbourhood(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ExploreNeighbourhood',
    templateName: 'ExploreNeighbourhood',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'communityName', type: CommonFieldTypes.SingleLineText },
      { name: 'facilities', type: CommonFieldTypes.ContentList },
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'desc', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
