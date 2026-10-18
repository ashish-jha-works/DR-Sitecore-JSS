import { SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the UnitSelectionPage component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function UnitSelectionPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'UnitSelectionPage',
    templateName: 'UnitSelectionPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
