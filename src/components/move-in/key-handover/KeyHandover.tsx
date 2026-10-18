import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import useBrowserBackEventAction from 'src/hooks/useBrowserBackEventAction';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import CalendarIcon from 'assets/icons/CalendarIcon';
import CircleTickIcon from 'assets/icons/CircleTickIcon';
import EmailIcon from 'assets/icons/EmailIcon';
import InfoIcon from 'assets/icons/InfoIcon';
import LocationIcon from 'assets/icons/LocationIcon';
import AvailableCalendar from 'components/common/AvailableCalendar';
import { Radio } from 'components/common/Radio';
import InfoMessage from 'components/InfoMessage';
import { CustomModal } from 'components/modals/CustomModal';
import { TechnicianSlot } from 'components/ServiceRequests/Create/createRequest.types';
import { formatDateToReadable, getDateRangeSet } from 'lib/utils/helper';

import { KeyHandoverProps } from './KeyHandover.types';
import { KeyHandoverSkeleton } from './KeyHandoverSkeleton';
import RescheduleKeyHandoverModal from './RescheduleKeyHandoverModal';
import SingleUnitCorporateSection from './SingleUnitCorporateSection';
import MoveInStepper from '../Stepper/MoveInStepper';

const moveInKeyHandoverSlots: TechnicianSlot[] = [
  {
    Slot: '8:30 AM - 11:00 AM',
    IsAvailable: true,
  },
  {
    Slot: '11:00 AM - 02:00 PM',
    IsAvailable: true,
  },
  {
    Slot: '02:00 PM - 04:00 PM',
    IsAvailable: true,
  },
];

const KeyHandover = ({ fields }: KeyHandoverProps) => {
  const { tCode, CommunityAddress, CommunityOfficeWorkingHrs, CommunityEmail, ProfileType } =
    useUserStore();
  const { openModal } = useUIStore();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [rescheduleSelectedDate, setRescheduleSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<TechnicianSlot | null>(null);
  const [rescheduleSelectedSlot, setRescheduleSelectedSlot] = useState<TechnicianSlot | null>(null);
  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [showScheduleAppointmentSuccessModal, setShowScheduleAppointmentSuccessModal] =
    useState(false);
  const [isInspectionScheduled, setIsInspectionScheduled] = useState(false);
  const [isInspectionRescheduled, setIsInspectionRescheduled] = useState(false);

  // Schedule Appointment
  const { mutate: scheduleAppointmentAPI } = useApiMutation<any, any>(
    () => `/MoveIn/ScheduleAppointment`,
    'POST',
    true
  );

  // Handlers

  const handleSubmitScheduleAppointment = () => {
    const scheduleAppointmentRequestBody = {
      Tenant_Code: tCode,
      Category: 'MoveIn',
      SubCategory: 'Move_In_Schedule',
      Preferred_Date: format(selectedDate as Date, 'yyyy-MM-dd'),
      Preferred_TimeSlot: selectedSlot?.Slot,
    };
    scheduleAppointmentAPI(JSON.stringify(scheduleAppointmentRequestBody), {
      onSuccess: (res) => {
        if (res?.CreateSRSchedule && res?.CreateServiceRequest) {
          setShowScheduleAppointmentSuccessModal(true);
        } else {
          openModal('error-modal');
        }
      },
      onError: () => openModal('error-modal'),
    });
  };

  // Fetch Steppers
  useEffect(() => {
    if (stepperAPIData) {
      if (stepperAPIData?.ScheduleKeyHandoverDate && stepperAPIData?.ScheduleKeyHandoverTimeSlot) {
        setIsInspectionScheduled(true);
      }
    }
  }, [stepperAPIData]);

  // Effect to reset selected slot every other time we change the date
  useEffect(() => {
    if (selectedDate) setSelectedSlot(null);
  }, [selectedDate]);

  useBrowserBackEventAction();

  const normalizeSlotSpacing = (slot: string) => slot.replace(/\s*-\s*/, ' - ').trim();

  return (
    <>
      <MoveInStepper setStepperAPIData={setStepperAPIData} />
      <>
        {!stepperAPIData ||
        !stepperAPIData?.Steppers[0]?.StepCompleted || // Show Skeleton when step 1 & 2 is not completed & we are accessing step3 directly
        !stepperAPIData?.Steppers[1]?.StepCompleted ? (
          <KeyHandoverSkeleton />
        ) : (
          <>
            {isInspectionScheduled ? (
              <div className="container-sm relative -top-16.5 lg:static py-8 md:py-10 flex flex-col gap-5 md:gap-6">
                <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
                  <div className="flex flex-col gap-2 lg:gap-3">
                    <div className="flex items-center gap-4">
                      <CustomRichText field={fields?.headingIcon} />
                      <Text
                        tag="h1"
                        field={fields?.detailsSectionTitle}
                        className="text-[16px] md:text-[20px]"
                      />
                    </div>
                    <div className="font-light text-body">
                      <Text tag="p" field={fields?.detailsSectionDescription} className="inline" />
                    </div>
                  </div>
                  {isInspectionRescheduled ? (
                    <InfoMessage IconComponent={CircleTickIcon} status="success">
                      <Text
                        tag="p"
                        field={fields?.rescheduleSuccessInfoText}
                        className="text-body font-light"
                      />
                    </InfoMessage>
                  ) : null}
                  <div className="flex flex-col lg:flex-row gap-5 lg:gap-0">
                    <div className="space-y-2 lg:basis-1/2">
                      <Text
                        tag="h5"
                        field={fields?.handoverDateTimeLabel}
                        className="text-body font-medium"
                      />
                      <p className="font-light">
                        {isInspectionRescheduled
                          ? formatDateToReadable(rescheduleSelectedDate as any)
                          : formatDateToReadable(
                              stepperAPIData?.ScheduleKeyHandoverDate || selectedDate
                            )}
                      </p>
                      <p className="font-light">
                        {isInspectionRescheduled
                          ? rescheduleSelectedSlot?.Slot
                          : stepperAPIData?.ScheduleKeyHandoverTimeSlot || selectedSlot?.Slot}
                      </p>
                      <button
                        type="button"
                        className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15 uppercase mt-3"
                        disabled={false}
                        onClick={() => openModal('reschedule-key-handover-modal')}
                      >
                        <CalendarIcon /> {fields?.rescheduleCTALabel?.value}
                      </button>
                    </div>
                    <div className="space-y-2 lg:space-y-3 lg:ml-20 lg:basis-1/2">
                      <Text
                        tag="h5"
                        field={fields?.contactOptionsLabel}
                        className="text-body font-medium inline"
                      />
                      :
                      <div className="flex gap-3 lg:gap-4 items-start">
                        <LocationIcon className="text-lilac-500 size-8 shrink-0 mt-0.5" />
                        <div className="font-light space-y-1 min-w-0">
                          {CommunityAddress || CommunityOfficeWorkingHrs ? (
                            <>
                              {CommunityAddress?.trim() ? (
                                <p className="leading-6">{CommunityAddress.trim()}</p>
                              ) : null}
                              {CommunityOfficeWorkingHrs ? (
                                <p className="leading-6">{CommunityOfficeWorkingHrs}</p>
                              ) : null}
                            </>
                          ) : (
                            <p>-</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3 lg:gap-4 items-center">
                        <EmailIcon className="text-lilac-500 size-8 shrink-0" />
                        <p className="font-light">{CommunityEmail}</p>
                      </div>
                    </div>
                  </div>
                  <InfoMessage IconComponent={InfoIcon} status="normal">
                    <Text tag="p" field={fields?.infoText} className="text-body font-light" />
                  </InfoMessage>
                </div>
                {ProfileType === 6 && (
                  <SingleUnitCorporateSection
                    fields={fields}
                    authorizationLetterUrl={stepperAPIData?.AuthorizationLetterUrl}
                  />
                )}
              </div>
            ) : (
              <div className="container-sm relative -top-16.5 lg:static py-8 md:py-10 flex flex-col gap-5 md:gap-6">
                <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
                  <div className="flex flex-col gap-2 lg:gap-3">
                    <div className="flex items-center gap-4">
                      <CustomRichText field={fields?.headingIcon} />
                      <Text tag="h1" field={fields?.title} className="text-[16px] md:text-[20px]" />
                    </div>
                    <div className="font-light text-body">
                      <Text tag="p" field={fields?.description} className="inline" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-5 lg:gap-6 upload-section">
                    <div className="grid md:grid-cols-2 gap-0 lg:gap-6">
                      {/* Calendar */}
                      <AvailableCalendar
                        selectedDate={selectedDate}
                        onSelect={setSelectedDate}
                        availableDateKeys={getDateRangeSet(
                          stepperAPIData?.CalenderStartDate,
                          stepperAPIData?.CalenderEndDate,
                          true
                        )}
                      />

                      {/* Slots */}
                      <div className="pb-0 px-0 pt-4 lg:p-4 flex flex-col justify-center gap-3">
                        {!selectedDate && (
                          <p className="text-navy-400 text-body font-light">
                            Select your preferred date to view our available time slots.
                          </p>
                        )}
                        {selectedDate &&
                          moveInKeyHandoverSlots.map((slot) => {
                            const cleanSlot = normalizeSlotSpacing(slot.Slot);

                            slot.Slot = cleanSlot;

                            // Parse slot start time for comparison
                            const slotStartStr = cleanSlot.split(' - ')[0];
                            const today = new Date();
                            const slotStartTime = new Date(
                              today.getFullYear(),
                              today.getMonth(),
                              today.getDate(),
                              ...(slotStartStr
                                .match(/(\d+):(\d+)\s*(AM|PM)/)
                                ?.slice(1, 3)
                                .map((v, i) =>
                                  i === 0
                                    ? (parseInt(v) % 12) + (slotStartStr.includes('PM') ? 12 : 0)
                                    : parseInt(v)
                                ) || [0, 0])
                            );

                            // Check if selectedDate is today and current time is past slot start
                            const isTodaySelected =
                              selectedDate.toDateString() === today.toDateString();
                            const isPastSlot = isTodaySelected && today >= slotStartTime;

                            return (
                              <Radio
                                id={cleanSlot}
                                name="technician-slot"
                                value={cleanSlot}
                                key={cleanSlot}
                                label={cleanSlot}
                                disabled={!slot?.IsAvailable || isPastSlot}
                                onChange={() =>
                                  slot?.IsAvailable && !isPastSlot && setSelectedSlot(slot)
                                }
                                checked={selectedSlot?.Slot === cleanSlot}
                                className={`border border-lilac-400 flex-row-reverse w-full justify-between rounded-lg p-3 md:p-4 text-left transition text-body
                                  ${
                                    !slot?.IsAvailable || isPastSlot
                                      ? 'bg-silver-chalice-300 opacity-100 border-0 cursor-not-allowed'
                                      : selectedSlot?.Slot === cleanSlot
                                      ? 'bg-lilac-100'
                                      : 'hover:bg-lilac-50'
                                  }`}
                                inputClassName={`h-4! w-4! ${
                                  !slot?.IsAvailable || isPastSlot
                                    ? 'appearance-none border rounded-full'
                                    : ''
                                }`}
                              />
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
                {ProfileType === 6 && (
                  <SingleUnitCorporateSection
                    fields={fields}
                    authorizationLetterUrl={stepperAPIData?.AuthorizationLetterUrl}
                  />
                )}
                <div className="btn-wrapper flex flex-col justify-center items-end gap-2 md:gap-3">
                  <button
                    type="button"
                    className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
                    disabled={!selectedDate || !selectedSlot}
                    onClick={handleSubmitScheduleAppointment}
                  >
                    {fields?.submitCTALabel?.value}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </>
      {showScheduleAppointmentSuccessModal ? (
        <CustomModal
          showModal={showScheduleAppointmentSuccessModal}
          setShowModal={setShowScheduleAppointmentSuccessModal}
          primaryBtnLabel={fields?.handoverSuccessModalCloseCTALabel?.value}
          heading={fields?.handoverSuccessModalTitle?.value}
          handlePrimaryBtnClick={() => {
            setIsInspectionScheduled(true);
            router.refresh();
          }}
        />
      ) : null}
      <RescheduleKeyHandoverModal
        tCode={tCode}
        fields={fields}
        rescheduleSelectedDate={rescheduleSelectedDate}
        setRescheduleSelectedDate={setRescheduleSelectedDate as any}
        rescheduleSelectedSlot={rescheduleSelectedSlot}
        setRescheduleSelectedSlot={setRescheduleSelectedSlot}
        setIsInspectionRescheduled={setIsInspectionRescheduled}
        availableDateKeys={getDateRangeSet(
          stepperAPIData?.CalenderStartDate,
          stepperAPIData?.CalenderEndDate,
          true
        )}
        moveInKeyHandoverSlots={moveInKeyHandoverSlots}
      />
    </>
  );
};

export default KeyHandover;
