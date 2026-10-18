import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ScheduledCollection component to the disconnected manifest.
 */
export default function ScheduledCollection(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ScheduledCollection',
    templateName: 'ScheduledCollection',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'headingIcon', type: CommonFieldTypes.RichText },
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.MultiLineText },
      { name: 'deliveryTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'deliveryDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'holidayBannerText', type: CommonFieldTypes.MultiLineText },
      { name: 'timeslotSelectionMessage', type: CommonFieldTypes.SingleLineText },
      { name: 'addressIcon', type: CommonFieldTypes.RichText },
      { name: 'addressTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'addressDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'deliveryAddressDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'addressLine1Label', type: CommonFieldTypes.SingleLineText },
      { name: 'addressLine2Label', type: CommonFieldTypes.SingleLineText },
      { name: 'poBoxLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'emirateLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'mobileNumberLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'editCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'saveCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'documentsReadyTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'documentsReadyDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'documentsDeliveredTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'documentsDeliveredDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'renewalProposalLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'pdcDocumentLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'directDebitFormLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'creditCardSideLetterLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'directDebitSideLetterLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'viewPdcCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'scheduleCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'schedulingCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
