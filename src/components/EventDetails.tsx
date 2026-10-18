'use client';

import ArrowLeft from 'assets/icons/ArrowLeft';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { CustomImage, CustomLink, CustomRichText, Text } from 'src/common/SitecoreOverrides';
import ImagePreviewModal from './modals/ImagePreviewModal';
import { useUIStore } from 'src/store/useUIStore';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formatOfferValidUntil } from 'lib/utils/helper';

const EventDetails = ({ fields }: any) => {
  const pathname = usePathname();
  const openModal = useUIStore((state) => state.openModal);
  const searchParams = useSearchParams();

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [eventFields, setEventFields] = useState<any>(null);

  const eventId = searchParams.get('Id') || searchParams.get('id');

  const router = useRouter();
  const bannerField =
    eventFields?.fields?.banner || eventFields?.fields?.images?.[0]?.fields?.image;
  // Offers detail: backCTA lives on the selected item; events keep root-level backCTA
  const backCTA = eventFields?.fields?.backCTA || fields?.backCTA;

  useEffect(() => {
    if (fields && fields?.items?.length > 0) {
      let result;
      if (fields?.items?.[0]?.id && fields?.items?.[0]?.id !== 'available-in-connected-mode') {
        // When data received from Sitecore contains id at root level of items
        result = fields?.items?.find(
          (obj: { id: string }) => obj.id?.toLowerCase?.() === eventId?.toLowerCase?.()
        );
      } else {
        // When data received from disconnected mode contains id inside fields of items
        result = fields?.items?.find(
          (obj: any) => obj?.fields?.id?.value?.toLowerCase?.() === eventId?.toLowerCase?.()
        );
      }

      if (result) {
        setEventFields(result);
      } else {
        router.push('/dashboard'); // Redirect to dashboard page if no matching event is found
      }
    } else {
      router.push('/dashboard'); // Redirect to dashboard page if fields or items are not available
    }
  }, [searchParams, fields, eventId, router]);

  const handleClick = (index: any) => {
    setActiveIndex(index);
    openModal('image-gallery-modal');
  };

  return (
    <section className="EventDetails">
      <div className="container-sm pt-5 pb-5 md:pt-6 md:pb-6 flex flex-col gap-5 md:gap-6">
        <CustomLink
          field={backCTA}
          className="text-body-sm font-medium flex gap-4 text-navy-500 uppercase items-center"
        >
          <ArrowLeft className="size-5 md:size-7" />
          {backCTA?.value?.text || backCTA?.text || 'Back'}
        </CustomLink>
        <div>
          {/* Banner — single image only */}
          {bannerField ? (
            <div>
              <CustomImage
                field={bannerField}
                className="w-full max-h-25 lg:max-h-44 object-cover rounded-t-xl"
              />
            </div>
          ) : null}
          <div className="bg-white-pure border border-lilac-300 rounded-b-xl p-5 md:p-6 flex flex-col gap-5 md:gap-6">
            <div className="flex gap-4 items-center">
              <Text
                tag="h1"
                field={eventFields?.fields?.Title}
                className="text-[16px] md:text-[20px]"
              />
            </div>
            {/* Event Details */}
            <div className="space-y-5">
              {(() => {
                const isOffersPage = pathname.includes('/offers');
                const showLocation = !isOffersPage && eventFields?.fields?.Location?.value;
                const offerExpiryRaw =
                  eventFields?.fields?.EndDate?.value ||
                  eventFields?.fields?.ExpiryDate?.value ||
                  eventFields?.fields?.DateAndTime?.value ||
                  eventFields?.fields?.StartDate?.value;
                const formattedOfferExpiry = isOffersPage
                  ? formatOfferValidUntil(offerExpiryRaw)
                  : '';
                const showDateAndTime = isOffersPage
                  ? Boolean(formattedOfferExpiry)
                  : Boolean(eventFields?.fields?.DateAndTime?.value);

                if (!showLocation && !showDateAndTime) return null;

                return (
                  <div className="border-b border-lilac-300 flex flex-wrap gap-2 pb-5 lg:pb-3">
                    {showLocation ? (
                      <div className="flex flex-col gap-1 w-full lg:w-[48%]">
                        <h4 className="text-body font-medium">Location</h4>
                        <Text
                          tag="p"
                          field={eventFields?.fields?.Location}
                          className="text-body font-light"
                        />
                      </div>
                    ) : null}
                    {showDateAndTime ? (
                      <div className="flex flex-col gap-1 w-full lg:w-[48%]">
                        <h4 className="text-body font-medium">
                          {isOffersPage ? 'Offer valid until' : 'Date and time'}
                        </h4>
                        {isOffersPage ? (
                          <p className="text-body font-light">{formattedOfferExpiry}</p>
                        ) : (
                          <Text
                            tag="p"
                            field={eventFields?.fields?.DateAndTime}
                            className="text-body font-light"
                          />
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })()}
              <div>
                <CustomRichText
                  className="[&_ul]:list-disc [&_ul]:ps-4 font-light"
                  field={eventFields?.fields?.Description}
                />
              </div>
            </div>
            {/* Gallery */}
            {eventFields?.fields?.galleryImages?.length > 0 && (
              <div className="flex flex-col gap-2 lg:gap-3">
                <h4 className="text-body font-medium">Gallery</h4>
                <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 md:gap-4">
                  {eventFields?.fields?.galleryImages?.map((image: any, index: number) => (
                    <Image
                      key={index}
                      src={image.src || image?.fields?.image?.value?.src}
                      alt={image.alt || image?.fields?.image?.value?.alt}
                      width={Number(image.width || image?.fields?.image?.value?.width)}
                      height={Number(image.height || image?.fields?.image?.value?.height)}
                      className="w-full lg:w-auto lg:max-w-43.75 h-auto object-cover rounded-xl aspect-[1.41/1] cursor-pointer"
                      onClick={() => handleClick(index)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ImagePreviewModal
        images={eventFields?.fields?.galleryImages?.map(
          (image: any) => image?.src || image?.fields?.image?.value?.src
        )}
        initialIndex={activeIndex ?? 0}
        title="Images"
        imageClassName="aspect-[1.41/1]"
      />
    </section>
  );
};

export default EventDetails;
