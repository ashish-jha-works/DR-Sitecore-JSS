import { Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the CommunityPage component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance
 */
export default function CommunityPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'CommunityPage',
    templateName: 'CommunityPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
