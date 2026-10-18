import DownloadIcon from 'assets/icons/DownloadIcon';
import Link from 'next/link';
import React from 'react';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';

const SingleUnitCorporateSection = ({ fields, authorizationLetterUrl }: any) => {
  return (
    <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="flex items-center gap-4">
          <CustomRichText field={fields?.additionalInfoSectionIcon} />
          <Text
            tag="h1"
            field={fields?.additionalInfoHeading}
            className="text-[16px] md:text-[20px]"
          />
        </div>
        <div className="inspection-list">
          <div className="flex gap-3 py-3">
            <CustomRichText field={fields?.profileType6InspectionDataIcon} />
            <Text
              tag="p"
              field={fields?.profileType6InspectionDataDescription}
              className="text-body font-light flex-1"
            />
            <Link href={authorizationLetterUrl ? authorizationLetterUrl : '#'}>
              <DownloadIcon className="size-6 text-lilac-500 cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUnitCorporateSection;
