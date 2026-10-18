import { SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ScheduledCollectionSkeleton component to the disconnected manifest.
 */
export default function ScheduledCollectionSkeleton(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ScheduledCollectionSkeleton',
    templateName: 'ScheduledCollectionSkeleton',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
