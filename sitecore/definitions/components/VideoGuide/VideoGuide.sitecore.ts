import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the VideoGuide component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance
 */
export default function VideoGuide(manifest: Manifest): void {
  manifest.addComponent({
    name: 'VideoGuide',
    templateName: 'VideoGuide',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'videoFile', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
