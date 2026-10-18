import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

export function FAQItemSchema(manifest: Manifest): void {
  manifest.addComponent({
    name: 'FAQItem',
    templateName: 'FAQItem',
    fields: [
      { name: 'Question', type: CommonFieldTypes.SingleLineText },
      { name: 'Answer', type: CommonFieldTypes.RichText },
    ],
  });
}

export function FAQGroupSchema(manifest: Manifest): void {
  manifest.addComponent({
    name: 'FAQGroup',
    templateName: 'FAQGroup',
    fields: [
      { name: 'tagName', type: CommonFieldTypes.SingleLineText },
      { name: 'tagIcon', type: CommonFieldTypes.Image },
      { name: 'faqIcon', type: CommonFieldTypes.RichText },
      { name: 'items', type: CommonFieldTypes.ContentList },
    ],
  });
}

/**
 * Adds the FAQPage component to the disconnected manifest.
 */

export default function FAQPage(manifest: Manifest): void {
  FAQItemSchema(manifest);
  FAQGroupSchema(manifest);

  manifest.addComponent({
    name: 'FAQPage',
    templateName: 'FAQPage',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'cta', type: CommonFieldTypes.GeneralLink },
      { name: 'faqs', type: CommonFieldTypes.ContentList },
    ],
  });
}
