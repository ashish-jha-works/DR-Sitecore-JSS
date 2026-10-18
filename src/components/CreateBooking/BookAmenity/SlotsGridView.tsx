import React from 'react';

interface TimeSlot {
  time: string;
  status: string;
}

interface CalendarDate {
  date: string;
  monthName: string;
  year: number;
  timeSlots: TimeSlot[];
}

interface SlotsGridViewProps {
  calendarDates: CalendarDate[];
  baseSlotsOfDay: TimeSlot[];
  isBookingSlot: (day: CalendarDate, slot: TimeSlot) => boolean;
  handleSelectSlotFromCalendarGrid: (dateIndex: number, slotIndex: number) => void;
}

export const SlotsGridView: React.FC<SlotsGridViewProps> = ({
  calendarDates,
  baseSlotsOfDay,
  isBookingSlot,
  handleSelectSlotFromCalendarGrid,
}) => {
  if (!calendarDates || !calendarDates.length) return null;

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {/* Header & Legends */}
      <div className="flex justify-between flex-col lg:flex-row gap-2">
        <h3 className="text-body font-medium">
          {`${calendarDates[0].monthName.slice(0, 3)} ${calendarDates[0].date.slice(-1)}, ${
            calendarDates[0].year
          }`}{' '}
          -{' '}
          {`${calendarDates[2].monthName.slice(0, 3)} ${calendarDates[2].date.slice(-1)}, ${
            calendarDates[2].year
          }`}
        </h3>
        <div className="flex flex-row lg:gap-6 font-light justify-between">
          <div className="flex gap-2 lg:gap-3">
            <div className="size-5 lg:size-6 rounded-sm border bg-white-pure text-body"></div>{' '}
            Available
          </div>
          <div className="flex gap-2 lg:gap-3">
            <div className="size-5 lg:size-6 rounded-sm bg-lilac-hover"></div> Your Booking
          </div>
          <div className="flex gap-2 lg:gap-3">
            <div className="size-5 lg:size-6 rounded-sm bg-silver-chalice-300"></div> Taken
          </div>
        </div>
      </div>

      {/* Desktop Slots */}
      <div className="hidden lg:block slots-grid-view-desktop">
        <div className="flex">
          <div className="w-18 h-12 border border-lilac-200 border-t-0 border-l-0"></div>
          {baseSlotsOfDay.map((slot, index) => (
            <div
              key={slot.time}
              className={`w-18 h-12 flex justify-center items-center border border-lilac-200 border-t-0 border-l-0 text-body-sm font-light text-center ${
                index === baseSlotsOfDay.length - 1 ? 'border-r-0' : ''
              }`}
            >
              {slot.time}
            </div>
          ))}
        </div>
        {calendarDates.map((item, index) => (
          <div className="flex" key={item.date + index}>
            <div
              className={`w-18 h-10 flex justify-center items-center border border-lilac-200 border-t-0 border-l-0 bg-lilac-100 font-light text-sm lg:text-body ${
                index === calendarDates.length - 1 ? 'border-b-0 rounded-bl-lg' : ''
              }`}
            >
              {item.date}
            </div>
            {item.timeSlots.map((slot, timeSlotIndex) => (
              <div
                key={slot.time}
                className={`w-18 h-10 border border-lilac-200 border-t-0 border-l-0 text-body-sm font-light text-center ${
                  slot.status === 'taken'
                    ? 'bg-silver-chalice-300'
                    : isBookingSlot(item, slot)
                    ? 'bg-lilac-hover'
                    : 'cursor-pointer'
                } ${index === calendarDates.length - 1 ? 'border-b-0' : ''} ${
                  timeSlotIndex === item.timeSlots.length - 1 ? 'border-r-0' : ''
                }`}
                onClick={() => handleSelectSlotFromCalendarGrid(index, timeSlotIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile Slots */}
      <div className="lg:hidden grid grid-cols-3 rounded-xl overflow-hidden border-lilac-300">
        {calendarDates.map((dayObj, index) => (
          <div key={index} className="border-lilac-300 last:border-r-0">
            {/* Header */}
            <div
              className={`bg-lilac-100 text-center text-sm font-light py-1 ${
                index !== calendarDates.length - 1 ? 'border-r border-lilac-300' : ''
              }`}
            >
              {dayObj.date}
            </div>
            {/* Time Slots */}
            {dayObj.timeSlots.map((slot, timeSlotIndex) => (
              <div
                key={timeSlotIndex}
                className={`py-2 text-center text-sm font-light border-lilac-300 cursor-pointer ${
                  slot.status === 'taken'
                    ? 'bg-silver-chalice-300'
                    : isBookingSlot(dayObj, slot)
                    ? 'bg-lilac-hover'
                    : ''
                } ${
                  index === 0
                    ? 'border-l-0 border-r'
                    : index === calendarDates.length - 1
                    ? 'border-r-0'
                    : 'border-r'
                } ${timeSlotIndex !== 0 ? 'border-t' : ''}`}
                onClick={() => handleSelectSlotFromCalendarGrid(index, timeSlotIndex)}
              >
                {slot.time}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
