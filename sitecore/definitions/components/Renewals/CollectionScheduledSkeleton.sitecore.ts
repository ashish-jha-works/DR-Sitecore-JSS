import { SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the CollectionScheduledSkeleton component to the disconnected manifest.
 */
export default function CollectionScheduledSkeleton(manifest: Manifest): void {
  manifest.addComponent({
    name: 'CollectionScheduledSkeleton',
    templateName: 'CollectionScheduledSkeleton',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
