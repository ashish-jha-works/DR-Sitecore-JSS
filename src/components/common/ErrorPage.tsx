import { Field, ImageField, LinkField, RichTextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { useRouter } from 'next/router';
import React from 'react';
import { CustomImage, CustomLink, CustomRichText, Text } from 'src/common/SitecoreOverrides';

interface ErrorPageProps {
  fields: {
    backgroundImage: ImageField;
    title: Field<string>;
    description: Field<string>;
    errorStateImage: Field<RichTextField>;
    returnToHomeCTA: Field<LinkField>;
    backCTALabel: Field<string>;
  };
}

const ErrorPage = ({ fields }: ErrorPageProps) => {
  const router = useRouter();
  return (
    <section className="relative z-10 lg:min-h-[90vh] w-full overflow-hidden bg-white-pure">
      <CustomImage
        field={fields?.backgroundImage}
        className="absolute bottom-0 left-0 max-w-230.5 h-137.5 w-full object-cover -z-10"
      />
      <div className="container-sm py-16 lg:py-20 px-5 lg:px-auto">
        <div className="flex flex-col items-center justify-center gap-8 lg:gap-10">
          <Text
            tag="h3"
            field={fields?.title}
            className="font-colgent text-[30px] leading-[38px] lg:text-display-3 font-normal"
          />
          <CustomRichText field={fields?.errorStateImage} />
          <CustomRichText
            field={fields?.description}
            className="text-body lg:text-heading-3 font-light text-center"
          />
          <div className="btn-wrapper flex flex-col lg:flex-row justify-center items-center gap-4 md:gap-6 w-full">
            <CustomLink
              field={fields?.returnToHomeCTA}
              className={`${
                fields?.backCTALabel?.value?.length ? 'btn-secondary' : 'btn-primary'
              } w-full lg:max-w-74.5`}
            ></CustomLink>
            {fields?.backCTALabel?.value?.length ? (
              <button
                className="btn btn-primary w-full lg:max-w-74.5"
                onClick={() => router.back()}
              >
                {fields?.backCTALabel?.value}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
