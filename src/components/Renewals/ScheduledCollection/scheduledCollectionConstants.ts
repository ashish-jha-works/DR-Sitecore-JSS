export const RENEWAL_SCHEDULE_ROUTES = {
  schedulePickup: '/contract-renewal/schedule-pickup',
  collectionScheduled: '/contract-renewal/collection-scheduled',
  contractRenewal: '/contract-renewal',
  summary: '/contract-renewal/summary',
} as const;

export const RENEWAL_COLLECTION_TIME_SLOTS = [
  '08:00 AM - 12:00 PM',
  '12:00 PM - 03:00 PM',
  '03:00 PM - 06:00 PM',
] as const;

export const RENEWAL_SCHEDULE_ADDRESS_SEPARATOR = '$';

export const RENEWAL_SCHEDULE_REQUEST = {
  createdBy: 'Portal',
  schedule: 'Schedule',
  reschedule: 'Reschedule',
  pickUp: 'PickUp',
  delivery: 'Delivery',
} as const;

export const sanitizeScheduleAddressPart = (value: string) => value.trim().replace(/,/g, ' ');

export const buildScheduleCollectionAddress = (form: {
  addressLine1: string;
  addressLine2: string;
  poBox: string;
  emirate: string;
}) =>
  [
    sanitizeScheduleAddressPart(form.addressLine1),
    sanitizeScheduleAddressPart(form.addressLine2),
    sanitizeScheduleAddressPart(form.poBox),
    sanitizeScheduleAddressPart(form.emirate),
  ].join(RENEWAL_SCHEDULE_ADDRESS_SEPARATOR);

export function parseScheduledCollectionAddress(scheduledAddress?: string | null) {
  const empty = { addressLine1: '', addressLine2: '', poBox: '', city: '' };
  if (!scheduledAddress || !scheduledAddress.includes('$')) return empty;

  const parts = scheduledAddress.split('$');
  if (parts.length >= 4) {
    return {
      addressLine1: parts[0]?.trim() ?? '',
      addressLine2: parts[1]?.trim() ?? '',
      poBox: parts[2]?.trim() ?? '',
      city: parts[3]?.trim() ?? '',
    };
  }

  if (parts.length === 3) {
    const maybePo = parts[1]?.trim() ?? '';
    const isPo = /^[0-9]+(\s)*$/.test(maybePo);
    if (isPo) {
      return {
        addressLine1: parts[0]?.trim() ?? '',
        addressLine2: '',
        poBox: maybePo,
        city: parts[2]?.trim() ?? '',
      };
    }
    return {
      addressLine1: parts[0]?.trim() ?? '',
      addressLine2: maybePo,
      poBox: parts[2]?.trim() ?? '',
      city: '',
    };
  }

  if (parts.length === 2) {
    return {
      addressLine1: parts[0]?.trim() ?? '',
      addressLine2: '',
      poBox: parts[1]?.trim() ?? '',
      city: '',
    };
  }

  return empty;
}
