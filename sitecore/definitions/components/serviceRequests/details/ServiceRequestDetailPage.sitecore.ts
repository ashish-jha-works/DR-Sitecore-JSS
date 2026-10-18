import { Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ServiceRequestDetailPage component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance
 */
export default function ServiceRequestDetailPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ServiceRequestDetailPage',
    templateName: 'ServiceRequestDetailPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
