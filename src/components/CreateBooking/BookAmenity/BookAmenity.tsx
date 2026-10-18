import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { BookAmenityProps } from '../CreateBooking.types';
import AmenitiesSkeleton from './AmenitiesSkeleton';
import { getNextThreeDays } from 'lib/utils/helper';
import CircleInfoIcon from 'assets/icons/CircleInfoIcon';
import Select from 'components/common/Select';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import DateInput from 'components/common/DateInput';
import InfoMessage from 'components/InfoMessage';
import { SlotsGridView } from './SlotsGridView';
import CalendarIcon from 'assets/icons/CalendarIcon';
import { Radio } from 'components/common/Radio';

export const BookAmenity: React.FC<BookAmenityProps> = ({
  fields,
  isLoadingAmenities,
  uniqueAmenityTypes,
  selectedAmenity,
  setSelectedAmenity,
  locations,
  selectedLocation,
  setSelectedLocation,
  isLoaded,
  mapCenter,
  selectedDate,
  handleDateChange,
  availableTimeOptions,
  selectedTime,
  setSelectedTime,
  calendarDates,
  baseSlotsOfDay,
  isLoadingTimeslots,
  isBookingSlot,
  handleSelectSlotFromCalendarGrid,
  handleSubmitBookingAmenity,
}) => {
  return (
    <div className="bg-white-pure border border-lilac-300 rounded-xl p-5 md:p-6 flex flex-col gap-5 md:gap-6">
      <div className="flex gap-4 items-center">
        <CalendarIcon className="size-6 text-lilac-500" />
        <Text tag="h1" field={fields?.title} className="text-[16px] md:text-[20px]" />
      </div>

      {isLoadingAmenities ? (
        <AmenitiesSkeleton />
      ) : (
        <>
          <div>
            <Text tag="p" field={fields?.description} className="text-body font-light" />
            {/* Amenity Types */}
            <div className="flex gap-2 lg:gap-6 flex-wrap mt-3">
              {uniqueAmenityTypes.map((amenity) => (
                <Radio
                  id={amenity.Type}
                  name="amenity"
                  value={amenity.Type}
                  key={amenity.Id}
                  label={amenity.Type}
                  onChange={() => setSelectedAmenity(amenity)}
                  checked={selectedAmenity?.Id === amenity.Id}
                  className={`border border-lilac-400 flex-row-reverse w-full justify-between rounded-lg p-3 md:p-4 text-left transition text-body mb-0! lg:max-w-61.5
                ${selectedAmenity?.Id === amenity.Id ? 'bg-lilac-100' : 'hover:bg-lilac-50'}`}
                  inputClassName="size-4!"
                />
              ))}
            </div>
          </div>

          {/* Location + Map */}
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
            <div className="w-82">
              <Text
                tag="h3"
                field={fields?.facilitySectionTitle}
                className="text-body font-medium"
              />
              <Text
                tag="p"
                field={fields?.facilityDescription}
                className="text-body font-light mt-2 lg:mt-3"
              />
              <Select
                label="Facility"
                options={locations.map((location: any) => ({
                  value: location.Id.toString(),
                  label: location.Name,
                }))}
                value={selectedLocation?.toString() || ''}
                onChange={(val: number) => setSelectedLocation(val ? Number(val) : null)}
                placeholder="Select court/pitch"
                className="mt-2 md:mt-4"
              />
            </div>

            <div className="lg:w-132 max-h-56">
              {isLoaded && (
                <GoogleMap
                  center={mapCenter}
                  zoom={15}
                  mapContainerStyle={{
                    width: '100%',
                    height: '225px',
                    borderRadius: '12px',
                    border: '1px solid #C4CAFF',
                  }}
                >
                  <Marker
                    position={mapCenter}
                    icon={{ url: '/assets/svg/marker-1.svg' }}
                    zIndex={10}
                  />
                </GoogleMap>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <h3 className="text-body font-medium">Date & Time</h3>
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 mt-5 lg:mt-3">
              <DateInput
                selectedDate={selectedDate}
                onSelect={handleDateChange}
                availableDateKeys={getNextThreeDays()}
                disabled={!selectedLocation}
                label="Select date"
                className="lg:max-w-81.25"
                enablePlaceHolder
                placeholder="MM/DD/YYYY"
              />
              <Select
                label="Select time"
                options={availableTimeOptions}
                value={selectedTime}
                onChange={setSelectedTime}
                className="lg:max-w-81.25"
                placeholder="Select Time"
              />
            </div>
          </div>

          {/* Slots Grid View */}
          {selectedLocation && calendarDates?.length && !isLoadingTimeslots ? (
            <SlotsGridView
              calendarDates={calendarDates}
              baseSlotsOfDay={baseSlotsOfDay}
              isBookingSlot={isBookingSlot}
              handleSelectSlotFromCalendarGrid={handleSelectSlotFromCalendarGrid}
            />
          ) : null}

          <InfoMessage IconComponent={CircleInfoIcon} status="warning">
            <p className="text-body">{fields?.dateSelectionWarning?.value}</p>
          </InfoMessage>
        </>
      )}

      <div className="btn-wrapper flex flex-col justify-center items-end gap-2 md:gap-3">
        <button
          type="button"
          disabled={!selectedTime}
          className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
          onClick={handleSubmitBookingAmenity}
        >
          {fields?.bookAmenityCTA?.value}
        </button>
      </div>
    </div>
  );
};
