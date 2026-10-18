import { Field, ImageField, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface RegisterFields {
  fields: {
    backgroundImage: ImageField;
    heading: Field<string>;
    registerCTALabel: Field<string>;

    emailLabel: Field<string>;
    emailHelper: Field<string>;

    passwordLabel: Field<string>;
    passwordHelper: Field<string>;

    confirmPasswordLabel: Field<string>;

    termsAndConditionLabel: Field<string>;
    termsAndConditionLink: LinkField;

    existingAccountLabel: Field<string>;
    loginLink: LinkField;

    unableToRegisterLabel: Field<string>;
    unableToRegisterLink: LinkField;
  };
}
