import { SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the OutstandingPage component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function OutstandingPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'OutstandingPage',
    templateName: 'OutstandingPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
