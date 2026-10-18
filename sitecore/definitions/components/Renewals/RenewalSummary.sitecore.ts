import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

export default function RenewalSummary(manifest: Manifest): void {
  manifest.addComponent({
    name: 'RenewalSummary',
    templateName: 'RenewalSummary',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'digitalConfirmationMessage', type: CommonFieldTypes.MultiLineText },
      { name: 'physicalConfirmationMessage', type: CommonFieldTypes.MultiLineText },
      { name: 'documentsReceivedMessage', type: CommonFieldTypes.SingleLineText },
      { name: 'summaryTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'leasePeriodLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentScheduleLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'installmentsLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'totalPaymentLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentMethodLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentDateLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'cardEndingLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentUsingCardLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentUsingChequeLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentUsingDirectDebitLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'installmentLabel', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
