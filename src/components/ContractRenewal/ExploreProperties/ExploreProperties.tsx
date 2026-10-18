'use client';

import { JSX } from 'react';
import Image from 'next/image';
import SearchIcon from 'assets/icons/SearchIcon';
import { Input } from 'components/common/Input';
import { Radio } from 'components/common/Radio';
import Select from 'components/common/Select';
import DateInput from 'components/common/DateInput';
import { PriceRangeSlider } from 'components/common/PriceRangeSlider';
import { CustomModal } from 'components/modals/CustomModal';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import {
  AREA_MAX,
  AREA_MIN,
  AREA_STEP,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
  useExploreProperties,
} from './useExploreProperties';

function AvailabilityEmptyState({
  messagePrefix,
  highlightName,
  contactMessage,
  contactNumber = '800 9933',
}: {
  messagePrefix: string;
  highlightName: string;
  contactMessage: string;
  contactNumber?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 md:py-12 px-2">
      <Image
        src="/assets/svg/no-maintenance-request.svg"
        alt=""
        width={150}
        height={107}
        className="mx-auto"
      />
      <p className="text-body font-light text-navy-500 mt-5 md:mt-6 max-w-[36rem]">
        {messagePrefix} <span className="font-medium">{highlightName}</span>.
      </p>
      <p className="text-body font-light text-navy-500 mt-2 max-w-[36rem]">
        {contactMessage}{' '}
        <a href={`tel:${contactNumber.replace(/\s/g, '')}`} className="font-medium text-lilac-500">
          {contactNumber}
        </a>
        .
      </p>
    </div>
  );
}

export default function ExploreProperties({ fields = {} }: { fields?: any }): JSX.Element {
  const {
    community,
    handleCommunityChange,
    communityOptions,
    propertyType,
    handlePropertyTypeChange,
    propertyTypeOptions,
    bedrooms,
    setBedrooms,
    bedroomOptions,
    areaRange,
    areaMinInput,
    areaMaxInput,
    handleAreaRangeChange,
    handleAreaMinInputChange,
    handleAreaMaxInputChange,
    priceRange,
    priceMinInput,
    priceMaxInput,
    handlePriceRangeChange,
    handlePriceMinInputChange,
    handlePriceMaxInputChange,
    moveInDate,
    setMoveInDate,
    moveInDisableBefore,
    moveInDisableAfter,
    showPropertyTypesSection,
    showBedroomsSection,
    showFiltersAfterBedroom,
    emptyCommunityMessage,
    emptyPropertyTypeMessage,
    isCommunitiesReady,
    isConfirmDisabled,
    showSuccessModal,
    handleCancel,
    handleConfirm,
    handleSuccessModalClose,
  } = useExploreProperties();

  const contactNumber = fields?.emptyStateContactNumber?.value ?? '800 9933';
  const contactMessagePrefix =
    fields?.emptyStateContactMessage?.value ?? 'For any further enquiries please contact us on';

  return (
    <section className="ExploreProperties bg-silver-chalice-50">
      <div className="container-sm py-8 md:py-10 flex flex-col gap-6">
        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 md:gap-4 items-center">
              <SearchIcon className="size-7 md:size-8 text-lilac-500 shrink-0" />
              <Text
                tag="h2"
                field={fields?.formHeading}
                className="text-base md:text-heading-3 font-normal text-navy-500"
              />
            </div>
            <Text
              tag="p"
              field={fields?.formDescription}
              className="text-body font-light text-navy-500"
            />
          </div>

          {isCommunitiesReady ? (
            <div className="flex flex-col gap-2 w-full md:w-[282px]">
              <p className="text-[20px] font-normal text-navy-500">
                {fields?.communityLabel?.value ?? 'Community'}
              </p>
              <Select
                className="w-full"
                placeholder={fields?.communityPlaceholder?.value ?? 'Select community'}
                options={communityOptions}
                value={community}
                onChange={handleCommunityChange}
              />
            </div>
          ) : null}

          {emptyCommunityMessage ? (
            <AvailabilityEmptyState
              messagePrefix={
                fields?.emptyCommunityMessage?.value ??
                'We currently do not have any availability for requested community,'
              }
              highlightName={emptyCommunityMessage}
              contactMessage={contactMessagePrefix}
              contactNumber={contactNumber}
            />
          ) : null}

          {showPropertyTypesSection ? (
            <div className="flex flex-col gap-2 w-full md:max-w-[30rem]">
              <p className="text-[20px] font-normal text-navy-500">
                {fields?.propertyTypeLabel?.value ?? 'Property type'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {propertyTypeOptions.map((option) => {
                  const isSelected = propertyType === option.value;

                  return (
                    <Radio
                      key={option.value}
                      id={`property-type-${option.value}`}
                      name="propertyType"
                      value={option.value}
                      label={option.label}
                      checked={isSelected}
                      onChange={handlePropertyTypeChange}
                      className={`w-full border rounded-lg p-3 md:p-4 flex-row-reverse justify-between items-center mb-0 ${
                        isSelected
                          ? 'bg-lilac-100 border-lilac-400'
                          : 'bg-white-pure border-lilac-300'
                      }`}
                      inputClassName="size-4!"
                    />
                  );
                })}
              </div>
            </div>
          ) : null}

          {emptyPropertyTypeMessage ? (
            <AvailabilityEmptyState
              messagePrefix={
                fields?.emptyPropertyTypeMessage?.value ??
                'We currently do not have any availability for requested unit type,'
              }
              highlightName={emptyPropertyTypeMessage}
              contactMessage={contactMessagePrefix}
              contactNumber={contactNumber}
            />
          ) : null}

          {showBedroomsSection ? (
            <div className="flex flex-col gap-2">
              <p className="text-[20px] font-normal text-navy-500">
                {fields?.bedroomsLabel?.value ?? 'Bedrooms'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {bedroomOptions.map((option) => {
                  const isSelected = bedrooms === option.value;

                  return (
                    <Radio
                      key={option.value}
                      id={`bedrooms-${option.value}`}
                      name="bedrooms"
                      value={option.value}
                      label={option.label}
                      checked={isSelected}
                      onChange={setBedrooms}
                      className={`w-full border rounded-lg p-3 md:p-4 flex-row-reverse justify-between items-center mb-0 ${
                        isSelected
                          ? 'bg-lilac-100 border-lilac-400'
                          : 'bg-white-pure border-lilac-300'
                      }`}
                      inputClassName="size-4!"
                    />
                  );
                })}
              </div>
            </div>
          ) : null}

          {showFiltersAfterBedroom ? (
            <>
              <div className="flex flex-col gap-2 w-full md:max-w-[36rem]">
                <p className="text-[20px] font-normal text-navy-500">
                  {fields?.areaLabel?.value ?? 'Area (sqft)'}
                </p>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                  <Input
                    placeholder={fields?.areaMinPlaceholder?.value ?? 'No min'}
                    value={areaMinInput}
                    onChange={(e) => handleAreaMinInputChange(e.target.value)}
                    inputMode="numeric"
                    showClearButton={false}
                    containerClassName="w-full md:w-[7.5rem] shrink-0"
                  />
                  <PriceRangeSlider
                    className="w-full flex-1 min-w-0"
                    min={AREA_MIN}
                    max={AREA_MAX}
                    step={AREA_STEP}
                    value={areaRange}
                    onChange={handleAreaRangeChange}
                    minAriaLabel="Minimum area"
                    maxAriaLabel="Maximum area"
                  />
                  <Input
                    placeholder={fields?.areaMaxPlaceholder?.value ?? 'No max'}
                    value={areaMaxInput}
                    onChange={(e) => handleAreaMaxInputChange(e.target.value)}
                    inputMode="numeric"
                    showClearButton={false}
                    containerClassName="w-full md:w-[7.5rem] shrink-0"
                  />
                </div>
                <p className="text-body-sm font-light text-silver-chalice-700">
                  {fields?.areaRangeHelperText?.value ??
                    'Please use the slider to select area range or enter it in the fields manually.'}
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full md:max-w-[36rem]">
                <p className="text-[20px] font-normal text-navy-500">
                  {fields?.priceRangeLabel?.value ?? 'Price range'}
                </p>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                  <Input
                    placeholder={fields?.priceMinPlaceholder?.value ?? 'No min'}
                    value={priceMinInput}
                    onChange={(e) => handlePriceMinInputChange(e.target.value)}
                    inputMode="numeric"
                    showClearButton={false}
                    containerClassName="w-full md:w-[7.5rem] shrink-0"
                  />
                  <PriceRangeSlider
                    className="w-full flex-1 min-w-0"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                  />
                  <Input
                    placeholder={fields?.priceMaxPlaceholder?.value ?? 'No max'}
                    value={priceMaxInput}
                    onChange={(e) => handlePriceMaxInputChange(e.target.value)}
                    inputMode="numeric"
                    showClearButton={false}
                    containerClassName="w-full md:w-[7.5rem] shrink-0"
                  />
                </div>
                <p className="text-body-sm font-light text-silver-chalice-700">
                  {fields?.priceRangeHelperText?.value ??
                    'Please use the slider to select price range or enter it in the fields manually.'}
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full md:max-w-[20rem]">
                <p className="text-[20px] font-normal text-navy-500">
                  {fields?.moveInDateLabel?.value ?? 'Move in date'}
                </p>
                <DateInput
                  label=""
                  selectedDate={moveInDate}
                  onSelect={setMoveInDate}
                  disableBefore={moveInDisableBefore}
                  disableAfter={moveInDisableAfter}
                  enablePlaceHolder
                  placeholder="Add date"
                  className="w-full [&>label]:hidden"
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="btn-wrapper flex flex-col md:flex-row justify-end gap-4 md:gap-6">
          <button
            type="button"
            className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15"
            onClick={handleCancel}
          >
            {fields?.cancelButtonText?.value ?? 'CANCEL'}
          </button>
          <button
            type="button"
            className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 ${
              isConfirmDisabled ? 'disabled' : ''
            }`}
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
          >
            {fields?.confirmButtonText?.value ?? 'CONFIRM'}
          </button>
        </div>

        <CustomModal
          showModal={showSuccessModal}
          setShowModal={(isOpen) => {
            if (!isOpen) handleSuccessModalClose();
          }}
          modalType="success"
          imagePath="/assets/svg/property-send.svg"
          heading={fields?.successModalHeading?.value ?? 'Thank you!'}
          description={
            fields?.successModalDescription?.value ??
            'Your request has been received. A Leasing Executive will contact you shortly.'
          }
          primaryBtnLabel={fields?.successModalButtonText?.value ?? 'OK'}
          handlePrimaryBtnClick={handleSuccessModalClose}
        />
      </div>
    </section>
  );
}
