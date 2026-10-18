import { Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the HistoryPageT component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance
 */
export default function HistoryPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'HistoryPage',
    templateName: 'HistoryPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
