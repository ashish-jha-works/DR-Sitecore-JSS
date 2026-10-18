export const existingDocumentsList = [
  {
    Attachment_Type: 'Ejari Document',
    DisplayName: 'Ejari Document',
    TemplateCode: ['null'],
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'Renewal Contract - Fully Executed',
    DisplayName: 'Lease Contract',
    TemplateCode: ['null'],
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'New Contract - Fully Executed',
    DisplayName: 'Lease Contract',
    TemplateCode: ['null'],
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'Move In Permit',
    DisplayName: 'Move In Permit',
    TemplateCode: ['null'],
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'Passport Copy of Tenant',
    DisplayName: 'Passport',
    TemplateCode: ['DOC_PASSPORT'],
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'Emirates ID Copy',
    DisplayName: 'Emirates ID',
    TemplateCode: ['DOC_EMR_ID'],
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'Trade License',
    DisplayName: 'Trade License',
    TemplateCode: ['DOC_LICENSE'],
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'Resident Visa Copy',
    DisplayName: 'Visa',
    TemplateCode: ['DOC_VISA'],
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'Power of Attorney',
    DisplayName: 'Power of Attorney',
    TemplateCode: ['DOC_POA'],
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'DEWA Registration Receipt',
    DisplayName: 'DEWA Connection Acknowledgement',
    TemplateCode: ['DEWA_RCPT'],
    Status: '',
    version: 1,
  },
];

export const categoryMap = {
  PERSONAL: ['Passport', 'Emirates ID', 'Visa', 'Trade License', 'Power of Attorney'],
  UTILITY: [
    'DEWA Connection Acknowledgement',
    'AC Cooling Connection Acknowledgement',
    'Gas Connection Acknowledgement',
    'DEWA Termination Notice Acknowledgement',
    'AC Cooling Termination Notice Acknowledgement',
    'Gas Termination Notice acknowledgement',
    'Final DEWA Bill',
    'DEWA Final Bill',
    'AC Cooling Final Bill',
    'Gas Final Bill',
  ],
  CONTRACT: [
    'Lease Contract',
    'Move In Permit',
    'Ejari Certificate',
    'Dubai Residential IBAN Details',
  ],
};

export const CONTRACT_ATTACHMENT_TYPES = [
  'Ejari Document',
  'Memorandum of Understanding',
  'Renewal Contract - Fully Executed',
  'New Contract - Fully Executed',
  'Move In Permit',
  'Dubai Residential IBAN Details',
];

export const definedUtilityData = {
  cardDetailsMoveOut: [
    {
      Attachment_Type: 'Ejari Document',
      DisplayName: 'Ejari Document',
      TemplateCode: ['null'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Renewal Contract - Fully Executed',
      DisplayName: 'Lease Contract',
      TemplateCode: ['null'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'New Contract - Fully Executed',
      DisplayName: 'Lease Contract',
      TemplateCode: ['null'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Move In Permit',
      DisplayName: 'Move In Permit',
      TemplateCode: ['null'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Passport Copy of Tenant',
      DisplayName: 'Passport',
      TemplateCode: ['DOC_PASSPORT'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Emirates ID Copy',
      DisplayName: 'Emirates ID',
      TemplateCode: ['DOC_EMR_ID'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Trade License',
      DisplayName: 'Trade License',
      TemplateCode: ['DOC_LICENSE'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Resident Visa Copy',
      DisplayName: 'Visa',
      TemplateCode: ['DOC_VISA'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Power of Attorney',
      DisplayName: 'Power of Attorney',
      TemplateCode: ['DOC_POA'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Final DEWA Bill Request',
      DisplayName: 'DEWA termination notice acknowledgement',
      TemplateCode: ['DEWA_FIN_REQ'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Final DEWA Bill',
      DisplayName: 'DEWA Final Bill',
      TemplateCode: ['DEWA_FINAL'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'DEWA Registration Receipt',
      DisplayName: 'DEWA Connection Acknowledgement',
      TemplateCode: ['DEWA_RCPT'],
      Status: '',
      version: 1,
    },
  ],
  cardDetailsMoveOutEmpower: [
    {
      Attachment_Type: 'Empower Registration Receipt',
      DisplayName: 'AC Cooling Connection Acknowledgement',
      TemplateCode: ['EMPOWER_RCPT'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Final Empower Bill Request',
      DisplayName: 'AC Cooling termination notice acknowledgement',
      TemplateCode: ['EMPR_FIN_REQ'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Final Empower bill',
      DisplayName: 'AC Cooling Final Bill',
      TemplateCode: ['EMPWR_FINAL'],
      Status: '',
      version: 1,
    },
  ],
  cardDetailsMoveOutEmgas: [
    {
      Attachment_Type: 'Emgas Registration Receipt',
      DisplayName: 'Gas Connection Acknowledgement',
      TemplateCode: ['EMGAS_RCPT'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Final Emgas Bill Request',
      DisplayName: 'Gas termination notice acknowledgement',
      TemplateCode: ['EMGS_FIN_REQ'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Emgas Final Bill',
      DisplayName: 'Gas Final Bill',
      TemplateCode: ['EMGAS_FINAL'],
      Status: '',
      version: 1,
    },
  ],
  cardDetailsMoveOutChiller: [
    {
      Attachment_Type: 'Chiller Registration Receipt',
      DisplayName: 'AC Cooling Connection Acknowledgement',
      TemplateCode: ['CHILLER_RCPT'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Final Chiller Bill Request',
      DisplayName: 'AC Cooling termination notice acknowledgement',
      TemplateCode: ['CHLR_FIN_REQ'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Final Chiller bill',
      DisplayName: 'AC Cooling Final Bill',
      TemplateCode: ['CHILLR_FINAL'],
      Status: '',
      version: 1,
    },
  ],

  // new lease has 5 docs
  cardDetailsNewLease: [
    {
      Attachment_Type: 'Ejari Document',
      DisplayName: 'Ejari Document',
      TemplateCode: ['null'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Renewal Contract - Fully Executed',
      DisplayName: 'Lease Contract',
      TemplateCode: ['null'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'New Contract - Fully Executed',
      DisplayName: 'Lease Contract',
      TemplateCode: ['null'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Passport Copy of Tenant',
      DisplayName: 'Passport',
      TemplateCode: ['LES_DOC_PASS'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Emirates ID Copy',
      DisplayName: 'Emirates ID',
      TemplateCode: ['LES_EMR_ID'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Trade License',
      DisplayName: 'Trade License',
      TemplateCode: ['LES_DOC_TL'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Resident Visa Copy',
      DisplayName: 'Visa',
      TemplateCode: ['LES_DOC_VISA'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Power of Attorney',
      DisplayName: 'Power of Attorney',
      TemplateCode: ['LES_DOC_POA'],
      Status: '',
      version: 1,
    },
  ],

  cardDetailsMovein: [
    {
      Attachment_Type: 'Ejari Document',
      DisplayName: 'Ejari Document',
      TemplateCode: ['null'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Renewal Contract - Fully Executed',
      DisplayName: 'Lease Contract',
      TemplateCode: ['null'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'New Contract - Fully Executed',
      DisplayName: 'Lease Contract',
      TemplateCode: ['null'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Move In Permit',
      DisplayName: 'Move In Permit',
      TemplateCode: ['null'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Passport Copy of Tenant',
      DisplayName: 'Passport',
      TemplateCode: ['LES_DOC_PASS', 'DOC_PASSPORT'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Emirates ID Copy',
      DisplayName: 'Emirates ID',
      TemplateCode: ['LES_EMR_ID', 'DOC_EMR_ID'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Trade License',
      DisplayName: 'Trade License',
      TemplateCode: 'LES_DOC_TL',
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Resident Visa Copy',
      DisplayName: 'Visa',
      TemplateCode: ['LES_DOC_VISA', 'DOC_VISA'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'Power of Attorney',
      DisplayName: 'Power of Attorney',
      TemplateCode: ['LES_DOC_POA'],
      Status: '',
      version: 1,
    },
    {
      Attachment_Type: 'DEWA Registration Receipt',
      DisplayName: 'DEWA Connection Acknowledgement',
      TemplateCode: ['DEWA_RCPT'],
      Status: '',
      version: 1,
    },
  ],

  cardDetailsMoveinEmpower: [
    {
      Attachment_Type: 'Empower Registration Receipt',
      DisplayName: 'AC Cooling Connection Acknowledgement',
      TemplateCode: ['EMPOWER_RCPT'],
      Status: '',
      version: 1,
    },
  ],
  cardDetailsMoveinEmgas: [
    {
      Attachment_Type: 'Emgas Registration Receipt',
      DisplayName: 'Gas Connection Acknowledgement',
      TemplateCode: ['EMGAS_RCPT'],
      Status: '',
      version: 1,
    },
  ],
  cardDetailsMoveinChiller: [
    {
      Attachment_Type: 'Chiller Registration Receipt',
      DisplayName: 'AC Cooling Connection Acknowledgement',
      TemplateCode: ['CHILLER_RCPT'],
      Status: '',
      version: 1,
    },
  ],
};

export const DOCUMENTS_STATUSES = {
  UNDER_REVIEW_STATUSES: [
    'Call',
    'Approved',
    'In Progress',
    'Pending Approval',
    'Scheduled',
    'Resident Appointment',
    'Request Reassignment',
    'Parts Pending',
  ],
  WORK_COMPLETED: 'Work Completed',
  CANCELLED: 'Canceled',
};

export const DOCUMENT_STATUS_TYPE = {
  IN_PROGRESS: 'IN PROGRESS',
  CANCELLED: 'CANCELLED',
};

export const fileMaxSize = 5 * 1024 * 1024; // 5MB

export const PAYMENT_METHOD_MAPPING: Record<number, string> = {
  1: 'Post Dated Cheque (PDCs)',
  2: 'Credit/Debit Card',
  3: '1st Inst by Card & rest by PDCs',
  4: '1st Inst by Card & rest by Direct Debit',
};
