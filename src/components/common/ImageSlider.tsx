import Image from 'next/image';
import { useState } from 'react';
import { CustomImage } from 'src/common/SitecoreOverrides';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import ChevronLeft from 'assets/icons/ChevronLeft';
import ChevronRight from 'assets/icons/ChevronRight';

import 'lib/swiper-style';

export default function ImageSlider({ images, imageClassName }: any) {
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);
  // 1. Add state for the pagination element
  const [paginationEl, setPaginationEl] = useState<HTMLElement | null>(null);

  function isSiteCoreImage(obj: any) {
    return (
      obj &&
      obj.fields &&
      obj.fields.image &&
      obj.fields.image.value &&
      typeof obj.fields.image.value.src === 'string'
    );
  }

  const isSiteCoreImg =
    isSiteCoreImage(images?.[0]) || images?.some((img: any) => isSiteCoreImage(img)) || false;

  return (
    <div className="ImageSlider w-full h-full">
      {images && (
        <div className="relative w-full h-full">
          <Swiper
            modules={[Autoplay, Navigation, Pagination, EffectFade]}
            navigation={{
              prevEl,
              nextEl,
            }}
            // 2. Pass the state instead of a string selector
            pagination={{
              el: paginationEl,
              clickable: true,
              renderBullet: (_index, className) => {
                return `<span class="${className} custom-bullet"></span>`;
              },
            }}
            speed={750}
            slidesPerView={1}
            simulateTouch={true}
            className="w-full h-full"
            spaceBetween={16}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            {images.map((image: any, index: any) => (
              <SwiperSlide key={index} className="h-auto!">
                <div className="h-full">
                  {isSiteCoreImg ? (
                    <CustomImage
                      field={image?.fields?.image ? image?.fields?.image : image}
                      className={`w-full h-full object-cover ${imageClassName}`}
                    />
                  ) : (
                    <Image
                      src={image?.src || image?.url}
                      alt={image?.alt}
                      fill
                      className={`w-full h-full object-cover ${imageClassName}`}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {images.length > 1 && (
            <div className="w-full absolute bottom-0 start-0 flex justify-between items-center gap-3 p-10 z-10">
              <button
                ref={(node) => setPrevEl(node)}
                className="swiper-navigation text-white-pure cursor-pointer"
              >
                <ChevronLeft />
              </button>
              <div
                ref={(node) => setPaginationEl(node)}
                className="custom-pagination inline-flex gap-2 justify-center items-center"
              />
              <button
                ref={(node) => setNextEl(node)}
                className="swiper-navigation text-white-pure cursor-pointer"
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
