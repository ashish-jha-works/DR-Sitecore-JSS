import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Text } from 'src/common/SitecoreOverrides';
import { useUIStore } from 'src/store/useUIStore';

import CalendarIcon from 'assets/icons/CalendarIcon';
import CircleInfoIcon from 'assets/icons/CircleInfoIcon';
import EmailIcon from 'assets/icons/EmailIcon';
import InfoIcon from 'assets/icons/InfoIcon';
import WhatsappIcon from 'assets/icons/WhatsappIcon';
import AddToCalendar from 'components/common/AddToCalendar';
import InfoMessage from 'components/InfoMessage';
import { RESERVATION_STATUS_STYLES } from 'lib/common/constants/common';
import { formatEventDate, formatToYYYYMMDD } from 'lib/utils/helper';

import { AmenityBookingDetailsProps, ShareType } from '../CreateBooking.types';

export const AmenityBookingDetails: React.FC<AmenityBookingDetailsProps> = ({
  fields,
  step,
  bookingData,
  isBookingCancelled,
  selectedAmenity,
  selectedLocationData,
  selectedDate,
  selectedTime,
  handleCreateBooking,
  addCalendarEventDetails,
  bookingStatus,
  bannerImage,
}) => {
  const openModal = useUIStore((state) => state.openModal);

  const handleShare = (type: ShareType): void => {
    const duration = formatEventDate(
      formatToYYYYMMDD(selectedDate as Date) as string,
      selectedTime
    );

    const whatsappMessage: string = [
      '*Booking Details:*',
      '',
      `Facility: ${selectedLocationData?.Name}`,
      `Location: ${selectedLocationData?.MapUrl}`,
      `Duration: ${duration}`,
      `Booking Reference: ${bookingData.Reservation_Id}`,
    ].join('\n');

    const emailMessage = [
      'Booking Details:',
      '',
      `Facility: ${selectedLocationData?.Name}`,
      `Location: ${selectedLocationData?.MapUrl}`,
      `Duration: ${duration}`,
      `Booking Reference: ${bookingData.Reservation_Id}`,
    ].join('\n');

    const emailLink: string = `mailto:?body=${encodeURIComponent(emailMessage)}`;
    const whatsappLink: string = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

    const linkToOpen: string = type === 'email' ? emailLink : whatsappLink;

    window.open(linkToOpen, '_blank');
  };
  return (
    <div>
      {/* Banner */}
      <div>
        {bannerImage ? (
          <Image
            src={bannerImage}
            alt="Amenity Banner"
            width={1200}
            height={800}
            className="w-full max-h-25 lg:max-h-44 object-cover rounded-t-xl"
          />
        ) : null}
      </div>

      {/* Booking Card */}
      <div className="bg-white-pure border border-lilac-300 rounded-b-xl p-5 md:p-6 flex flex-col gap-5 md:gap-6">
        <div className="flex gap-4 items-center">
          <CalendarIcon className="size-7 md:size-8 text-lilac-500" />
          {step === 2 ? (
            <Text
              tag="h1"
              field={fields?.bookingDetailsSectionTitle}
              className="text-[16px] md:text-[20px]"
            />
          ) : (
            <div className="flex">
              <Text
                tag="h1"
                field={fields?.bookingReferenceLabel}
                className="text-[16px] md:text-[20px]"
              />
              <span className="text-[16px] md:text-[20px]">: {bookingData?.Reservation_Id}</span>
            </div>
          )}
        </div>

        <div>
          <span
            className={`font-light text-body-sm ${
              isBookingCancelled
                ? RESERVATION_STATUS_STYLES['Cancelled']
                : RESERVATION_STATUS_STYLES[bookingStatus] ?? 'bg-lilac-100 text-navy-500'
            } px-4 py-2 inline rounded-full border border-solid`}
          >
            {isBookingCancelled ? 'Cancelled' : bookingStatus}
          </span>
        </div>

        {/* Booking Info */}
        <div className="border-b border-lilac-300 flex flex-wrap gap-5 pb-5 lg:pb-3">
          <div className="flex flex-col gap-1 w-full lg:w-[48%]">
            <Text tag="h4" field={fields?.amenityLabel} className="text-body font-medium" />
            <p className="text-body font-light">{selectedAmenity?.Type ?? '-'}</p>
          </div>
          <div className="flex flex-col gap-1 w-full lg:w-[48%]">
            <Text tag="h4" field={fields?.facilityLabel} className="text-body font-medium" />
            <p className="text-body font-light">{selectedLocationData?.Name ?? '-'}</p>
          </div>
          <div className="flex flex-col gap-1 w-full lg:w-[48%]">
            <Text tag="h4" field={fields?.locationLabel} className="text-body font-medium" />
            <p className="text-body font-light">
              <Link
                className="text-navy-500 underline"
                target="_blank"
                href={selectedLocationData?.MapUrl ?? '/'}
              >
                {selectedLocationData?.MapUrl ?? '-'}
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-1 w-full lg:w-[48%]">
            <Text tag="h4" field={fields?.durationLabel} className="text-body font-medium" />
            <p className="text-body font-light">
              {formatEventDate(formatToYYYYMMDD(selectedDate as Date) as string, selectedTime) ??
                '-'}
            </p>
          </div>
        </div>

        <InfoMessage IconComponent={InfoIcon} status="normal">
          <p className="text-body">{fields?.reservationCancelInfoText?.value}</p>
        </InfoMessage>

        {/* Share Booking */}
        {step === 3 && bookingStatus === 'Upcoming' && !isBookingCancelled && (
          <div className="space-y-2 lg:space-y-3">
            <Text
              tag="h4"
              field={fields?.shareYourBookingLabel}
              className="text-body font-medium"
            />
            <div className="flex gap-4 lg:gap-6">
              <div
                className="p-4 bg-lilac-500 rounded-xl cursor-pointer"
                onClick={() => handleShare('whatsapp')}
              >
                <WhatsappIcon className="size-6 md:size-7 text-white-pure" />
              </div>
              <div
                className="p-4 bg-lilac-500 rounded-xl cursor-pointer"
                onClick={() => handleShare('email')}
              >
                <EmailIcon className="size-6 md:size-7 text-white-pure" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancellation Policy */}
      {step === 2 && (
        <InfoMessage IconComponent={CircleInfoIcon} status="warning" className="mt-5 lg:mt-6">
          <p className="text-body">
            <span className="font-medium">Cancellation Policy: </span>
            {fields?.cancellationPolicy?.value}
          </p>
        </InfoMessage>
      )}

      {/* Buttons */}
      {step === 2 ? (
        <>
          <div className="btn-wrapper flex flex-col lg:flex-row justify-end items-end gap-4 md:gap-6 mt-5 lg:mt-6">
            <Link
              type="button"
              className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15 uppercase"
              href="/community?activeTab=BookAmenities"
            >
              {fields?.cancelCTALabel?.value}
            </Link>
            <button
              type="button"
              className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
              onClick={handleCreateBooking}
            >
              {fields?.confirmCTALabel?.value}
            </button>
          </div>
          <p className="text-body-sm font-light lg:text-right mt-5 lg:mt-6">
            *{fields?.tncText?.value}{' '}
            <Link className="text-sky-700 underline" href="/terms-and-conditions" target="_blank">
              Terms and Conditions
            </Link>
          </p>
        </>
      ) : (
        <div className="btn-wrapper flex flex-col lg:flex-row justify-end items-end gap-4 md:gap-6 mt-5 lg:mt-6">
          <button
            type="button"
            className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15 uppercase"
            onClick={() => openModal('cancel-booking-modal')}
            disabled={bookingStatus !== 'Upcoming' || isBookingCancelled}
          >
            {fields?.cancelBookingCTALabel?.value}
          </button>
          <AddToCalendar
            label={fields?.addToCalendarLabel?.value}
            title={addCalendarEventDetails.title}
            description={addCalendarEventDetails.description}
            date={formatToYYYYMMDD(selectedDate as Date) as string}
            timeRange={selectedTime}
            timeZone="Asia/Dubai"
            showGoogle
            showOutlookWeb
            showOutlookDesktop
            disabled={bookingStatus !== 'Upcoming' || isBookingCancelled}
          />
        </div>
      )}
    </div>
  );
};
