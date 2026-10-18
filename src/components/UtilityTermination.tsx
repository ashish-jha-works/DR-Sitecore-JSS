import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CustomRichText } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import { Utility } from './move-in/register-utility/registerUtility.types';

const UTILITIES_ICONS: Record<string, string> = {
  GAS: '/assets/svg/utility-gas.svg',
  AC: '/assets/svg/utility-ac.svg',
  'AC COOLING': '/assets/svg/utility-ac.svg',
  'ELECTRICITY AND WATER': '/assets/svg/utility-electricity.svg',
};

const getUtilityIcon = (type?: string) => {
  const normalized = (type || '').toUpperCase().trim();
  if (UTILITIES_ICONS[normalized]) return UTILITIES_ICONS[normalized];
  if (normalized.includes('ELECTRICITY') || normalized.includes('WATER')) {
    return UTILITIES_ICONS['ELECTRICITY AND WATER'];
  }
  if (normalized.includes('GAS')) return UTILITIES_ICONS.GAS;
  if (normalized.includes('AC') || normalized.includes('COOLING')) return UTILITIES_ICONS.AC;
  return '';
};

const RENEWALS_DATA = [
  {
    label: 'Visa',
    icon: '/assets/svg/visa-icon.svg',
  },
  {
    label: 'Emirates ID',
    icon: '/assets/svg/emirates-id-icon.svg',
  },
  {
    label: 'Passport',
    icon: '/assets/svg/passport-icon.svg',
  },
  {
    label: 'Trade license',
    icon: '/assets/svg/trade-license-document-icon.svg',
    id: 'tradeLicense',
  },
];

export default function UtilityTermination({ fields }: any) {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();
  const [utilities, setUtilities] = useState<Utility[]>([]);

  const isRenewal = fields?.isRenewal?.value;

  const { mutate: fetchUtilities } = useApiMutation<any, any>(
    () => `/Community/Utilities/${tCode}`,
    'GET',
    true
  );

  // Fetch Utilities
  useEffect(() => {
    if (!tCode) return;

    fetchUtilities(null, {
      onSuccess: (res) => {
        if (res?.length) {
          setUtilities(res);
        } else openModal('error-modal');
      },
      onError: () => openModal('error-modal'),
    });
  }, [tCode]);

  return (
    <section className="UtilityTermination my-8">
      <div className="container-sm">
        <Text
          tag="h3"
          field={fields?.heading}
          className="text-heading-2 font-normal text-navy-500 mb-4 md:mb-5"
        />
        <CustomRichText
          className="[&_ul]:list-disc [&_ul]:ps-4 font-light"
          field={fields?.description}
        />
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-5 mt-4 lg:mt-5">
          {!isRenewal
            ? utilities.map(({ Type, Name }) => (
                <li
                  key={Type}
                  className="text-center shrink-0 border border-solid border-lilac-300 p-4 lg:p-5 rounded-xl bg-white-pure"
                >
                  <Image
                    src={getUtilityIcon(Type)}
                    alt=""
                    width={68}
                    height={55}
                    className="mb-4 lg:mb-5 inline w-[68px] h-[55px] object-contain"
                  />
                  <h5 className="font-bold uppercase text-body-sm lg:text-body">{Type}</h5>
                  <h4 className="text-navy-500 font-light mt-1 text-body-sm lg:text-body">
                    {Name}
                  </h4>
                </li>
              ))
            : RENEWALS_DATA.map(({ label, icon, id }) => (
                <li
                  key={label}
                  className="text-center shrink-0 border border-solid border-lilac-300 p-3 lg:p-5 rounded-xl bg-white-pure"
                >
                  <Image
                    src={icon}
                    alt=""
                    width={56}
                    height={56}
                    className="mb-3 lg:mb-5 inline size-14"
                  />
                  <h4 className="text-navy-500 font-light text-[16px] lg:text-[20px]">{label}</h4>
                  {id === 'tradeLicense' ? (
                    <p className="text-body-sm font-light">(Business tenants only)</p>
                  ) : null}
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
