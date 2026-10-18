'use client';
import { useMemo, useState } from 'react';
import { Image, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useSearchParams } from 'next/navigation';
import { CustomLink } from 'src/common/SitecoreOverrides';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ChevronLeft from 'assets/icons/ChevronLeft';
import ChevronRight from 'assets/icons/ChevronRight';
import { SERVICE_REQUEST_TYPE } from 'lib/common/constants/common';

const SERVICE_REQUEST_TYPE_MATCHERS: Record<string, RegExp> = {
  [SERVICE_REQUEST_TYPE.MAINTENANCE]:
    /serviceRequestType=maintenance|servicetype=1|maintenance request/i,
  [SERVICE_REQUEST_TYPE.COMMUNITY]:
    /serviceRequestType=community|servicetype=2|community care|community request/i,
  [SERVICE_REQUEST_TYPE.LEASING]:
    /serviceRequestType=leasing|servicetype=3|lease request|leasing request/i,
};

const getQuickLinkCardText = (child: any): string => {
  const href = child?.fields?.cardLink?.value?.href || child?.fields?.cardLink?.href || '';
  const title = child?.fields?.title?.value || '';
  const description = child?.fields?.description?.value || '';

  return `${href} ${title} ${description}`;
};

const matchesServiceRequestType = (child: any, serviceRequestType: string): boolean => {
  const matcher = SERVICE_REQUEST_TYPE_MATCHERS[serviceRequestType];
  if (!matcher) return false;

  return matcher.test(getQuickLinkCardText(child));
};

export default function QuickLinks({ fields }: any) {
  const searchParams = useSearchParams();
  const serviceRequestType = searchParams.get('serviceRequestType');
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  const quickLinkItems = useMemo(() => {
    const children = fields?.children || [];

    if (!serviceRequestType || !SERVICE_REQUEST_TYPE_MATCHERS[serviceRequestType]) {
      return children;
    }

    // On SR details, hide the create card for the current request type.
    return children.filter((child: any) => !matchesServiceRequestType(child, serviceRequestType));
  }, [fields?.children, serviceRequestType]);

  if (!quickLinkItems.length) return null;

  return (
    <section className={`QuickLinks ${fields?.version?.value == 1 && 'mt-8 md:mt-10'}`}>
      <div className="container-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2.5 lg:mb-3.5">
          <Text tag="h3" field={fields?.title} className="text-heading-2 font-normal" />
        </div>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: false }}
          navigation={{
            prevEl,
            nextEl,
          }}
          modules={[Navigation]}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 3,
            },
          }}
        >
          {quickLinkItems.map((child: any, index: any) => (
            <SwiperSlide key={index} className="h-auto! py-2.5">
              <CustomLink
                field={child?.fields?.cardLink}
                className="border border-lilac-300 outline outline-transparent outline-offset-[-2px] rounded-[12px] p-4 lg:p-5 w-full lg:max-w-[300px] shadow-[0_0_0_1px_#edf0f4] bg-white-pure transition-default cursor-pointer h-full block hover:outline-lilac-300 hover:hover:shadow-[0_0_10.5px_2.1px_rgba(156,167,255,0.4)] active:bg-lilac-100"
              >
                <div className="mb-8 text-center">
                  <Image
                    field={child?.fields?.cardIcon}
                    className="w-auto h-full max-h-[120px] mx-auto my-0"
                  />
                </div>
                <div className="quick-links-card__content">
                  <Text
                    tag="h3"
                    field={child?.fields?.title}
                    className="text-body mb-2 text-navy-500 font-medium"
                  />
                  <Text
                    tag="p"
                    field={child?.fields?.description}
                    className="text-body font-light text-navy-500 mb-0"
                  />
                </div>
              </CustomLink>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="w-full flex justify-center lg:justify-between mt-2.5 lg:mt-3.5">
          <button
            ref={(node) => setPrevEl(node)}
            className="btn btn-secondary w-12 h-12 md:w-15 md:h-15 inline-flex justify-center items-center p-0 lg:order-1 me-5 lg:me-0"
          >
            <ChevronLeft />
          </button>

          <button
            ref={(node) => setNextEl(node)}
            className="btn btn-secondary w-12 h-12 md:w-15 md:h-15 inline-flex justify-center items-center p-0 lg:order-3 ms-5 lg:ms-0"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
