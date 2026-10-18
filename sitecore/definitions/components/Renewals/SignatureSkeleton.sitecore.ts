import { SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the SignatureSkeleton component to the disconnected manifest.
 */
export default function SignatureSkeleton(manifest: Manifest): void {
  manifest.addComponent({
    name: 'SignatureSkeleton',
    templateName: 'SignatureSkeleton',
    icon: SitecoreIcon.DocumentTag,
    fields: [],
  });
}
