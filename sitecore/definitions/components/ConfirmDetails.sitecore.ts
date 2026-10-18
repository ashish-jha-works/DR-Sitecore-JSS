import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-dev-tools';

/**
 * Adds the ConfirmDetails component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.js) when `jss manifest` is run.
 * @param {Manifest} manifest Manifest instance to add components to
 */
export default function ConfirmDetails(manifest: Manifest): void {
  manifest.addComponent({
    name: 'ConfirmDetails',
    templateName: 'ConfirmDetails',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'title', type: CommonFieldTypes.SingleLineText },
      { name: 'subTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'otpRequiredLabel', type: CommonFieldTypes.SingleLineText },

      { name: 'emailHeadingLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'currentEmailLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'emailLabel', type: CommonFieldTypes.SingleLineText },

      { name: 'mobileHeadingLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'currentMobileLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'mobileLabel', type: CommonFieldTypes.SingleLineText },

      { name: 'verifyEmailCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'verifyOTPCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'otpInfoMessage', type: CommonFieldTypes.MultiLineText },

      { name: 'cancelCTALabel', type: CommonFieldTypes.SingleLineText },
      { name: 'submitCTALabel', type: CommonFieldTypes.SingleLineText },

      { name: 'confirmEmailModalHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'confirmEmailModalSubHeading', type: CommonFieldTypes.SingleLineText },

      { name: 'notReceivedOTPLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'resendLabel', type: CommonFieldTypes.SingleLineText },

      { name: 'confirmMobileModalHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'confirmMobileModalSubHeading', type: CommonFieldTypes.SingleLineText },

      { name: 'verifiedLabel', type: CommonFieldTypes.SingleLineText },

      { name: 'detailsConfirmedModalHeading', type: CommonFieldTypes.SingleLineText },
      { name: 'detailsConfirmedModalDescription', type: CommonFieldTypes.MultiLineText },

      { name: 'returnToHomeCTA', type: CommonFieldTypes.GeneralLink },

      {
        name: 'detailsConfirmedSuccessImage',
        type: CommonFieldTypes.Image,
      },
    ],
  });
}
