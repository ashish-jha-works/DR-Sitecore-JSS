import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CustomImage, CustomLink, CustomRichText } from 'src/common/SitecoreOverrides';
import useMoveOutStepper from 'components/move-out/Stepper/useMoveOutStepper';
import { useUserStore } from 'src/store/useUserStore';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function StepsSlider({ fields }: any) {
  const router = useRouter();
  const { IsMoveOut, MO_UserState } = useUserStore();
  const { loadMoveOutStepper } = useMoveOutStepper(false);
  const [paginationEl, setPaginationEl] = useState<HTMLElement | null>(null);

  const isMoveOutLanding = router.pathname === '/move-out';
  const isMoveOutInProgress =
    !!IsMoveOut ||
    (MO_UserState != null && String(MO_UserState).trim() !== '' && Number(MO_UserState) > 0);

  // Landing is only for initiate; if journey already started, resume current step
  useEffect(() => {
    if (!isMoveOutLanding || !isMoveOutInProgress) return;
    loadMoveOutStepper(true);
  }, [isMoveOutLanding, isMoveOutInProgress]);

  return (
    <section className="StepsSlider bg-silver-chalice-100 pb-6">
      <div className="container-sm">
        <div className="-mt-13 relative z-10 rounded-xl overflow-hidden bg-white-pure border border-solid border-lilac-300 min-h-75 flex">
          <div className="grid grid-cols-1 md:grid-cols-2 grow">
            <div className="col-span-1 min-h-56 md:min-h-0 relative">
              <Swiper
                className="h-full"
                slidesPerView={1}
                spaceBetween={0}
                speed={750}
                simulateTouch={true}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  el: paginationEl,
                  clickable: true,
                  renderBullet: (_index, className) => {
                    return `<span class="${className} custom-bullet"></span>`;
                  },
                }}
                modules={[Autoplay, Pagination]}
              >
                {fields?.list?.map((item: any, index: number) => (
                  <SwiperSlide key={index} className="">
                    <div className="h-full relative flex justify-center items-end text-center">
                      <div className="after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)]">
                        <CustomImage
                          field={item?.fields?.image}
                          className="absolute inset-0 -z-10 w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-white-pure p-5 pb-14 relative z-20">
                        <Text field={item?.fields?.heading} tag="h5" className="text-body mb-1" />
                        <CustomRichText
                          field={item?.fields?.description}
                          className="text-body-sm"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="pt-6 pb-5 absolute bottom-0 start-1/2 -translate-x-1/2 z-10">
                <div
                  ref={(node) => setPaginationEl(node)}
                  className="custom-pagination inline-flex gap-2 justify-center items-center"
                />
              </div>
            </div>
            <div className="col-span-1 p-6 flex flex-col justify-center items-center gap-5">
              <Text field={fields?.heading} tag="h2" className="text-heading-1" />
              <CustomRichText field={fields?.description} className="text-body-sm font-light" />
              <CustomLink
                field={fields?.cta}
                className={'btn btn-primary md:max-w-68.75 h-11 font-medium'}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
