import { Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface DirectDebitPageFields {
  headerIcon: Field<string>;
  heading: Field<string>;
  desc: Field<string>;
  cancelCTALabel: Field<string>;
  submitCTALabel: Field<string>;
}

export interface DirectDebitPageProps {
  fields: DirectDebitPageFields;
}
