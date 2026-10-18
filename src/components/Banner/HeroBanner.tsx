import React from 'react';
import { Text, Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { CustomImage } from 'src/common/SitecoreOverrides';
import { useUserStore } from 'src/store/useUserStore';

type HeroProps = {
  fields: {
    isFullBanner?: Field<boolean>;
    title?: Field<string>;
    userName?: Field<string>;
    address?: Field<string>;
    addressIcon?: ImageField;
    heroImage?: any;
    bannerSm?: Field<boolean>;
  };
};

export default function HeroBanner({ fields }: HeroProps) {
  const { FirstName, CommunityDisplayName, UnitNumber } = useUserStore();
  const isSmallBanner = Boolean(fields?.bannerSm?.value);
  const showUserDetails = !isSmallBanner;
  const addressText = [UnitNumber, CommunityDisplayName].filter(Boolean).join(', ');

  return (
    <section
      className={`HeroBanner text-white-pure bg-navy-500 overflow-hidden ${
        isSmallBanner ? 'md:h-56' : 'md:h-122'
      }`}
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-2 md:items-stretch">
        <div className="col-span-1 flex flex-col justify-center items-center md:items-start p-8 lg:p-18">
          <Text
            tag="h1"
            field={fields?.title}
            className={`font-colgent font-normal text-start ${
              isSmallBanner
                ? 'text-4xl md:text-7xl mb-0 text-center md:text-start'
                : 'text-4xl md:text-7xl mb-2'
            }`}
          />
          {showUserDetails && (
            <>
              <h2 className="text-heading-1 font-normal mb-5 text-center md:text-start">
                {FirstName}
              </h2>
              {addressText && (
                <p className="flex items-center text-body text-center md:text-start">
                  {fields?.addressIcon?.value?.src && (
                    <CustomImage field={fields.addressIcon} className="me-3 size-6 shrink-0" />
                  )}
                  {addressText}
                </p>
              )}
            </>
          )}
        </div>
        <div className="col-span-1 relative h-37.5 overflow-hidden md:h-full">
          <CustomImage
            field={fields.heroImage}
            className="h-full w-full object-cover md:absolute md:inset-0"
          />
        </div>
      </div>
    </section>
  );
}
