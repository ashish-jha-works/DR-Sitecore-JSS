export interface PdcItem {
  InstallementDate: string;
  InstallmentAmount: number;
  AmountInWords: string;
  RecieptName: string;
}

export interface PdcResponse {
  PdcList: PdcItem[];
}

export interface RenewalProposalDetails {
  PROPOSAL_ID: string;
  INVOICE_FREQUENCY: string;
  Cooling?: unknown;
  Parking?: number | string | null;
  Storage?: number | string | null;
}

export interface RenewalSpecials {
  CHARGE_AMOUNT: number;
  SPECIAL_TYPE: string;
}

export interface LeaseCharge {
  Amount: string | number;
  Charge_Description: string;
  Charge_Code?: string;
}

export interface RenewalProposal {
  TotalPayableAmount: number;
  Res_Renewal_Proposal: {
    ME_Res_Renewal_Proposal_dtls_v: RenewalProposalDetails;
  };
  RES_Renewal_Specials?: {
    ME_RES_Renewal_Specials_V: RenewalSpecials;
  };
  Lease_charges?: {
    ME_Lease_charges_V: LeaseCharge[];
  };
}

export interface InstallmentPlanItem {
  NoOfInstallment: string | number;
  AnyCardValidForSelectedPayment: boolean;
  RenewalProposal: RenewalProposal;
  pdcResponse: PdcResponse;
}

export interface InstallmentPlanAPIResponse {
  SelectedInstallmentPlan?: string | number;
  InstallmentPlans?: InstallmentPlanItem[];
}

export interface InstallmentBreakdownRow {
  installmentDate: string;
  installmentNumber: number;
  installmentAmount: number;
  installmentAmountInWords1?: string;
  installmentAmountInWords2?: string;
  recieptName: string;
  pdcList: PdcItem[];
  paymentDesc: string;
}

export interface InstallmentTypeData {
  installmentDetails: InstallmentBreakdownRow[];
}

// Maps installment-plan index -> whether an existing card is valid for that plan
export interface CardValidityMap {
  [installmentIndex: number]: boolean;
}

export interface PaymentPlanFields {
  cancelCTALabel?: { value: string };
  submitCTALabel?: { value: string };
  [key: string]: any;
}

export interface LeaseChargeSummary {
  total: number;
  ejariFees: number;
  adminFee: number;
}
