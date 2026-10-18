export const SIGN_METHOD = {
  DIGITAL: 'digital',
  PHYSICAL: 'physical',
} as const;

export const PHYSICAL_SCHEDULE_OPTION = {
  COLLECTION: 'collection',
  DELIVERY: 'delivery',
} as const;

export const RENEWAL_ROUTES = {
  signContract: '/contract-renewal/sign-contract',
  schedulePickup: '/contract-renewal/schedule-pickup',
} as const;

export const RENEWAL_THIRD_PARTY_LETTER_ATTACHMENT_TYPE = 'Side Letter for Credit Card';

export const RENEWAL_DIRECT_DEBIT_SIDE_LETTER_ATTACHMENT_TYPE = 'Side Letter for Direct Debit';
