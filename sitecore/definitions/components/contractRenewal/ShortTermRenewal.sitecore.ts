import { CommonFieldTypes, Manifest, SitecoreIcon } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ShortTermRenewal component to the disconnected manifest.
 * @param {Manifest} manifest Manifest instance
 */
export default function ShortTermRenewal(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ShortTermRenewal',
    templateName: 'ShortTermRenewal',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'extensionPeriodTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'installmentPlanTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'cancelButtonText', type: CommonFieldTypes.SingleLineText },
      { name: 'confirmButtonText', type: CommonFieldTypes.SingleLineText },
      { name: 'monthOption1', type: CommonFieldTypes.SingleLineText },
      { name: 'monthOption2', type: CommonFieldTypes.SingleLineText },
      { name: 'monthOption3', type: CommonFieldTypes.SingleLineText },
      { name: 'monthOption4', type: CommonFieldTypes.SingleLineText },
      { name: 'monthOption5', type: CommonFieldTypes.SingleLineText },
      { name: 'monthOption6', type: CommonFieldTypes.SingleLineText },
      { name: 'installmentOption1', type: CommonFieldTypes.SingleLineText },
      { name: 'installmentOption2', type: CommonFieldTypes.SingleLineText },
      { name: 'infoMessage', type: CommonFieldTypes.SingleLineText },
      { name: 'submittedRequestTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'leasePeriodLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'installmentPlanLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'submittedSuccessMessage', type: CommonFieldTypes.MultiLineText },
      { name: 'successModalHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'successModalDescription', type: CommonFieldTypes.MultiLineText },
      { name: 'successModalButtonText', type: CommonFieldTypes.SingleLineText },
      { name: 'paymentOptionsTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'proceedButtonText', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
