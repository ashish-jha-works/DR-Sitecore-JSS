import React from 'react';
import { useCreateBooking } from './useCreateBooking';
import Link from 'next/link';
import ArrowLeft from 'assets/icons/ArrowLeft';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import BookingErrorModal from './BookAmenity/BookingErrorModal';
import BookingSuccessModal from './BookAmenity/BookingSucessModal';
import CancelBookingModal from './BookAmenity/CancelBookingModal';
import CancelBookingSuccessModal from './BookAmenity/CancelBookingSuccessModal';
import { BookAmenity } from './BookAmenity/BookAmenity';
import { AmenityBookingDetails } from './AmenityBookingDetails/AmenityBookingDetails';
import { CreateBookingFields } from './CreateBooking.types';

const CreateBooking = ({ fields }: CreateBookingFields) => {
  const {
    step,
    selectedAmenity,
    setSelectedAmenity,
    selectedLocation,
    setSelectedLocation,
    calendarDates,
    selectedDate,
    baseSlotsOfDay,
    selectedTime,
    setSelectedTime,
    mapCenter,
    bookingData,
    isBookingCancelled,
    setIsBookingCancelled,
    isLoaded,
    isLoadingAmenities,
    isLoadingTimeslots,
    uniqueAmenityTypes,
    locations,
    availableTimeOptions,
    handleDateChange,
    handleSelectSlotFromCalendarGrid,
    isBookingSlot,
    handleSubmitBookingAmenity,
    handleCreateBooking,
    backButtonOptions,
    addCalendarEventDetails,
  } = useCreateBooking(fields);

  return (
    <div className="container-sm py-5 md:py-6 flex flex-col gap-5 md:gap-6">
      <Link
        href={backButtonOptions.href}
        className="text-body-sm font-medium flex gap-4 text-navy-500 uppercase items-center"
        onClick={backButtonOptions.onClick}
      >
        <ArrowLeft className="size-5 md:size-7" />
        <Text field={backButtonOptions.label} />
      </Link>
      {step === 1 ? (
        <BookAmenity
          fields={fields}
          isLoadingAmenities={isLoadingAmenities}
          uniqueAmenityTypes={uniqueAmenityTypes}
          selectedAmenity={selectedAmenity}
          setSelectedAmenity={setSelectedAmenity}
          locations={locations}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          mapCenter={mapCenter}
          isLoaded={isLoaded}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          availableTimeOptions={availableTimeOptions}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          calendarDates={calendarDates}
          baseSlotsOfDay={baseSlotsOfDay}
          isLoadingTimeslots={isLoadingTimeslots}
          handleSelectSlotFromCalendarGrid={handleSelectSlotFromCalendarGrid}
          isBookingSlot={isBookingSlot}
          handleSubmitBookingAmenity={handleSubmitBookingAmenity}
        />
      ) : (
        <AmenityBookingDetails
          fields={fields}
          step={step}
          bookingData={bookingData}
          isBookingCancelled={isBookingCancelled}
          selectedAmenity={selectedAmenity}
          selectedLocationData={locations?.find((loc) => loc.Id === selectedLocation)}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          handleCreateBooking={handleCreateBooking}
          bookingStatus={isBookingCancelled ? 'Cancelled' : 'Upcoming'}
          addCalendarEventDetails={addCalendarEventDetails}
          bannerImage={selectedAmenity?.Photos?.find((img) => img.Title === 'portal')?.Path}
        />
      )}
      <BookingErrorModal />
      <BookingSuccessModal />
      {bookingData?.Reservation_Id ? (
        <CancelBookingModal
          reservationId={bookingData?.Reservation_Id}
          setIsBookingCancelled={setIsBookingCancelled}
        />
      ) : null}
      <CancelBookingSuccessModal />
    </div>
  );
};

export default CreateBooking;
