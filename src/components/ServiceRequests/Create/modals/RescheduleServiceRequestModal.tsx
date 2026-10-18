import React, { useState } from 'react';
import { useUIStore } from 'src/store/useUIStore';

import CircleInfoIcon from 'assets/icons/CircleInfoIcon';
import CrossIcon from 'assets/icons/CrossIcon';
import MaintenanceIcon from 'assets/icons/MaintenanceIcon';
import InfoMessage from 'components/InfoMessage';
import AvailableCalendar from 'components/common/AvailableCalendar';
import {
  areAllSlotsBookedForDate,
  isTechnicianSlotSelectable,
  normalizeSlotSpacing,
  TechnicianDaySchedule,
  TechnicianSlot,
} from '../createRequest.types';
import { Radio } from 'components/common/Radio';
import { useTechnicianSchedule } from '../useTechnicianSchedule';
import { useApiMutation } from 'src/hooks/useApi';
import { formatToYYYYMMDD } from 'lib/utils/helper';
import { CalendarSlotSkeleton } from '../CalendarSlotSkeleton';

const RescheduleServiceRequestModal = ({
  templateCode,
  community,
  woNum,
  serviceRequestID,
  setIsRescheduled,
}: {
  templateCode: string;
  community: string;
  woNum: string;
  serviceRequestID: string | null;
  setIsRescheduled: (value: boolean) => void;
}) => {
  const { activeModal, closeModal, openModal } = useUIStore();

  const [technicianSchedule, setTechnicianSchedule] = useState<TechnicianDaySchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [slots, setSlots] = useState<TechnicianSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TechnicianSlot | null>(null);
  const [manualMode, setManualMode] = useState(false);

  const { apiError, availableDateKeys, isTechnicianScheduleLoading } = useTechnicianSchedule({
    templateCode,
    community,
    technicianSchedule,
    setTechnicianSchedule,
    selectedDate,
    setSlots,
    setSelectedSlot,
    manualMode,
    setManualMode,
  });

  const { mutate: createRescheduledRequest } = useApiMutation<any, any>(
    `Yardi/CreateUpdateScheduleRequest`,
    'POST',
    true
  );

  const handleRescheduleSubmitAction = () => {
    const reqBody = {
      SITEID: community,
      WONUM: woNum,
      DESCRIPTION: 'Your request for rescheduling has been registered for SR' + serviceRequestID,
      YARAPPDATE: formatToYYYYMMDD(selectedDate),
      SCHED_SLOT: selectedSlot?.Slot,
    };

    createRescheduledRequest(reqBody, {
      onSuccess: (response) => {
        if (response) {
          closeModal();
          openModal('create-service-success-modal');
          setIsRescheduled(true);
        }
      },
      onError: () => {
        closeModal();
        openModal('create-service-error-modal');
      },
    });
  };

  const isScheduleSelected = Boolean(selectedDate && selectedSlot?.Slot);

  return (
    <div
      className={`custom-modal py-5 lg:py-6 flex flex-col gap-5 lg:gap-6 ${
        activeModal === 'reschedule-service-request-modal' ? 'show' : ''
      }`}
    >
      <div className="relative bg-white-pure lg:w-[90%] max-w-4xl rounded-xl p-4 lg:p-8 h-full lg:h-auto overflow-scroll lg:overflow-auto">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col gap-2 lg:gap-3">
            <h3 className="flex gap-3 lg:gap-4 text-heading-3 font-normal items-center">
              <MaintenanceIcon className="size-7 lg:size-8 text-lilac-500" />
              Reschedule technician visit
            </h3>

            <p className="text-body font-light">
              Available technician slots are shown below. Please select a date and time to schedule
              the visit. Technicians may arrive at any time within the selected slot.
            </p>
            {apiError && (
              <InfoMessage IconComponent={CircleInfoIcon} status="warning">
                <p className="text-body">
                  Our technicians are currently fully booked. Kindly choose your preferred date and
                  time slot, and our facility management team will contact you to either confirm the
                  selected slot or assist in rescheduling the visit based on our technician’s
                  availability.
                </p>
              </InfoMessage>
            )}
          </div>

          <button onClick={closeModal} className="text-gray-500 cursor-pointer">
            <CrossIcon className="size-6 lg:size-7 text-lilac-500" />
          </button>
        </div>

        {/* Calendar + Slots */}
        {isTechnicianScheduleLoading ? (
          <CalendarSlotSkeleton version={1} />
        ) : (
          <div className="grid lg:grid-cols-2 lg:gap-6 my-5 lg:my-6">
            {/* Calendar */}
            <AvailableCalendar
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              availableDateKeys={availableDateKeys}
            />

            {/* Slots */}
            <div className="pt-4 lg:pl-10 lg:py-0 flex flex-col justify-center gap-2">
              {!selectedDate && (
                <p className="text-navy-400 text-body font-light">
                  Select your preferred date to view our available time slots.
                </p>
              )}
              {selectedDate && areAllSlotsBookedForDate(slots, selectedDate) && (
                <InfoMessage IconComponent={CircleInfoIcon} status="warning">
                  <p className="text-body">
                    All time slots for this date are fully booked. Please choose another date.
                  </p>
                </InfoMessage>
              )}
              {selectedDate &&
                slots.map((slot: TechnicianSlot) => {
                  const cleanSlot = normalizeSlotSpacing(slot.Slot);
                  const isSelectable = isTechnicianSlotSelectable(slot, selectedDate);

                  slot.Slot = cleanSlot;

                  return (
                    <Radio
                      id={cleanSlot}
                      name="technician-slot"
                      value={cleanSlot}
                      key={cleanSlot}
                      label={cleanSlot}
                      disabled={!isSelectable}
                      onChange={() => isSelectable && setSelectedSlot(slot)}
                      checked={selectedSlot?.Slot === cleanSlot}
                      className={`border border-lilac-400 flex-row-reverse w-full justify-between rounded-lg p-3 lg:p-4 text-left transition text-body
                    ${
                      !isSelectable
                        ? 'bg-silver-chalice-300 opacity-100 border-0 cursor-not-allowed'
                        : selectedSlot?.Slot === cleanSlot
                        ? 'bg-lilac-100'
                        : 'hover:bg-lilac-50'
                    }`}
                      inputClassName={`h-4! w-4! ${
                        !isSelectable ? 'appearance-none border rounded-full' : ''
                      }`}
                    />
                  );
                })}
            </div>
          </div>
        )}

        <div className="btn-wrapper flex justify-end">
          <button
            className={`btn btn-primary w-full lg:w-auto lg:min-w-68.75 h-11 lg:h-15  ${
              !isScheduleSelected ? 'disabled' : ''
            }`}
            onClick={handleRescheduleSubmitAction}
          >
            Reschedule Visit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleServiceRequestModal;
