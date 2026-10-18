import { SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the PaymentsPage component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function PaymentsPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'PaymentsPage',
    templateName: 'PaymentsPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
