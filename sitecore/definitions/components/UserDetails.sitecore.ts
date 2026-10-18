import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the UserDetails component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function UserDetails(manifest: Manifest): void {
  manifest.addComponent({
    name: 'UserDetails',
    templateName: 'UserDetails',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'communityName', type: CommonFieldTypes.SingleLineText },
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'contacts', type: CommonFieldTypes.ContentList },
      { name: 'customercarecontacts', type: CommonFieldTypes.ContentList },
    ],
  });
}
