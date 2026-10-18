import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ScheduleInspection component to the disconnected manifest.
 */
export default function ScheduleInspection(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ScheduleInspection',
    templateName: 'ScheduleInspection',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'icon', type: CommonFieldTypes.RichText },
      { name: 'disabledIcon', type: CommonFieldTypes.RichText },
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      { name: 'description', type: CommonFieldTypes.RichText },
      { name: 'scheduledInspectionHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'scheduledInspectionDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'inspectionDateTimeLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'timeslotSelectionMessage', type: CommonFieldTypes.SingleLineText },
      { name: 'scheduleCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleInspectionCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleCTAIcon', type: CommonFieldTypes.RichText },
      { name: 'infoMessage', type: CommonFieldTypes.RichText },
      { name: 'scheduleAllowedInfo', type: CommonFieldTypes.RichText },
      { name: 'inspectionHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'inspectionIcon', type: CommonFieldTypes.RichText },
      { name: 'inspectionList', type: CommonFieldTypes.ContentList },
      { name: 'profileType6InspectionDataDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'profileType6InspectionDataIcon', type: CommonFieldTypes.RichText },
      { name: 'inspectionScheduledSuccessTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'inspectionScheduledErrorTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'inspectionScheduledErrorDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'rescheduleModalHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'inspectionReScheduledSuccessTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'inspectionReScheduledSuccessInfo', type: CommonFieldTypes.SingleLineText },
      { name: 'inspectionBeyond30DaysInfo', type: CommonFieldTypes.SingleLineText },
      { name: 'leaseExpiredInfo', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
