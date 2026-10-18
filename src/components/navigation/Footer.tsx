import { Image, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CustomImage, CustomLink, CustomRichText } from 'src/common/SitecoreOverrides';

import ArrowUp from 'assets/icons/ArrowUp';

export default function Footer({ fields }: any) {
  const [isVisible, setIsVisible] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scrollContainer = window;
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      if (scrollY > 1500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      if (footerRef.current) {
        const footerRect = footerRef.current.getBoundingClientRect();
        if (footerRect.top <= windowHeight) {
          setIsNearFooter(true);
        } else {
          setIsNearFooter(false);
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`relative p-8 xl:p-18 xl:pt-14 text-white-pure bg-navy-500 overflow-visible ${
        fields?.version.value == 1 ? 'mt-12' : ''
      }`}
      ref={footerRef}
    >
      <button
        onClick={scrollToTop}
        type="button"
        style={{ opacity: isVisible ? 1 : 0 }}
        className={`btn btn-primary transition-all duration-300 z-999 
          ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}
          ${
            isNearFooter
              ? 'absolute right-6 lg:right-12 -top-20 lg:-top-28'
              : 'fixed right-6 lg:right-12 bottom-12'
          } 
          w-10 h-11 lg:w-17 lg:h-15 p-0 flex justify-center items-center`}
      >
        <ArrowUp className="size-6 lg:size-7" />
      </button>
      <div className="border-b border-solid border-lilac-200 pb-10 xl:pb-6">
        <div className="flex flex-col xl:flex-row gap-x-6">
          <div className="grow">
            <CustomLink field={fields?.logoLink} className="w-32.5 lg:w-35">
              <Image field={fields.logoImage} className="w-full" />
            </CustomLink>
          </div>
          <div className="shrink flex xl:hidden items-center">
            <ul className="flex gap-4 mt-10 xl:mt-0">
              {fields?.socialLinks.map((item: any, index: any) => (
                <li key={index} className="flex justify-center items-center">
                  <CustomLink field={item?.fields?.link} className="size-5">
                    <CustomRichText field={item.fields.icon} />
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink flex items-center">
            <Link
              className="px-4 py-2 items-center gap-3 rounded-xl border border-solid border-lilac-500 mt-10 mb-5 xl:m-0"
              href={`tel:${fields?.customerCareNumber?.value?.replace(' ', '')}`}
            >
              <CustomRichText field={fields?.customerCareIcon} />
              <p className="text-body-sm whitespace-nowrap flex flex-col gap-2">
                <Text tag="span" field={fields?.customerCareLabel} />
                <Text tag="span" field={fields?.customerCareNumber} />
              </p>
            </Link>
          </div>
          <div className="shrink">
            <ul className="text-body-sm xl:ms-10">
              {fields?.navLinks?.map((item: any, index: any) => (
                <li key={index} className={`mt-5 xl:ms-6 ${index == 0 ? 'xl:mt-0' : ''}`}>
                  <CustomLink field={item?.fields?.link} />
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink">
            <ul className="text-body-sm xl:ms-10">
              {fields?.legalLinks?.map((item: any, index: any) => (
                <li key={index} className={`mt-5 xl:ms-6 ${index == 0 ? 'xl:mt-0' : ''}`}>
                  <CustomLink field={item?.fields?.link} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-10 xl:mt-8">
        <div className="flex flex-col xl:flex-row gap-x-6">
          <div className="shrink flex items-center">
            <Text
              field={fields?.copyrightText}
              tag="p"
              className="text-body-xs font-medium mb-8 xl:mb-0"
            />
          </div>
          <div className="grow flex flex-wrap gap-5 xl:flex-nowrap xl:justify-center xl:items-center">
            <Text
              field={fields?.downloadAppText}
              tag="p"
              className="text-body-xs font-medium xl:mb-0 w-full xl:w-auto"
            />
            <CustomLink field={fields?.appStoreLink} className="w-35 xl:w-30">
              <CustomImage field={fields?.appStoreImage} className="w-full" />
            </CustomLink>
            <CustomLink field={fields?.googlePlayLink} className="w-35 xl:w-30">
              <CustomImage field={fields?.googlePlayImage} className="w-full" />
            </CustomLink>
          </div>
          <div className="shrink hidden xl:flex items-center">
            <ul className="flex gap-4 mt-10 xl:mt-0">
              {fields?.socialLinks.map((item: any, index: any) => (
                <li key={index} className="flex justify-center items-center">
                  <CustomLink field={item?.fields?.link} className="size-5">
                    <CustomRichText field={item.fields.icon} />
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
