import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the RenewalSignContract component to the disconnected manifest.
 */
export default function RenewalSignContract(manifest: Manifest): void {
  manifest.addComponent({
    name: 'RenewalSignContract',
    templateName: 'RenewalSignContract',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'signMethodTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'digitalSignIcon', type: CommonFieldTypes.RichText },
      { name: 'digitalSignTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'digitalSignDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'digitalSignFootnote', type: CommonFieldTypes.SingleLineText },
      { name: 'physicalSignIcon', type: CommonFieldTypes.RichText },
      { name: 'physicalSignTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'physicalSignDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'physicalSignFootnote', type: CommonFieldTypes.SingleLineText },
      { name: 'downloadDraftLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'downloadCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'agreementTermsText', type: CommonFieldTypes.SingleLineText },
      { name: 'confirmCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'physicalScheduleTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'collectionIcon', type: CommonFieldTypes.RichText },
      { name: 'collectionTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'collectionDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'deliveryIcon', type: CommonFieldTypes.RichText },
      { name: 'deliveryTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'deliveryDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'documentsReadyTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'documentsReadyDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'documentsDeliveredTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'documentsDeliveredDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'renewalProposalLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'pdcDocumentLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'directDebitFormLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'thirdPartyLetterLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'directDebitSideLetterLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'viewPdcCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'proceedCTALabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
