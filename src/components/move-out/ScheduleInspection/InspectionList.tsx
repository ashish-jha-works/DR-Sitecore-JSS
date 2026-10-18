import DownloadIcon from 'assets/icons/DownloadIcon';
import React from 'react';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';

const InspectionList = ({ fields, ProfileType, authorizationLetterUrl }: any) => {
  return (
    <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="flex items-center gap-4">
          <CustomRichText field={fields?.inspectionIcon} />
          <Text tag="h1" field={fields?.inspectionHeading} className="text-[16px] md:text-[20px]" />
        </div>
        <div className="inspection-list">
          {fields?.inspectionList?.map((inspectionItem: any, index: number) => (
            <div
              className="flex items-start gap-3 py-4 lg:py-5.5 border-b border-solid border-[#EBEDFF]"
              key={index.toString()}
            >
              <CustomRichText field={inspectionItem?.fields?.icon} />
              <Text
                tag="p"
                field={inspectionItem?.fields?.description}
                className="text-body font-light"
              />
            </div>
          ))}
          {Number(ProfileType) === 6 ? (
            <div className="flex items-start gap-3 py-4 lg:py-5.5 border-b border-solid border-[#EBEDFF]">
              <CustomRichText field={fields?.profileType6InspectionDataIcon} />
              <Text
                tag="p"
                field={fields?.profileType6InspectionDataDescription}
                className="text-body font-light flex-1"
              />
              {authorizationLetterUrl ? (
                <a
                  href={authorizationLetterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download authorization letter template"
                  className="shrink-0"
                >
                  <DownloadIcon className="size-6 text-lilac-500 cursor-pointer" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InspectionList;
