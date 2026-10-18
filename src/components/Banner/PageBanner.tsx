import { JSX } from 'react';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { CustomImage } from 'src/common/SitecoreOverrides';

export default function PageBanner({ fields }: any): JSX.Element {
  return (
    <div className="relative z-1 flex min-h-56.25 items-center justify-center overflow-hidden px-10 py-8 text-center">
      <div className="absolute inset-0 -z-1">
        <CustomImage
          field={fields?.bannerImage}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(360deg,rgba(3,0,189,0.2)_1.62%,rgba(127,21,13,0.2)_100%)]" />
      </div>
      <Text
        tag="h1"
        field={fields?.heading}
        className="font-colgent text-[36px] leading-11 lg:text-[70px] lg:leading-21 font-normal text-white-pure"
      />
    </div>
  );
}
