import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface ForgotPasswordFields {
  fields: {
    backgroundImage: ImageField;
    heading: Field<string>;
    description: Field<string>;
    emailLabel: Field<string>;
    emailHelper: Field<string>;
    submitCTALabel: Field<string>;
  };
}
