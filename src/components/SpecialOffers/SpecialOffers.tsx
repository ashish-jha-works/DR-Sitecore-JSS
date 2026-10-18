import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import ContentCard from 'components/ContentCards/ContentCard';
import ChevronLeft from 'assets/icons/ChevronLeft';
import ChevronRight from 'assets/icons/ChevronRight';
import { sortItemsByStartDateDesc } from 'lib/utils/helper';

export default function SpecialOffers({ fields }: any) {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);
  const topOffers = sortItemsByStartDateDesc(fields?.items || []).slice(0, 5);

  if (!fields?.items?.length) {
    return <></>;
  }
  return (
    <section
      className={`SpecialOffers ${
        fields?.applyMargin?.value == 1 ? 'mt-6' : 'mt-10'
      } py-4 md:py-8 bg-lilac-100`}
    >
      <div className="container-sm">
        <Text
          tag="h3"
          field={fields?.Title}
          className="font-colgent text-heading-1 lg:text-display-3 text-center mb-5 md:mb-6"
        />
        <div className="flex items-center gap-5 flex-wrap lg:flex-nowrap">
          <div className="w-full lg:order-2 lg:w-[calc(100%-160px)]">
            {topOffers.length > 0 && (
              <Swiper
                slidesPerView={1}
                spaceBetween={16}
                speed={750}
                simulateTouch={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                navigation={{
                  prevEl,
                  nextEl,
                }}
                modules={[Autoplay, Navigation]}
              >
                {topOffers.map((item: any, index: any) => (
                  <SwiperSlide key={index} className="md:min-h-75 h-auto!">
                    <ContentCard
                      fields={{
                        id: item?.fields?.id?.value || item?.id,
                        applyMargin: { value: 2 },
                        version: { value: 1 },
                        images: item?.fields?.images?.[0]
                          ? [item.fields.images[0]]
                          : item?.fields?.image
                          ? [item.fields.image]
                          : [],
                        heading: item?.fields?.Title,
                        description: item?.fields?.SubTitle,
                        url: fields?.DetailsURL || fields?.URL,
                        paramName: 'Id',
                      }}
                      isOfferData={true}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
          <button
            ref={(node) => setPrevEl(node)}
            className="btn btn-primary w-12 lg:w-15 min-w-12 lg:min-w-15 h-12 lg:h-15 inline-flex justify-center items-center ms-auto me-5 lg:m-0 p-0 lg:order-1"
          >
            <ChevronLeft />
          </button>

          <button
            ref={(node) => setNextEl(node)}
            className="btn btn-primary w-12 lg:w-15 min-w-12 lg:min-w-15 h-12 lg:h-15 inline-flex justify-center items-center ms-5 me-auto lg:m-0 p-0 lg:order-3"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
