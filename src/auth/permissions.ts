import { USER_ROLES } from 'lib/common/constants/common';

const {
  Tenant,
  Occupant,
  CorporateManager,
  AccomodationManager,
  SingleUnitCorporate,
  MultiUnitTenant,
  SubProfile,
} = USER_ROLES;

// 1. Pages everyone can access
export const publicRoutes = [
  '/contact-us',
  '/terms-and-conditions',
  '/privacy-notice',
  '/cookie-notice',
  '/404',
  '/500',
  '/not-found',
  '/dev-500-preview',
];

// 2. Pages ONLY for logged-out users
export const authRoutes = [
  '/',
  '/login',
  '/register',
  '/feedback',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
  '/verify-email',
  '/verify-user',
];

// 3. Role-based protected pages
export const routePermissions: Record<string, number[]> = {
  '/dashboard': [
    Tenant,
    Occupant,
    CorporateManager,
    AccomodationManager,
    SingleUnitCorporate,
    MultiUnitTenant,
    SubProfile,
  ],
  '/contact-details-confirmation': [
    Tenant,
    Occupant,
    CorporateManager,
    AccomodationManager,
    SingleUnitCorporate,
    MultiUnitTenant,
    SubProfile,
  ],
  '/service-request': [
    Tenant,
    Occupant,
    CorporateManager,
    AccomodationManager,
    SingleUnitCorporate,
    MultiUnitTenant,
    SubProfile,
  ],
  '/profile': [
    Tenant,
    Occupant,
    CorporateManager,
    AccomodationManager,
    SingleUnitCorporate,
    MultiUnitTenant,
  ],
  '/changepassword': [
    Tenant,
    Occupant,
    CorporateManager,
    AccomodationManager,
    SingleUnitCorporate,
    MultiUnitTenant,
  ],
  '/renewals': [Tenant, SingleUnitCorporate, MultiUnitTenant],
  '/contract-renewal': [Tenant, SingleUnitCorporate, MultiUnitTenant],
  '/move-in': [Tenant, SingleUnitCorporate, MultiUnitTenant],
  '/move-out': [Tenant, SingleUnitCorporate, MultiUnitTenant],
  '/payment': [Tenant, SingleUnitCorporate, MultiUnitTenant],
  '/community': [Tenant, Occupant, SingleUnitCorporate, MultiUnitTenant, SubProfile],
  '/booking-amenities/create-booking': [Tenant, SingleUnitCorporate, MultiUnitTenant],
  '/booking-amenities/view-booking': [Tenant, SingleUnitCorporate, MultiUnitTenant],
  '/view-booking': [Tenant, SingleUnitCorporate, MultiUnitTenant],
  '/my-documents': [Tenant, SingleUnitCorporate, MultiUnitTenant],
  '/notifications': [
    Tenant,
    Occupant,
    CorporateManager,
    AccomodationManager,
    SingleUnitCorporate,
    MultiUnitTenant,
    SubProfile,
  ],
  '/offers': [Tenant, Occupant, SingleUnitCorporate, MultiUnitTenant, SubProfile],
  '/faqs': [
    Tenant,
    Occupant,
    CorporateManager,
    AccomodationManager,
    SingleUnitCorporate,
    MultiUnitTenant,
    SubProfile,
  ],
  '/unit-selection': [Tenant, SingleUnitCorporate, MultiUnitTenant],
};
