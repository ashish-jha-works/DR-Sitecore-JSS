import { Field, ImageField, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface ConfirmDetailsFields {
  fields: {
    title: Field<string>;
    subTitle: Field<string>;
    otpRequiredLabel: Field<string>;

    emailHeadingLabel: Field<string>;
    currentEmailLabel: Field<string>;
    emailLabel: Field<string>;

    mobileHeadingLabel: Field<string>;
    currentMobileLabel: Field<string>;
    mobileLabel: Field<string>;

    verifyEmailCTALabel: Field<string>;
    verifyOTPCTALabel: Field<string>;
    otpInfoMessage: Field<string>;

    cancelCTALabel: Field<string>;
    submitCTALabel: Field<string>;

    confirmEmailModalHeading: Field<string>;
    confirmEmailModalSubHeading: Field<string>;

    notReceivedOTPLabel: Field<string>;
    resendLabel: Field<string>;

    confirmMobileModalHeading: Field<string>;
    confirmMobileModalSubHeading: Field<string>;

    verifiedLabel: Field<string>;

    detailsConfirmedModalHeading: Field<string>;
    detailsConfirmedModalDescription: Field<string>;

    returnToHomeCTA: LinkField;

    detailsConfirmedSuccessImage: ImageField;
  };
}
