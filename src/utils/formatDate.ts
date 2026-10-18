// utils/formatDate.ts

/**
 * Formats a date string into a localized GB format.
 * @param dateString - The raw date string or Date object
 * @param monthType - The format of the month: "numeric" | "2-digit" | "long" | "short" | "narrow"
 */
export const formatDate = (
  dateString: string | Date,
  monthType: Intl.DateTimeFormatOptions['month'] = 'short'
): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // Check for invalid date objects
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: monthType,
    year: 'numeric',
  }).format(date);
};
