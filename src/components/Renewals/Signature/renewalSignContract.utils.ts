type SitecoreField = { value?: string } | string | undefined;

export const toSitecoreField = (field: SitecoreField, fallback = ''): { value: string } => {
  if (!field) return { value: fallback };
  if (typeof field === 'string') return { value: field };
  return { value: field.value ?? fallback };
};

export const getFieldValue = (field: SitecoreField, fallback = ''): string => {
  if (!field) return fallback;
  if (typeof field === 'string') return field;
  return field.value ?? fallback;
};
