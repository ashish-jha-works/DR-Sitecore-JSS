import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the UtilityTermination component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance
 */
export default function UtilityTermination(manifest: Manifest): void {
  manifest.addComponent({
    name: 'UtilityTermination',
    templateName: 'UtilityTermination',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.RichText },
      { name: 'isRenewal', type: CommonFieldTypes.Checkbox },
    ],
  });
}
