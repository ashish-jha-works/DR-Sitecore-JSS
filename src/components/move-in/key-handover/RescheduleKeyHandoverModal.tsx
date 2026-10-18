import React, { useEffect } from 'react';
import { useUIStore } from 'src/store/useUIStore';
import CrossIcon from 'assets/icons/CrossIcon';
import AvailableCalendar from 'components/common/AvailableCalendar';
import { Radio } from 'components/common/Radio';
import { useApiMutation } from 'src/hooks/useApi';
import { format } from 'date-fns';
import { KeyHandoverFields } from './KeyHandover.types';
import { TechnicianSlot } from 'components/ServiceRequests/Create/createRequest.types';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';

const normalizeSlotSpacing = (slot: string) => slot.replace(/\s*-\s*/, ' - ').trim();

const RescheduleKeyHandoverModal = ({
  tCode,
  fields,
  rescheduleSelectedDate,
  setRescheduleSelectedDate,
  rescheduleSelectedSlot,
  setRescheduleSelectedSlot,
  setIsInspectionRescheduled,
  availableDateKeys,
  moveInKeyHandoverSlots,
}: {
  tCode: string | null;
  fields: KeyHandoverFields;
  rescheduleSelectedDate: Date | undefined;
  setRescheduleSelectedDate: (value: Date | undefined | null) => void;
  rescheduleSelectedSlot: TechnicianSlot | null;
  setRescheduleSelectedSlot: (value: TechnicianSlot | null) => void;
  setIsInspectionRescheduled: (value: boolean) => void;
  availableDateKeys: any;
  moveInKeyHandoverSlots: any;
}) => {
  const { activeModal, closeModal, openModal } = useUIStore();

  // Schedule Appointment
  const { mutate: scheduleAppointmentAPI } = useApiMutation<any, any>(
    () => `/MoveIn/ScheduleAppointment`,
    'POST',
    true
  );

  const handleClearModalInstance = () => {
    setRescheduleSelectedDate(null);
    setRescheduleSelectedSlot(null);
    setIsInspectionRescheduled(false);
    closeModal();
  };

  const handleSubmitScheduleAppointment = () => {
    const scheduleAppointmentRequestBody = {
      Tenant_Code: tCode,
      Category: 'MoveIn',
      SubCategory: 'Move_In_Re_Schedule',
      Preferred_Date: format(rescheduleSelectedDate as Date, 'yyyy-MM-dd'),
      Preferred_TimeSlot: rescheduleSelectedSlot?.Slot,
    };
    scheduleAppointmentAPI(JSON.stringify(scheduleAppointmentRequestBody), {
      onSuccess: (res) => {
        if (res?.CreateSRSchedule && res?.CreateServiceRequest) {
          setIsInspectionRescheduled(true);
          closeModal();
        } else {
          openModal('error-modal');
        }
      },
      onError: () => openModal('error-modal'),
    });
  };

  // Effect to reset selected slot every other time we change the date
  useEffect(() => {
    if (rescheduleSelectedDate) setRescheduleSelectedSlot(null);
  }, [rescheduleSelectedDate]);

  return (
    <div
      className={`custom-modal ${activeModal === 'reschedule-key-handover-modal' ? 'show' : ''}`}
    >
      <div className="relative bg-white-pure lg:w-[90%] max-w-4xl rounded-xl p-4 md:p-8">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-2 lg:gap-3">
            <div className="flex items-center gap-4">
              <CustomRichText field={fields?.headingIcon} />
              <Text
                tag="h1"
                field={fields?.rescheduleModalTitle}
                className="text-[16px] md:text-[20px]"
              />
            </div>
            <div className="font-light text-body">
              <Text tag="p" field={fields?.rescheduleModalDescription} className="inline" />
            </div>
          </div>
          <button onClick={handleClearModalInstance} className="text-gray-500 cursor-pointer">
            <CrossIcon className="size-6 md:size-7 text-lilac-500" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-5 lg:gap-16.5 mt-5 mb-3 md:my-6">
          {/* Calendar */}
          <AvailableCalendar
            selectedDate={rescheduleSelectedDate}
            onSelect={setRescheduleSelectedDate}
            availableDateKeys={availableDateKeys}
          />

          {/* Slots */}
          <div className="pb-0 px-0 lg:p-4 flex flex-col justify-center gap-2">
            {!rescheduleSelectedDate && (
              <p className="text-navy-400 text-body font-light">
                Select your preferred date to view our available time slots.
              </p>
            )}
            {rescheduleSelectedDate &&
              moveInKeyHandoverSlots.map((slot: any) => {
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
                  rescheduleSelectedDate.toDateString() === today.toDateString();
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
                      slot?.IsAvailable && !isPastSlot && setRescheduleSelectedSlot(slot)
                    }
                    checked={rescheduleSelectedSlot?.Slot === cleanSlot}
                    className={`border border-lilac-400 flex-row-reverse w-full justify-between rounded-lg p-3 md:p-4 text-left transition text-body
                                              ${
                                                !slot?.IsAvailable || isPastSlot
                                                  ? 'bg-silver-chalice-300 opacity-100 border-0 cursor-not-allowed'
                                                  : rescheduleSelectedSlot?.Slot === cleanSlot
                                                  ? 'bg-lilac-100'
                                                  : 'hover:bg-lilac-50'
                                              }`}
                    inputClassName={`h-4! w-4! ${
                      !slot?.IsAvailable || isPastSlot ? 'appearance-none border rounded-full' : ''
                    }`}
                  />
                );
              })}
          </div>
        </div>
        <div className="btn-wrapper flex justify-end">
          <button
            className={`btn btn-primary w-full md:w-auto md:min-w-68.75`}
            onClick={handleSubmitScheduleAppointment}
            disabled={!rescheduleSelectedDate || !rescheduleSelectedSlot}
          >
            {fields?.rescheduleSubmitCTALabel?.value}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleKeyHandoverModal;
