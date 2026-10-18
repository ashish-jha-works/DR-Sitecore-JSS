import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { JSX, useState } from 'react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import ChevronLeft from 'assets/icons/ChevronLeft';
import ChevronRight from 'assets/icons/ChevronRight';
import ContentCard from 'components/ContentCards/ContentCard';

export default function ContentCardSlider({ fields }: any): JSX.Element {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  return (
    <section className={`ContentCardSlider ${fields?.version?.value == 1 ? 'mt-8 lg:mt-10' : ''}`}>
      <div className="container-sm">
        <Text
          tag="h3"
          field={fields?.heading}
          className="font-colgent text-heading-1 lg:text-display-3 text-center mb-5 md:mb-6"
        />
        <div className="flex items-center gap-5 flex-wrap lg:flex-nowrap">
          <div className="w-full lg:order-2 lg:w-[calc(100%-160px)]">
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
              {fields?.cards?.map((item: any, index: number) => (
                <SwiperSlide key={index} className="md:min-h-75 h-auto!">
                  <ContentCard fields={item?.fields} />
                </SwiperSlide>
              ))}
            </Swiper>
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
