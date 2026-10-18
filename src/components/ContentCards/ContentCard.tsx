import Link from 'next/link';
import { JSX } from 'react';
import { CustomImage, CustomLink, CustomRichText, Text } from 'src/common/SitecoreOverrides';

import ImageSlider from 'components/common/ImageSlider';

const getOfferImageField = (images: any, image: any) => {
  const raw = images?.[0]?.fields?.image || images?.[0] || image;
  if (!raw) return null;
  if (raw?.value?.src) return raw;
  if (raw?.src) return { value: raw };
  return null;
};

export default function ContentCard({ fields, isOfferData = false }: any): JSX.Element {
  const isExplorePropertiesVariant = fields?.version?.value === 2;
  const cardBackgroundClass = isOfferData
    ? 'bg-white-pure'
    : isExplorePropertiesVariant
    ? 'bg-white-pure'
    : fields?.version?.value == 1
    ? 'bg-lilac-100'
    : 'bg-white-pure';

  const offerImageField = isOfferData ? getOfferImageField(fields?.images, fields?.image) : null;

  return (
    <section
      className={`ContentCard h-full ${
        isExplorePropertiesVariant
          ? 'bg-lilac-100 px-6 py-6 md:px-12 md:py-12'
          : fields?.applyMargin?.value == 1
          ? 'mt-8 md:mt-10'
          : ''
      }`}
    >
      <div className="container-sm h-full">
        <div
          className={`h-full ${cardBackgroundClass} border border-solid border-lilac-500 rounded-2xl overflow-hidden`}
        >
          <div className="h-full grid grid-cols-1 md:grid-cols-2">
            <div className="col-span-1 md:order-2">
              <div className="h-57.5 md:h-full">
                {isOfferData ? (
                  <CustomImage
                    field={offerImageField}
                    className="w-full h-full object-cover block"
                    fallbackToPlaceholder
                  />
                ) : (
                  <ImageSlider images={fields?.images || [fields?.image]} />
                )}
              </div>
            </div>
            <div className="col-span-1 md:order-1">
              <div className={`p-6 flex flex-col md:p-8 h-full justify-between gap-5 lg:gap-8`}>
                <div className="space-y-3 lg:space-y-4">
                  {!isOfferData && (
                    <Text
                      tag="h4"
                      field={fields?.title}
                      className="text-[16px] leading-6 md:text-[20px] md:leading-6 font-normal text-navy-500"
                    />
                  )}
                  <Text
                    tag="h4"
                    field={fields?.heading}
                    className="font-colgent text-heading-1 font-normal"
                  />
                  <Text tag="p" field={fields?.description} className="text-body font-light" />
                  {fields?.list && (
                    <ul className="mt-5">
                      {fields?.list?.map((listItem: any, listIndex: any) => (
                        <li
                          key={listIndex}
                          className={`flex items-center gap-3.5 ${
                            listIndex == 0 ? '' : 'pt-3'
                          } text-body font-light`}
                        >
                          <CustomRichText
                            field={listItem?.fields.icon}
                            className="text-lilac-500"
                          />
                          <Text
                            tag="span"
                            field={listItem?.fields?.text}
                            className="text-navy-500"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  {fields?.cta && (
                    <CustomLink
                      field={fields?.cta}
                      className={`btn btn-primary md:px-8 md:py-6 w-full md:w-[275px] text-center h-11 lg:h-15`}
                    >
                      <CustomRichText field={fields?.icon} />
                      {fields?.cta?.title || fields?.cta?.value?.text}
                    </CustomLink>
                  )}
                  {fields?.url && (
                    <Link
                      href={
                        isOfferData
                          ? {
                              pathname: fields?.url?.value?.href?.includes('offer-details')
                                ? fields?.url?.value?.href
                                : `${fields?.url?.value?.href}/offer-details`,
                              query: { Id: fields.id },
                            }
                          : {
                              pathname: fields?.url?.value?.href,
                              ...(fields?.id &&
                                fields?.paramName && {
                                  query: {
                                    [fields.paramName]: fields.id,
                                  },
                                }),
                            }
                      }
                      className={`btn btn-primary md:px-8 md:py-6 w-full md:w-[275px] text-center h-11 lg:h-15`}
                    >
                      <CustomRichText field={fields?.ctaIcon || fields?.icon} />
                      {fields?.cta?.value?.text || 'View Details'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
