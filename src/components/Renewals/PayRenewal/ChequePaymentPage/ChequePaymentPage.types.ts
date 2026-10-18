import { Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface ChequePaymentPageFields {
  heading: Field<string>;
  warningInfoText: Field<string>;
  chequeIssuedByThirdPartyOptionsLabel: Field<string>;

  // Cheque Issuer Details
  chequeIssuerDetailsHeadingIcon: Field<string>;
  chequeIssuerDetailsHeading: Field<string>;
  chequeIssuerDetailsDesc: Field<string>;
  chequeIssuerNameLabel: Field<string>;
  passportNumberLabel: Field<string>;
  passportExpiryLabel: Field<string>;
  EIDNumberLabel: Field<string>;
  EIDExpiryLabel: Field<string>;
  tradeLicenseNumberLabel: Field<string>;
  tradeLicenseExpiryLabel: Field<string>;
  chequeIssuerCancelCTALabel: Field<string>;
  chequeIssuerSaveCTALabel: Field<string>;
  chequeIssuerEditCTALabel: Field<string>;

  // Cheque Details
  chequeDetailsHeadingIcon: Field<string>;
  chequeDetailsHeading: Field<string>;
  chequeDetailsDesc: Field<string>;
  chequeBankNameToAllChequeOptionLabel: Field<string>;
  chequeDateLabel: Field<string>;
  chequeAmountLabel: Field<string>;
  chequeNumberLabel: Field<string>;
  bankNameLabel: Field<string>;

  // CTA Labels
  cancelCTALabel: Field<string>;
  submitCTALabel: Field<string>;
}

export interface ChequePaymentPageProps {
  fields: ChequePaymentPageFields;
}

export interface ChequeAccordionProps {
  fields: any;
  installment: any;
  defaultOpen?: boolean;
  bankList: any[];
  selectedBank?: any;

  // new props
  chequeIndex: number;
  isSameBankForAllCheque: boolean;
  firstChequeBank?: any;
  onBankChange?: (bank: any) => void;
}

export type ChequeSectionStatus = 'editing' | 'saved';

export type ChequeInstallment = {
  number: number;
  date: string;
  amount: string;
  chequeNumber: string;
  bankName: string;
  savedChequeNumber: string | null;
  savedBankName: string | null;
  status: ChequeSectionStatus;
};

export type IndividualIssuerFields = {
  chequeIssuerName: string;
  passportNumber: string;
  passportExpiry: Date | null;
  EIDNumber: string;
  EIDExpiry: Date | null;
};

export type CompanyIssuerFields = {
  chequeIssuerName: string;
  tradeLicenseNumber: string;
  tradeLicenseExpiry: Date | null;
};
