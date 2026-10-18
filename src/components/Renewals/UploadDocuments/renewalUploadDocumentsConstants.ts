export const RENEWAL_PERSONAL_DOCUMENTS = [
  {
    Attachment_Type: 'Passport Copy of Tenant',
    DisplayName: 'Passport',
    TemplateCode: 'DOC_PASSPORT',
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'Emirates ID Copy',
    DisplayName: 'Emirates ID',
    TemplateCode: 'DOC_EMR_ID',
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'Resident Visa Copy',
    DisplayName: 'Visa',
    TemplateCode: 'DOC_VISA',
    Status: '',
    version: 1,
  },
];

export const RENEWAL_CORPORATE_DOCUMENTS = [
  {
    Attachment_Type: 'Passport Copy of Tenant',
    DisplayName: 'Passport',
    TemplateCode: 'DOC_PASSPORT',
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'Trade License',
    DisplayName: 'Trade License',
    TemplateCode: 'DOC_LICENSE',
    Status: '',
    version: 1,
  },
  {
    Attachment_Type: 'Resident Visa Copy',
    DisplayName: 'Visa',
    TemplateCode: 'DOC_VISA',
    Status: '',
    version: 1,
  },
];

export const RENEWAL_ACCEPTED_FILE_TYPES = ['.jpg', '.pdf'];
export const RENEWAL_MAX_FILE_SIZE = 5 * 1024 * 1024;

export const getDocumentHelperText = (displayName: string): string => {
  const requiresFrontBack = ['Passport', 'Emirates ID', 'Emirates_ID'];
  return requiresFrontBack.some((name) => displayName.includes(name))
    ? `Please upload the front and back of your ${displayName} in a single document`
    : '';
};
