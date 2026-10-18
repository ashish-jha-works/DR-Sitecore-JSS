import { ComponentType, SVGProps } from 'react';

import AirConditionIcon from 'assets/icons/category/AirConditionIcon';
import CarpentryIcon from 'assets/icons/category/CarpentryIcon';
import DoorsIcon from 'assets/icons/category/DoorsIcon';
import ElectricalIcon from 'assets/icons/category/ElectricalIcon';
import LightingIcon from 'assets/icons/category/LightingIcon';
import MasonryIcon from 'assets/icons/category/MasonryIcon';
import PlumbingIcon from 'assets/icons/category/PlumbingIcon';
import WindowsIcon from 'assets/icons/category/WindowsIcon';
import FireSystemIcon from 'assets/icons/category/FireSystemIcon';
import PaintingIcon from 'assets/icons/category/PaintingIcon';
import GeneralIcon from 'assets/icons/category/GeneralIcon';
import EmergencyIcon from 'assets/icons/category/EmergencyIcon';
import SuggestionIcon from 'assets/icons/category/SuggestionIcon';
import CommunityMaintenanceIcon from 'assets/icons/category/CommunityMaintenanceIcon';
import ComplaintIcon from 'assets/icons/category/ComplaintIcon';
import RenewalEnquiryIcon from 'assets/icons/category/RenewalEnquiry';
import TerminationEnquiryIcon from 'assets/icons/category/TerminationEnquiryIcon';
import ChangeOfUnitIcon from 'assets/icons/category/ChangeOfUnitIcon';
import TransferOfLeaseIcon from 'assets/icons/category/TransferOfLeaseIcon';
import PaymentRelatedEnquiryIcon from 'assets/icons/category/PaymentRelatedEnquiryIcon';
import NewHomeEnquiryIcon from 'assets/icons/category/NewHomeEnquiryIcon';

export const CATEGORY_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  plumbing: PlumbingIcon,
  airConditioning: AirConditionIcon,
  lighting: LightingIcon,
  electrical: ElectricalIcon,
  carpentry: CarpentryIcon,
  doors: DoorsIcon,
  windows: WindowsIcon,
  masonry: MasonryIcon,
  fireSystem: FireSystemIcon,
  painting: PaintingIcon,
  general: GeneralIcon,
  emergency: EmergencyIcon,
  suggestion: SuggestionIcon,
  communityMaintenance: CommunityMaintenanceIcon,
  complaint: ComplaintIcon,
  renewalEnquiry: RenewalEnquiryIcon,
  terminationEnquiry: TerminationEnquiryIcon,
  changeOfUnit: ChangeOfUnitIcon,
  transferOfLease: TransferOfLeaseIcon,
  paymentRelatedEnquiry: PaymentRelatedEnquiryIcon,
  newHomeEnquiry: NewHomeEnquiryIcon,
};
