import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import useBrowserBackEventAction from 'src/hooks/useBrowserBackEventAction';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import CalendarIcon from 'assets/icons/CalendarIcon';
import CircleTickIcon from 'assets/icons/CircleTickIcon';
import InfoIcon from 'assets/icons/InfoIcon';
import AvailableCalendar from 'components/common/AvailableCalendar';
import { Radio } from 'components/common/Radio';
import InfoMessage from 'components/InfoMessage';
import { CustomModal } from 'components/modals/CustomModal';
import { TechnicianSlot } from 'components/ServiceRequests/Create/createRequest.types';
import { formatDateToReadable, getDateRangeSet } from 'lib/utils/helper';

import MoveOutStepper from '../Stepper/MoveOutStepper';
import InspectionList from './InspectionList';
import RescheduleInspectionModal from './RescheduleInspectionModal';
import ScheduleInspectionErrorModal from './ScheduleInspectionErrorModal';
import { ScheduleInspectionSkeleton } from './SheduleInspectionSkeleton';

const moveOutScheduleInspectionSlots: TechnicianSlot[] = [
  {
    Slot: '08:00 AM - 11:00 AM',
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

export default function ScheduleInspection({ fields }: any) {
  const { tCode, ProfileType } = useUserStore();
  const { openModal } = useUIStore();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentDate, setCurrentDate] = useState<string>();
  const [isLeaseDateBeyond30Days, setIsLeaseDateBeyond30Days] = useState(false);
  const [isLeaseExpired, setIsLeaseExpired] = useState(false);
  const [showScheduleAppointmentSuccessModal, setShowScheduleAppointmentSuccessModal] =
    useState(false);
  const [rescheduleSelectedDate, setRescheduleSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<TechnicianSlot | null>(null);
  const [rescheduleSelectedSlot, setRescheduleSelectedSlot] = useState<TechnicianSlot | null>(null);
  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [isInspectionScheduled, setIsInspectionScheduled] = useState(false);
  const [isInspectionRescheduled, setIsInspectionRescheduled] = useState(false);

  // Get MoveIn Stepper Details API
  const { mutate: getStepperStates, isPending: isLoadingStepperData } = useApiMutation<any, any>(
    () => `/MoveOut/Stepper/${tCode}`,
    'GET',
    false
  );

  // Schedule Appointment
  const { mutate: scheduleAppointmentAPI } = useApiMutation<any, any>(
    () => `/MoveOut/ScheduleAppointment`,
    'POST',
    true
  );

  // Handlers
  const normalizeSlotSpacing = (slot: string) => slot.replace(/\s*-\s*/, ' - ').trim();

  const handleSubmitScheduleInspection = () => {
    let scheduleAppointmentRequestBody;
    if (isInspectionScheduled) {
      scheduleAppointmentRequestBody = {
        Tenant_Code: tCode,
        Category: 'Moveout',
        SubCategory: 'Reschedule',
        Preferred_Date: format(rescheduleSelectedDate as Date, 'yyyy-MM-dd'),
        Preferred_TimeSlot: rescheduleSelectedSlot?.Slot,
      };
    } else {
      scheduleAppointmentRequestBody = {
        Tenant_Code: tCode,
        Category: 'Moveout',
        SubCategory: 'Schedule',
        Preferred_Date: format(selectedDate as Date, 'yyyy-MM-dd'),
        Preferred_TimeSlot: selectedSlot?.Slot,
      };
    }
    scheduleAppointmentAPI(JSON.stringify(scheduleAppointmentRequestBody), {
      onSuccess: (res) => {
        if (res?.CreateSRSchedule && res?.CreateServiceRequest) {
          if (isInspectionScheduled) {
            setIsInspectionRescheduled(true);
          }
          setShowScheduleAppointmentSuccessModal(true);
        } else {
          if (isInspectionScheduled) {
            openModal('move-out-reschedule-inspection-error-modal');
          } else {
            openModal('move-out-schedule-inspection-error-modal');
          }
        }
      },
      onError: () => {
        if (isInspectionScheduled) {
          openModal('move-out-reschedule-inspection-error-modal');
        } else {
          openModal('move-out-schedule-inspection-error-modal');
        }
      },
    });
  };

  // Fetch Steppers
  useEffect(() => {
    if (!tCode) return;

    getStepperStates(null, {
      onSuccess: (stepperResponse) => {
        if (stepperResponse) {
          setStepperAPIData(stepperResponse);
          if (
            stepperResponse?.ScheduleInspectionDate &&
            stepperResponse?.ScheduleInspectionTimeSlot
          ) {
            setIsInspectionScheduled(true);
          }

          if (stepperResponse?.LeaseEndDate) {
            const leaseEndDate = new Date(stepperResponse?.LeaseEndDate);
            const currentDate = new Date();

            // Add 30 days to current date
            const futureDate = new Date();
            futureDate.setDate(currentDate.getDate() + 30);
            if (leaseEndDate > futureDate) {
              setIsLeaseDateBeyond30Days(true);
            } else if (leaseEndDate < currentDate) {
              setIsLeaseExpired(true);
            } else {
              // format current date to "YYYY-MM-DDT00:00:00"
              const formattedCurrentDate =
                currentDate.toISOString().split('T')[0] + 'T00:00:00+00:00';

              setCurrentDate(formattedCurrentDate);
            }
          }
        }
      },
      onError: () => openModal('error-modal'),
    });
  }, [tCode]);

  // Effect to reset selected slot every other time we change the date
  useEffect(() => {
    if (selectedDate) setSelectedSlot(null);
  }, [selectedDate]);

  useBrowserBackEventAction();

  return (
    <>
      <MoveOutStepper />
      {isLoadingStepperData ? (
        <ScheduleInspectionSkeleton />
      ) : (
        <section className="ScheduleInspection">
          {isInspectionScheduled ? (
            <div className="container-sm my-8 md:my-10 space-y-5 lg:space-y-6">
              <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
                <div className="flex flex-col gap-2 lg:gap-4">
                  <div className="flex items-center gap-4">
                    <CustomRichText field={fields?.icon} />
                    <Text
                      tag="h1"
                      field={fields?.scheduledInspectionHeading}
                      className="text-[16px] md:text-[20px]"
                    />
                  </div>
                  <div className="font-light text-body">
                    <Text
                      tag="p"
                      field={fields?.scheduledInspectionDescription}
                      className="inline"
                    />
                  </div>
                </div>
                {isInspectionRescheduled ? (
                  <InfoMessage IconComponent={CircleTickIcon} status="success">
                    <Text
                      tag="p"
                      field={fields?.inspectionReScheduledSuccessInfo}
                      className="text-body font-light"
                    />
                  </InfoMessage>
                ) : null}
                <div className="flex flex-col lg:flex-row gap-5 lg:gap-0">
                  <div className="flex w-full flex-col lg:flex-row">
                    <div className="space-y-2 lg:basis-1/2">
                      <Text
                        tag="h5"
                        field={fields?.inspectionDateTimeLabel}
                        className="text-body font-medium"
                      />
                      <p className="font-light">
                        {isInspectionRescheduled
                          ? formatDateToReadable(rescheduleSelectedDate as any)
                          : formatDateToReadable(
                              stepperAPIData?.ScheduleInspectionDate || selectedDate
                            )}
                      </p>
                      <p className="font-light">
                        {isInspectionRescheduled
                          ? rescheduleSelectedSlot?.Slot
                          : stepperAPIData?.ScheduleInspectionTimeSlot || selectedSlot?.Slot}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15 uppercase mt-3"
                      disabled={false}
                      onClick={() => openModal('reschedule-inspection-modal')}
                    >
                      <CalendarIcon /> {fields?.rescheduleCTALabel?.value}
                    </button>
                  </div>
                </div>
                <InfoMessage IconComponent={InfoIcon} status="normal">
                  <CustomRichText field={fields?.infoMessage} className="text-body font-light" />
                </InfoMessage>
              </div>
              {/* Move Out Inspection List */}
              <InspectionList
                fields={fields}
                ProfileType={ProfileType}
                authorizationLetterUrl={stepperAPIData?.AuthorizationLetterUrl}
              />
            </div>
          ) : (
            <>
              {isLeaseDateBeyond30Days || isLeaseExpired ? (
                <div className="container-sm my-8 md:my-10 space-y-5 lg:space-y-6">
                  <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
                    <div className="flex flex-col gap-4 lg:gap-6">
                      <div className="flex items-center gap-4">
                        <CustomRichText field={fields?.icon} />
                        <Text
                          tag="h1"
                          field={fields?.heading}
                          className="text-[16px] md:text-[20px]"
                        />
                      </div>
                      <InfoMessage IconComponent={InfoIcon} status="normal">
                        <p className="text-body">
                          {isLeaseExpired
                            ? fields?.leaseExpiredInfo?.value
                            : fields?.inspectionBeyond30DaysInfo?.value}
                        </p>
                      </InfoMessage>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="container-sm my-8 md:my-10 space-y-5 lg:space-y-6">
                  <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
                    <div className="flex flex-col gap-4 lg:gap-6">
                      <div className="flex items-center gap-4">
                        <CustomRichText field={fields?.icon} />
                        <Text
                          tag="h1"
                          field={fields?.heading}
                          className="text-[16px] md:text-[20px]"
                        />
                      </div>
                      <div className="flex flex-col gap-5 lg:gap-6 upload-section">
                        <div className="grid md:grid-cols-2 gap-0 lg:gap-6">
                          {/* Calendar */}
                          <AvailableCalendar
                            selectedDate={selectedDate}
                            onSelect={setSelectedDate}
                            availableDateKeys={getDateRangeSet(
                              currentDate as string,
                              stepperAPIData?.LeaseEndDate,
                              true
                            )}
                          />

                          {/* Slots */}
                          <div className="pb-0 px-0 pt-4 lg:p-4 flex flex-col justify-center gap-3">
                            {!selectedDate && (
                              <Text
                                tag="p"
                                field={fields?.timeslotSelectionMessage}
                                className="text-navy-400 text-body font-light"
                              />
                            )}
                            {selectedDate &&
                              moveOutScheduleInspectionSlots.map((slot) => {
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
                                        ? (parseInt(v) % 12) +
                                          (slotStartStr.includes('PM') ? 12 : 0)
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
                        <InfoMessage IconComponent={InfoIcon} status="normal">
                          <CustomRichText
                            field={fields?.scheduleAllowedInfo}
                            className="text-body font-light"
                          />
                        </InfoMessage>
                      </div>
                    </div>
                  </div>

                  {/* Move Out Inspection List */}
                  <InspectionList
                    fields={fields}
                    ProfileType={ProfileType}
                    authorizationLetterUrl={stepperAPIData?.AuthorizationLetterUrl}
                  />

                  <div className="btn-wrapper flex flex-col justify-center items-end gap-2 md:gap-3">
                    <button
                      type="button"
                      className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
                      disabled={!selectedDate || !selectedSlot}
                      onClick={handleSubmitScheduleInspection}
                    >
                      {fields?.scheduleCTALabel?.value}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}
      <RescheduleInspectionModal
        tCode={tCode}
        fields={fields}
        rescheduleSelectedDate={rescheduleSelectedDate}
        setRescheduleSelectedDate={setRescheduleSelectedDate as any}
        rescheduleSelectedSlot={rescheduleSelectedSlot}
        setRescheduleSelectedSlot={setRescheduleSelectedSlot}
        setIsInspectionRescheduled={setIsInspectionRescheduled}
        availableDateKeys={getDateRangeSet(
          currentDate as string,
          stepperAPIData?.LeaseEndDate,
          true
        )}
        moveOutScheduleInspectionSlots={moveOutScheduleInspectionSlots}
        handleSubmitScheduleInspection={handleSubmitScheduleInspection}
      />
      {showScheduleAppointmentSuccessModal ? (
        <CustomModal
          showModal={showScheduleAppointmentSuccessModal}
          setShowModal={setShowScheduleAppointmentSuccessModal}
          primaryBtnLabel={'Close'}
          heading={
            isInspectionScheduled
              ? fields?.inspectionReScheduledSuccessTitle?.value
              : fields?.inspectionScheduledSuccessTitle?.value
          }
          handlePrimaryBtnClick={() => {
            setIsInspectionScheduled(true);
          }}
        />
      ) : null}
      <ScheduleInspectionErrorModal
        title={fields?.inspectionScheduledErrorTitle?.value}
        description={fields?.inspectionScheduledErrorDescription?.value}
      />
    </>
  );
}
