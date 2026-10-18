import { Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ReopenServiceRequestJourney component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance
 */
export default function ReopenServiceRequestJourney(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ReopenServiceRequestJourney',
    templateName: 'ReopenServiceRequestJourney',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
