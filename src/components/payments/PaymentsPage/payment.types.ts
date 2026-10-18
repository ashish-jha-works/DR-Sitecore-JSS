export interface OutstandingPaymentResponse {
  IsSelected: boolean;
  Id: string;
  Title: string;
  Date: string;
  Amount: number;
  Info: string;
  InvoiceNumber: string;
  ChargeCode: string;
  InitiateWaiver: boolean;
}

export interface PaymentsSummaryResponse {
  Category: string;
  Amount: number;
}
export interface UpcomingPaymentsResponse {
  IsSelected: boolean;
  Id: string;
  Title: string;
  Date: string;
  Amount: number;
  Info: string;
  IsDeferPaymentEnabled: boolean;
  DeferPaymentStatus: boolean;
  DefermentCharges: string;
  DefermentPeriod: string;
}

export interface Card {
  CardId: string;
  CardHolderName: string;
  MaskedCardNumber: string;
  ExpiryDate: string; // format: YYYY-MM
  Scheme: 'MASTERCARD' | 'VISA' | 'AMERICAN_EXPRESS' | string;
  ProfileId: string;
  CardToken: string | null;
  CanBeDeleted: boolean;
  IsSelected: boolean;
  PaymentSource: number;
  CVV: string | null;
}

export interface Transaction {
  TransactionDate: string; // ISO date string
  TransactionCurrency: string;
  Amount: string; // comes as string from API
  Description: string;
  ReceptNumber: string;
}

export interface TransactionResponse {
  IsCurrent: boolean;
  Transactions: Transaction[];
}
