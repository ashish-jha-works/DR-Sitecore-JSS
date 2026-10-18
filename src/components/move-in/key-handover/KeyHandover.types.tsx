import { CommonFieldTypes } from '@sitecore-jss/sitecore-jss-dev-tools';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface KeyHandoverFields {
  headingIcon: Field<string>;
  title: Field<string>;
  description: Field<string>;
  backCTALabel: Field<string>;
  submitCTALabel: Field<string>;

  handoverSuccessModalTitle: Field<string>;
  handoverSuccessModalCloseCTALabel: Field<string>;

  detailsSectionTitle: Field<string>;
  detailsSectionDescription: Field<string>;
  handoverDateTimeLabel: Field<string>;
  contactOptionsLabel: Field<string>;
  rescheduleCTALabel: Field<string>;
  infoText: Field<string>;

  rescheduleModalTitle: Field<string>;
  rescheduleModalDescription: Field<string>;
  rescheduleSubmitCTALabel: Field<string>;
  rescheduleSuccessInfoText: Field<string>;
  additionalInfoSectionIcon: CommonFieldTypes.RichText;
  additionalInfoHeading: Field<string>;
  profileType6InspectionDataIcon: CommonFieldTypes.RichText;
  profileType6InspectionDataDescription: Field<string>;
}
export interface KeyHandoverProps {
  fields: KeyHandoverFields;
}
