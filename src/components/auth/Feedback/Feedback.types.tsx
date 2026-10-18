import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface FeedbackFields {
  fields: {
    backgroundImage: ImageField;
    heading: Field<string>;

    namePlaceHolder: Field<string>;
    emailPlaceHolder: Field<string>;

    mobilePlaceHolder: Field<string>;
    communityPlaceHolder: Field<string>;

    buildingPlaceHolder: Field<string>;

    issueDescriptionLabel: Field<string>;
    issueDescriptionPlaceHolder: Field<string>;

    issueWithRegistrationLabel: Field<string>;
    issueWithLoginLabel: Field<string>;

    uploadImageLabel: Field<string>;
    uploadHelper: Field<string>;
    uploadImageCTALabel: Field<string>;
    submitCTALabel: Field<string>;
  };
}
