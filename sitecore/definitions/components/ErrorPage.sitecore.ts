import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ErrorPage component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function ErrorPage(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ErrorPage',
    templateName: 'ErrorPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'errorStateImage', type: CommonFieldTypes.RichText },
      { name: 'backgroundImage', type: CommonFieldTypes.Image },
      { name: 'returnToHomeCTA', type: CommonFieldTypes.GeneralLink },
      { name: 'backCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
