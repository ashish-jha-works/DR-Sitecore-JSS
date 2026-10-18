import { Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ServiceRequestHistoryPage component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance
 */
export default function ServiceRequestHistoryPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ServiceRequestHistoryPage',
    templateName: 'ServiceRequestHistoryPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
