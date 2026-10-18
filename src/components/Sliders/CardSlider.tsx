import { JSX, useState } from 'react';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { CustomImage, CustomLink } from 'src/common/SitecoreOverrides';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import ChevronLeft from 'assets/icons/ChevronLeft';
import ChevronRight from 'assets/icons/ChevronRight';
import ClockIcon from 'assets/icons/ClockIcon';
import LocationIcon from 'assets/icons/LocationIcon';
import Link from 'next/link';
import Image from 'next/image';

const getCommunityTabHref = (linkValue: any) => {
  const rawHref = linkValue?.href || '/community';
  const [pathnamePart, hrefQuery = ''] = String(rawHref).split('?');
  const pathname = pathnamePart || '/community';

  const params = new URLSearchParams(hrefQuery);
  const querystring = linkValue?.querystring || '';
  if (querystring) {
    const qs = querystring.startsWith('?') ? querystring.slice(1) : querystring;
    new URLSearchParams(qs).forEach((value, key) => {
      params.set(key, value);
    });
  }

  const activeTab = params.get('activeTab');
  if (!activeTab) {
    return pathname;
  }

  return {
    pathname,
    query: { activeTab },
  };
};

export default function CardSlider({ fields }: any): JSX.Element {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);
  const isCompactSpacing = fields?.applyMargin?.value == 1;

  if (!fields?.items?.length) {
    return <></>;
  }
  return (
    <section className={`CardSlider ${isCompactSpacing ? 'mt-5 md:mt-6' : 'mt-8 md:mt-10'}`}>
      <div className="container-sm">
        <div
          className={`flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2.5 md:mb-3.5`}
        >
          <Text
            tag="h3"
            field={fields?.Title || fields?.title}
            className={`text-heading-2 font-normal ${isCompactSpacing ? 'mb-0' : 'mb-6 sm:mb-0'}`}
          />
          <CustomLink
            field={fields?.URL}
            className="btn btn-secondary w-full md:w-68.75 px-0 h-11 md:h-15 uppercase"
          />
        </div>

        <Swiper
          spaceBetween={20}
          speed={600}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl,
            nextEl,
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
          modules={[Autoplay, Navigation]}
        >
          {fields?.items?.map((item: any, index: any) => (
            <SwiperSlide key={index} className="h-auto! py-2.5">
              <Link
                href={
                  fields?.URL
                    ? `${fields?.DetailsURL?.value?.href}?Id=${item?.id}`
                    : getCommunityTabHref(item?.fields?.link?.value)
                }
                className="bg-white-pure border border-solid border-lilac-300 outline outline-solid outline-transparent -outline-offset-2 rounded-xl overflow-hidden w-full lg:max-w-75 flex flex-col h-full transition-default hover:outline-lilac-300 hover:shadow-[0_0_10.5px_2.1px_rgba(156,167,255,0.4)] active:bg-lilac-100 cursor-pointer"
              >
                <div>
                  {item?.fields?.image ? (
                    <CustomImage
                      field={item?.fields?.image}
                      className="w-full h-42.5 object-cover block"
                    />
                  ) : null}
                  {item?.fields?.images ? (
                    <Image
                      src={item?.fields?.images?.[0]?.src || item?.fields?.images?.[0]?.url}
                      alt={item?.fields?.images?.[0]?.alt}
                      width={100}
                      height={100}
                      className="w-full h-42.5 object-cover block"
                    />
                  ) : null}
                </div>
                <div className="px-5 py-6">
                  {/* Order: Image → Tag → Title → DateAndTime → Location */}
                  {item?.fields?.Tag && (
                    <Text
                      tag="h4"
                      field={item?.fields?.Tag}
                      className="text-body-xs font-light mb-2 text-navy-500"
                    />
                  )}
                  {(item?.fields?.Title || item?.fields?.title || item?.fields?.SubTitle) && (
                    <Text
                      tag="h3"
                      field={item?.fields?.Title || item?.fields?.title || item?.fields?.SubTitle}
                      className="text-base leading-6 font-bold text-navy-500"
                    />
                  )}
                  {/* Community "Stay connected" cards only (no date/location) */}
                  {item?.fields?.heading &&
                    !item?.fields?.DateAndTime &&
                    !item?.fields?.Location && (
                      <Text
                        tag="p"
                        field={item?.fields?.heading}
                        className="text-body font-light text-navy-500 mt-3"
                      />
                    )}
                  {(item?.fields?.DateAndTime || item?.fields?.Location) && (
                    <div className="mt-5">
                      {item?.fields?.DateAndTime && (
                        <div className={`flex items-center gap-3.5 text-body font-light`}>
                          <ClockIcon width={20} height={20} className="text-lilac-500 shrink-0" />
                          <Text
                            tag="span"
                            field={item?.fields?.DateAndTime}
                            className="text-navy-500"
                          />
                        </div>
                      )}
                      {item?.fields?.Location && (
                        <div className={`flex items-center gap-3.5 pt-3 text-body font-light`}>
                          <LocationIcon
                            width={20}
                            height={20}
                            className="text-lilac-500 shrink-0"
                          />
                          <Text
                            tag="span"
                            field={item?.fields?.Location}
                            className="text-navy-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex lg:hidden mt-6">
          <button
            ref={(node) => setPrevEl(node)}
            className="btn btn-secondary w-12 h-12 inline-flex justify-center items-center p-0 ms-auto me-5"
          >
            <ChevronLeft />
          </button>

          <button
            ref={(node) => setNextEl(node)}
            className="btn btn-secondary w-12 h-12 inline-flex justify-center items-center p-0 ms-5 me-auto"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
