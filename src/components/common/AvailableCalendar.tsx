import React, { useCallback, useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import { addMonths, format, startOfMonth } from 'date-fns';

import ChevronLeft from 'assets/icons/ChevronLeft';

import 'react-day-picker/dist/style.css';

type AvailableCalendarProps = {
  selectedDate?: Date;
  onSelect?: (date: Date | undefined) => void;
  availableDateKeys?: Set<string>;
  isDateDisabled?: (date: Date) => boolean;
  className?: string;
};

const AvailableCalendar: React.FC<AvailableCalendarProps> = ({
  selectedDate,
  onSelect,
  availableDateKeys,
  isDateDisabled,
  className = '',
}) => {
  const toKey = useCallback((date: Date) => format(date, 'yyyy-MM-dd'), []);

  // Allow navigating only to previous month, current month, and next month
  const { startMonth, endMonth } = useMemo(() => {
    const today = new Date();
    return {
      startMonth: startOfMonth(addMonths(today, -1)),
      endMonth: startOfMonth(addMonths(today, 1)),
    };
  }, []);

  return (
    <div
      className={`border border-lilac-200 rounded-xl p-4 lg:p-5 w-full lg:w-105 min-h-72 lg:h-fit lg:min-h-95 ${className}`}
    >
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        startMonth={startMonth}
        endMonth={endMonth}
        disabled={
          isDateDisabled
            ? isDateDisabled
            : availableDateKeys
            ? (date) => !availableDateKeys.has(toKey(date))
            : undefined
        }
        showOutsideDays
        className="custom-day-picker"
        classNames={{
          months: 'rdp-months w-full max-w-full!',
          month: 'rdp-month w-full',
        }}
        formatters={{
          formatWeekdayName: (date) =>
            (
              <span className="font-light text-silver-chalice-700 text-body-sm">
                {format(date, 'EEE')}
              </span>
            ) as any,
          formatCaption: (date) =>
            (
              <span>
                <span className="font-medium">{format(date, 'MMM')}</span>{' '}
                <span className="font-light">{format(date, 'yyyy')}</span>
              </span>
            ) as any,
        }}
        components={{
          Chevron: ({ orientation }) =>
            orientation === 'left' ? (
              <ChevronLeft className="w-5 h-5 text-lilac-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-lilac-500 rotate-180" />
            ),
        }}
      />
    </div>
  );
};

export default AvailableCalendar;
