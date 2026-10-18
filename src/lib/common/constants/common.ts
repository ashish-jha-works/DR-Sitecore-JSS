import CommunityIcon from 'assets/icons/CommunityIcon';
import DocumentIcon from 'assets/icons/DocumentIcon';
import MaintenanceIcon from 'assets/icons/MaintenanceIcon';

export const DUBAI_RESIDENTIAL = 'Dubai Residential';

export const SUBMIT_BUTTON_LABEL = 'Submit';

export const USER_ROLES = {
  Tenant: 1,
  Occupant: 2,
  CorporateManager: 3,
  AccomodationManager: 4,
  NewLeaseUser: 5,
  SingleUnitCorporate: 6,
  MultiUnitTenant: 7,
  SubProfile: 8,
};

export const PAYMENT_SUMMARY_CATEGORIES = {
  OUTSTANDING_PAYMENTS: 'Outstanding Payments',
  UPCOMING_PAYMENTS: 'Upcoming Payments',
};

export const PAYMENT_CARDS = {
  MASTERCARD: 'MASTERCARD',
  VISA: 'VISA',
  AMEX: 'AMERICAN_EXPRESS',
};

export const SERVICE_REQUEST_TYPE = {
  MAINTENANCE: 'maintenance',
  COMMUNITY: 'community',
  LEASING: 'leasing',
};

export const SERVICE_REQUEST_CONFIG = {
  [SERVICE_REQUEST_TYPE.MAINTENANCE]: {
    icon: MaintenanceIcon,
    title: 'Create new maintenance request',
    description: 'Services related to your home upkeep',
    id: '1',
  },
  [SERVICE_REQUEST_TYPE.COMMUNITY]: {
    icon: CommunityIcon,
    title: 'Create new community care request',
    description: 'Community-related maintenance, suggestions and complaints',
    id: '2',
  },
  [SERVICE_REQUEST_TYPE.LEASING]: {
    icon: DocumentIcon,
    title: 'Create new lease request',
    description: 'Enquiries related to your lease',
    id: '3',
  },
};

export const RESERVATION_STATUS_STYLES: Record<string, string> = {
  Cancelled: 'bg-danger-50 text-color-error border border-danger-500',
  Upcoming: 'bg-success-50 text-color-success border border-success-500',
  Previous: 'bg-lilac-100 text-navy-500 border border-lilac-300',
  '': '',
};
