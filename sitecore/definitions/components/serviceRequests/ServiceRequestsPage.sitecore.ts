import { Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ServiceRequestsPage component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance
 */
export default function ServiceRequestsPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ServiceRequestsPage',
    templateName: 'ServiceRequestsPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
