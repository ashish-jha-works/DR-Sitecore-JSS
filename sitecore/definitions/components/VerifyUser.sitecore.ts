import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the VerifyUser component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function VerifyUser(manifest: Manifest): void {
  manifest.addComponent({
    name: 'VerifyUser',
    templateName: 'VerifyUser',
    icon: SitecoreIcon.DocumentTag,
    fields: [{ name: 'backgroundImage', type: CommonFieldTypes.Image }],
  });
}
