import { Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the CreateRequestJourney component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance
 */
export default function CreateRequestJourney(manifest: Manifest): void {
  manifest.addComponent({
    name: 'CreateRequestJourney',
    templateName: 'CreateRequestJourney',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
