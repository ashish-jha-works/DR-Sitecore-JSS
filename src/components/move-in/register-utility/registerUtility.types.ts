import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface PrerequisiteItem {
  fields: {
    text: Field<string>;
  };
}

export interface RegisterUtilityFields {
  backToMoveInCTA: LinkField;

  clipBoardIcon: Field<string>;
  desktopIcon: Field<string>;
  redirectIcon: Field<string>;
  mapIcon: Field<string>;
  searchIcon: Field<string>;
  documentIcon: Field<string>;

  title: Field<string>;
  registrationPrerequisiteInfo: Field<string>;

  prerequisiteList: PrerequisiteItem[];

  submitOnlineRequest: Field<string>;
  findCustomerServiceCenter: Field<string>;
  browseUtilityProvider: Field<string>;
  multiProviderInfoLabel: Field<string>;
  viewDetailsCTALabel: Field<string>;

  nextCTALabel: Field<string>;
  submitCTALabel: Field<string>;

  registerUtilitiesInputSectionTitle: Field<string>;
  accountNumberLabel: Field<string>;
  registrationDateLabel: Field<string>;
}

export interface RegisterUtilityProps {
  fields: RegisterUtilityFields;
}

export type Utility = {
  Name: string;
  Type: string;
  WebsiteUrl: string;
  LocationUrl: string;
  Label: string;
  RegistrationNo?: string;
  selectedRegistrationDate?: string;
};

export type UtilityAttachmentKind = 'move-in' | 'move-out-request' | 'move-out-final';

const normalizeCommunity = (community?: string | null) =>
  (community || '').replace(/\s/g, '').toUpperCase();

const isChillerCommunity = (community?: string | null) => {
  const value = normalizeCommunity(community);
  return value === 'MANAZELALKHOR' || value === 'DUBAIWHARF';
};

export const getUtilityAttachmentType = (
  utility: Utility,
  community?: string | null,
  kind: UtilityAttachmentKind = 'move-in'
): string => {
  const type = (utility.Type || '').toUpperCase().trim();
  const name = (utility.Name || '').toUpperCase().trim();
  const chiller = isChillerCommunity(community);

  const isDewa =
    name.includes('DEWA') || type === 'ELECTRICITY AND WATER' || type.includes('ELECTRICITY');
  const isGas = name.includes('EMGAS') || type === 'GAS' || type.includes('GAS');
  const isAc =
    name.includes('EMPOWER') ||
    name.includes('CHILLER') ||
    type === 'AC' ||
    type.includes('COOLING') ||
    type.includes('CHILLER') ||
    type.includes('AIR COND');

  if (kind === 'move-in') {
    if (isDewa) return 'DEWA Registration Receipt';
    if (isGas) return 'Emgas Registration Receipt';
    if (isAc) return chiller ? 'Chiller Registration Receipt' : 'Empower Registration Receipt';
  }

  if (kind === 'move-out-request') {
    if (isDewa) return 'Final DEWA Bill Request';
    if (isGas) return 'Final Emgas Bill Request';
    if (isAc) return chiller ? 'Final Chiller Bill Request' : 'Final Empower Bill Request';
  }

  if (kind === 'move-out-final') {
    if (isDewa) return 'Final DEWA Bill';
    if (isGas) return 'Emgas Final Bill';
    if (isAc) return chiller ? 'Final Chiller bill' : 'Final Empower bill';
  }

  return '';
};
