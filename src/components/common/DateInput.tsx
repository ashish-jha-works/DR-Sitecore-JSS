import { addMonths, format, startOfMonth } from 'date-fns';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';

import CalendarIcon from 'assets/icons/CalendarIcon';
import ChevronLeft from 'assets/icons/ChevronLeft';

type DateInputProps = {
  selectedDate?: Date | null;
  onSelect: (date: Date | null) => void;
  availableDateKeys?: Set<string>;
  disabled?: boolean;
  label?: string;
  className?: string;
  disableBefore?: Date;
  disableAfter?: Date;
  enablePlaceHolder?: boolean;
  placeholder?: string;
};

const ESTIMATED_CALENDAR_HEIGHT = 340;

export default function DateInput({
  selectedDate = null,
  onSelect,
  availableDateKeys,
  disabled = false,
  label = 'Select date',
  className = '',
  disableBefore,
  disableAfter,
  enablePlaceHolder,
  placeholder = 'MM/DD/YYYY',
}: DateInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  /* Helpers */

  const toKey = useCallback((date: Date) => format(date, 'yyyy-MM-dd'), []);

  // Allow navigating only to previous month, current month, and next month
  const { startMonth, endMonth } = useMemo(() => {
    const today = new Date();
    return {
      startMonth: startOfMonth(addMonths(today, -1)),
      endMonth: startOfMonth(addMonths(today, 1)),
    };
  }, []);

  const isDateDisabled = useMemo(() => {
    if (!availableDateKeys && !disableBefore && !disableAfter) return undefined;

    return (date: Date) => {
      if (disableBefore && date < disableBefore) return true;
      if (disableAfter && date > disableAfter) return true;

      if (availableDateKeys) {
        return !availableDateKeys.has(toKey(date));
      }

      return false;
    };
  }, [availableDateKeys, disableBefore, disableAfter, toKey]);

  const formattedValue = useMemo(() => {
    return selectedDate ? format(selectedDate, 'MM/dd/yyyy') : '';
  }, [selectedDate]);

  const isActive = !!selectedDate || isOpen;

  /* Handlers                           */

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      onSelect(date ?? null);
      setIsOpen(false);
    },
    [onSelect]
  );

  const toggleCalendar = useCallback(() => {
    if (!disabled) setIsOpen((prev) => !prev);
  }, [disabled]);

  /* Flip calendar up when not enough space below */
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePlacement = () => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const calendarHeight = calendarRef.current?.offsetHeight || ESTIMATED_CALENDAR_HEIGHT;
      const gap = 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setOpenUpward(spaceBelow < calendarHeight + gap && spaceAbove > spaceBelow);
    };

    updatePlacement();
    window.addEventListener('resize', updatePlacement);
    window.addEventListener('scroll', updatePlacement, true);

    return () => {
      window.removeEventListener('resize', updatePlacement);
      window.removeEventListener('scroll', updatePlacement, true);
    };
  }, [isOpen]);

  /* Close on outside click             */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={wrapperRef}>
      {/* Label */}
      <label
        htmlFor="date-input"
        className={`block text-body font-light mb-2 ${disabled ? 'text-muted text-body!' : ''}`}
      >
        {label}
      </label>

      {/* Input + calendar anchored to the field */}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={toggleCalendar}
          disabled={disabled}
          className={`flex w-full rounded-xl px-4 py-2.5 items-center transition-colors h-12
          ${isActive ? 'border-navy-500' : 'border-lilac-500'} ${
            disabled
              ? 'bg-disabled border-disabled text-secondary cursor-not-allowed opacity-70'
              : 'bg-white-pure border glow'
          }
        `}
        >
          <input
            id="date-input"
            readOnly
            value={formattedValue}
            placeholder={enablePlaceHolder ? placeholder : ''}
            className={`flex-1 outline-none text-body font-light bg-transparent ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          />

          <CalendarIcon
            className={`w-5 h-5 transition-colors ${isActive ? 'text-navy-500' : 'text-lilac-500'}`}
          />
        </button>

        {/* Calendar */}
        {isOpen && (
          <div
            ref={calendarRef}
            className={`absolute left-0 z-50 bg-white-pure shadow-lg w-full md:w-90 rounded-lg p-3 ${
              openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            <DayPicker
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={handleSelect}
              startMonth={startMonth}
              endMonth={endMonth}
              disabled={isDateDisabled}
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
        )}
      </div>
    </div>
  );
}
