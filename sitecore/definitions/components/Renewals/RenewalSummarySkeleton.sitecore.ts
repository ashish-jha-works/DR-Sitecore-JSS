import { SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the RenewalSummarySkeleton component to the disconnected manifest.
 */
export default function RenewalSummarySkeleton(manifest: Manifest): void {
  manifest.addComponent({
    name: 'RenewalSummarySkeleton',
    templateName: 'RenewalSummarySkeleton',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
