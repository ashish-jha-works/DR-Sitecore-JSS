import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the FAQs component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance
 */
export default function FAQs(manifest: Manifest): void {
  manifest.addComponent({
    name: 'FAQs',
    templateName: 'FAQs',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      {
        name: 'title',
        type: CommonFieldTypes.SingleLineText,
      },
      {
        name: 'cta',
        type: CommonFieldTypes.GeneralLink,
      },
      {
        name: 'faqs',
        type: CommonFieldTypes.ContentList,
      },
      {
        name: 'version',
        // SIT stores this as a string ("2"); Accordion uses version == 2 for chevron style
        type: CommonFieldTypes.SingleLineText,
      },
    ],
  });
}
