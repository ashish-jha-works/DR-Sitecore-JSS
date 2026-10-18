'use client';

import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import ChevronUp from 'assets/icons/ChevronUp';
import { useState } from 'react';
import { CustomImage, CustomLink, CustomRichText } from 'src/common/SitecoreOverrides';
import { useUserStore } from 'src/store/useUserStore';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import MoveOutConfirmModal from './MoveOutConfirmModal';
import RemindMeLaterModal from './RemindMeLaterModal';

export default function RenewalStepsSlider({ fields }: any) {
  const { DisableRenewLater } = useUserStore();
  const [paginationEl, setPaginationEl] = useState<HTMLElement | null>(null);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [showRemindLaterModal, setShowRemindLaterModal] = useState(false);
  const [showMoveOutConfirmModal, setShowMoveOutConfirmModal] = useState(false);

  const showRemindLaterButton = Boolean(fields?.remindLaterCTALabel?.value) && !DisableRenewLater;
  const moveOutHref =
    fields?.moveOutCTA?.value?.href || fields?.moveOutCTA?.href || '/contract-renewal/move-out';
  const moveOutLabel = fields?.moveOutCTA?.value?.text || fields?.moveOutCTA?.text || 'Move Out';

  return (
    <>
      <section className="RenewalStepsSlider bg-silver-chalice-100 pb-6">
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
                  modules={[Pagination]}
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
                  field={fields?.renewContractCTA}
                  className={'btn btn-primary md:max-w-68.75 h-11 font-medium text-body-xs'}
                />
                <p
                  className="font-light flex gap-3 mt-1 -mb-1 text-body items-center cursor-pointer lg:hidden"
                  onClick={() => setAccordionOpen((prev) => !prev)}
                >
                  Other Options{' '}
                  <ChevronUp className={`size-6 ${accordionOpen ? '' : 'rotate-180'}`} />{' '}
                </p>
                <div
                  className={`col-span-1 flex flex-col justify-center items-center gap-4 lg:gap-5 ${
                    accordionOpen ? 'show w-full lg:w-auto' : 'hidden lg:flex'
                  }`}
                >
                  <CustomLink
                    field={fields?.shortTermRenewalCTA}
                    className={'btn btn-secondary md:max-w-68.75 h-11 font-medium text-body-xs'}
                  />
                  {showRemindLaterButton ? (
                    <button
                      type="button"
                      className="btn btn-secondary md:max-w-68.75 h-11 font-medium text-body-xs"
                      onClick={() => setShowRemindLaterModal(true)}
                    >
                      {fields?.remindLaterCTALabel?.value}
                    </button>
                  ) : null}

                  {fields?.moveOutLabel?.value || fields?.moveOutCTA ? (
                    <div className="flex gap-2 lg:gap-3">
                      <p className="text-body-sm font-light">{fields?.moveOutLabel?.value}</p>
                      <button
                        type="button"
                        className="font-medium text-navy-500 text-body-sm uppercase underline"
                        onClick={() => setShowMoveOutConfirmModal(true)}
                      >
                        {moveOutLabel}
                      </button>
                    </div>
                  ) : null}

                  {fields?.explorePropertiesLabel?.value || fields?.explorePropertiesCTA ? (
                    <div className="flex gap-2 lg:gap-3">
                      <p className="text-body-sm font-light">
                        {fields?.explorePropertiesLabel?.value}
                      </p>
                      <CustomLink
                        field={fields?.explorePropertiesCTA}
                        className={'font-medium text-navy-500 text-body-sm uppercase underline'}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RemindMeLaterModal
        isOpen={showRemindLaterModal}
        onClose={() => setShowRemindLaterModal(false)}
        fields={fields}
      />

      <MoveOutConfirmModal
        isOpen={showMoveOutConfirmModal}
        onClose={() => setShowMoveOutConfirmModal(false)}
        fields={fields}
        continueHref={moveOutHref}
      />
    </>
  );
}
