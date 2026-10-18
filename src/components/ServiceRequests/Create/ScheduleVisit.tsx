import React from 'react';
import CircleInfoIcon from 'assets/icons/CircleInfoIcon';
import MaintenanceIcon from 'assets/icons/MaintenanceIcon';
import { Radio } from 'components/common/Radio';
import InfoMessage from 'components/InfoMessage';

import {
  areAllSlotsBookedForDate,
  isTechnicianSlotSelectable,
  normalizeSlotSpacing,
  TechnicianSlot,
} from './createRequest.types';

import 'react-day-picker/dist/style.css';
import AvailableCalendar from 'components/common/AvailableCalendar';
import { useTechnicianSchedule } from './useTechnicianSchedule';
import { CalendarSlotSkeleton } from './CalendarSlotSkeleton';

const ScheduleVisit: React.FC<any> = ({
  templateCode,
  community,
  technicianSchedule,
  setTechnicianSchedule,
  selectedDate,
  setSelectedDate,
  slots,
  setSlots,
  selectedSlot,
  setSelectedSlot,
  manualMode,
  setManualMode,
}) => {
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

  return (
    <div className="container-sm py-5 lg:py-6 flex flex-col gap-5 lg:gap-6">
      <div className="bg-white-pure border border-lilac-300 rounded-xl p-5 lg:p-6 flex flex-col gap-4 lg:gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2 lg:gap-3">
          <h3 className="flex gap-3 lg:gap-4 text-heading-3 font-normal items-center">
            <MaintenanceIcon className="size-7 lg:size-8 text-lilac-500" />
            Schedule technician visit
          </h3>

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

        {/* Calendar + Slots */}
        {isTechnicianScheduleLoading ? (
          <CalendarSlotSkeleton />
        ) : (
          <div className="grid lg:grid-cols-2 lg:gap-6">
            {/* Calendar */}
            <AvailableCalendar
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              availableDateKeys={availableDateKeys}
            />

            {/* Slots */}
            <div className="pt-4 lg:px-4 lg:py-0 flex flex-col justify-center gap-2">
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
      </div>
    </div>
  );
};

export default ScheduleVisit;
