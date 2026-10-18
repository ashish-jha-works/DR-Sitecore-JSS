import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the CollectionScheduled component to the disconnected manifest.
 */
export default function CollectionScheduled(manifest: Manifest): void {
  manifest.addComponent({
    name: 'CollectionScheduled',
    templateName: 'CollectionScheduled',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'headingIcon', type: CommonFieldTypes.RichText },
      { name: 'collectionTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'collectionDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'deliveryTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'deliveryDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'collectionAddressLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'deliveryAddressLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'collectionDateTimeLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'deliveryDateTimeLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleModalIcon', type: CommonFieldTypes.RichText },
      { name: 'rescheduleCollectionModalTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleDeliveryModalTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleCollectionModalDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'rescheduleDeliveryModalDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'rescheduleTimeslotSelectionMessage', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleHolidayBannerText', type: CommonFieldTypes.MultiLineText },
      { name: 'rescheduleCollectionCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleDeliveryCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'reschedulingCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'collectionReminderTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'collectionReminderDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'deliveryReminderTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'deliveryReminderDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'renewalProposalLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'pdcDocumentLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'directDebitFormLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'creditCardSideLetterLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'directDebitSideLetterLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'viewPdcCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'checkRenewalSummaryCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
