import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the KeyHandover component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function KeyHandover(manifest: Manifest): void {
  manifest.addComponent({
    name: 'KeyHandover',
    templateName: 'KeyHandover',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'headingIcon', type: CommonFieldTypes.RichText },
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.SingleLineText },
      { name: 'backCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },

      { name: 'handoverSuccessModalTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'handoverSuccessModalCloseCTALabel', type: CommonFieldTypes.SingleLineText },

      { name: 'detailsSectionTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'detailsSectionDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'handoverDateTimeLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'contactOptionsLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'infoText', type: CommonFieldTypes.SingleLineText },

      { name: 'rescheduleModalTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleModalDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleSubmitCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleSuccessInfoText', type: CommonFieldTypes.SingleLineText },

      { name: 'additionalInfoSectionIcon', type: CommonFieldTypes.RichText },
      { name: 'additionalInfoHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'profileType6InspectionDataIcon', type: CommonFieldTypes.RichText },
      { name: 'profileType6InspectionDataDescription', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
