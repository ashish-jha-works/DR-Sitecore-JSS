'use client';

import { useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import ReservationDetailsCard from './ReservationDetailsCard';
import ChevronLeft from 'assets/icons/ChevronLeft';
import ChevronRight from 'assets/icons/ChevronRight';
import { CalendarCellData, MonthViewProps, Reservation } from './ViewBooking.types';
import { CustomLink, CustomRichText, Text } from 'src/common/SitecoreOverrides';
import ArrowLeft from 'assets/icons/ArrowLeft';
import CalendarIcon from 'assets/icons/CalendarIcon';
import Legends from './Legends';
import CirclePlusIcon from 'assets/icons/CirclePlusIcon';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

const isWithinNext3Days = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const check = new Date(date);
  check.setHours(0, 0, 0, 0);

  const diff = (check.getTime() - today.getTime()) / (1000 * 3600 * 24);
  return diff >= 0 && diff <= 2;
};

export default function MonthView({
  fields,
  reservations,
  setSelectedDateForDayView,
  getReservationStatus,
  selectedReservation,
  setSelectedReservation,
  setIsViewingBookingDetails,
}: MonthViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cardPosition, setCardPosition] = useState<'left' | 'right'>('right');
  const [activeCellIndex, setActiveCellIndex] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startDayIndex = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const allowedMonths = useMemo(() => {
    const today = new Date();
    const months = new Set<string>();

    for (let i = 0; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      months.add(`${d.getFullYear()}-${d.getMonth()}`);
    }

    return months;
  }, []);

  const canGoPrev = allowedMonths.has(`${year}-${month - 1}`);
  const canGoNext = allowedMonths.has(`${year}-${month + 1}`);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleBookingHarnessClick = useCallback(
    (event: React.MouseEvent, reservation: Reservation, cellIndex: number) => {
      if (window.innerWidth <= 1200) return;

      const clickX = event.pageX;
      const spaceRight = window.innerWidth - clickX;

      setCardPosition(spaceRight < 550 ? 'left' : 'right');
      setSelectedReservation(reservation);
      setActiveCellIndex(cellIndex);
    },
    [setSelectedReservation]
  );

  // Group reservations by date
  const reservationsByDate = useMemo(() => {
    const map: Record<string, Reservation[]> = {};

    reservations.forEach((res) => {
      const key = formatDateKey(new Date(res.start_time));

      if (!map[key]) map[key] = [];
      map[key].push(res);
    });

    return map;
  }, [reservations]);

  // Generate calendar cells
  const calendarCells: CalendarCellData[] = useMemo(() => {
    const cells: CalendarCellData[] = [];

    for (let i = 0; i < 42; i++) {
      let dayNumber;
      let isCurrentMonth = true;
      let cellDate: Date;

      if (i < startDayIndex) {
        dayNumber = prevMonthLastDay - startDayIndex + i + 1;
        isCurrentMonth = false;
        cellDate = new Date(year, month - 1, dayNumber);
      } else if (i >= startDayIndex + daysInMonth) {
        dayNumber = i - (startDayIndex + daysInMonth) + 1;
        isCurrentMonth = false;
        cellDate = new Date(year, month + 1, dayNumber);
      } else {
        dayNumber = i - startDayIndex + 1;
        cellDate = new Date(year, month, dayNumber);
      }

      const dateKey = formatDateKey(cellDate);

      cells.push({
        index: i,
        date: cellDate,
        dateKey,
        dayNumber,
        isCurrentMonth,
        reservations: reservationsByDate[dateKey] || [],
      });
    }

    return cells;
  }, [year, month, startDayIndex, daysInMonth, prevMonthLastDay, reservationsByDate]);

  return (
    <div className="MonthView container-sm">
      <CustomLink
        field={fields.backCTA}
        className="flex items-center gap-2 text-body-sm font-medium text-navy-500 mb-6"
      >
        <ArrowLeft width={28} height={28} />
        {fields?.backCTA?.value?.text}
      </CustomLink>

      <div className="p-4 md:p-8 rounded-xl bg-white-pure border border-solid border-lilac-300">
        <div className="flex items-center gap-2 md:gap-3">
          {fields?.icon?.value ? (
            <CustomRichText field={fields.icon} />
          ) : (
            <CalendarIcon className="text-lilac-500 shrink-0" width={28} height={28} />
          )}
          <Text
            tag="h3"
            field={fields?.title}
            className="text-heading-3 font-normal text-navy-500"
          />
        </div>
        <Text
          tag="p"
          field={fields?.description}
          className="mt-1 text-body font-light text-navy-500"
        />
        <div className="mt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-heading-3 font-normal text-navy-500">
              <span className="font-medium">{monthName}</span> {year}
            </h2>

            <div className="flex gap-4">
              <button
                className={`text-lilac-500 ${
                  !canGoPrev ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={handlePrevMonth}
                disabled={!canGoPrev}
              >
                <ChevronLeft />
              </button>

              <button
                className={`text-lilac-500 ${
                  !canGoNext ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={handleNextMonth}
                disabled={!canGoNext}
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* Week Header */}
          <div className="grid grid-cols-7">
            {WEEK_DAYS.map((day) => (
              <div
                key={day}
                className="text-body-sm py-1 text-center font-light text-silver-chalice-700 border-l border-b border-lilac-300 first:border-l-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarCells.map((cell) => {
              const firstReservation = cell.reservations[0];

              const reservationStatus = firstReservation
                ? getReservationStatus(firstReservation.status, firstReservation.start_time)
                : '';

              const statusClass =
                {
                  Cancelled: 'bg-danger-50 text-color-error',
                  Upcoming: 'bg-success-50 text-color-success',
                  Previous: 'bg-lilac-100 text-navy-500',
                  '': '',
                }[reservationStatus] ?? '';

              return (
                <div
                  key={cell.index}
                  className={`flex flex-col items-center gap-2 min-h-17 lg:min-h-20 p-1 justify-between bg-white-pure
                                    ${cell.index % 7 !== 0 && 'border-l'}
                                    ${cell.index < 35 && 'border-b'}
                                    border-lilac-300 relative
                                    ${
                                      cell.isCurrentMonth
                                        ? 'text-navy-500'
                                        : 'text-silver-chalice-700'
                                    }`}
                >
                  <span className="text-body-xs">{cell.dayNumber}</span>

                  <div className="w-full flex flex-col gap-1">
                    {/* Single Reservation */}
                    {cell.reservations.length === 1 && (
                      <div
                        className={`hidden lg:block event-harness text-body-sm truncate p-1 cursor-pointer rounded-sm ${statusClass}`}
                        onClick={(e) => handleBookingHarnessClick(e, firstReservation, cell.index)}
                      >
                        {firstReservation.name}
                      </div>
                    )}

                    {/* Multiple Reservations */}
                    {cell.reservations.length > 1 && (
                      <>
                        <div
                          className={`hidden lg:block event-harness text-body-sm truncate p-1 cursor-pointer rounded-sm ${statusClass}`}
                          onClick={(e) =>
                            handleBookingHarnessClick(e, firstReservation, cell.index)
                          }
                        >
                          {firstReservation.name}
                        </div>

                        <div
                          className="hidden lg:block text-body-sm underline text-sky-700 uppercase font-bold cursor-pointer text-center"
                          onClick={() => setSelectedDateForDayView(cell?.date)}
                        >
                          View all
                        </div>
                      </>
                    )}
                    {cell.reservations.length > 0 ? (
                      <button
                        className="lg:hidden text-lilac-500 cursor-pointer flex justify-center"
                        onClick={() => setSelectedDateForDayView(cell?.date)}
                      >
                        <ChevronRight />
                      </button>
                    ) : null}

                    {/* Add Booking */}
                    {cell.reservations.length === 0 && isWithinNext3Days(cell.date) && (
                      <>
                        <Link
                          href="/booking-amenities/create-booking"
                          target="_blank"
                          className="hidden lg:block text-body-sm underline text-sky-700 uppercase font-bold text-center justify-center"
                        >
                          Add Booking
                        </Link>
                        <Link
                          href="/booking-amenities/create-booking"
                          target="_blank"
                          className="lg:hidden text-lilac-500 cursor-pointer flex justify-center"
                        >
                          <CirclePlusIcon />
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Reservation Preview */}
                  {selectedReservation &&
                    formatDateKey(new Date(selectedReservation.start_time)) === cell.dateKey &&
                    activeCellIndex === cell.index && (
                      <ReservationDetailsCard
                        reservation={selectedReservation}
                        position={cardPosition}
                        reservationStatus={reservationStatus}
                        onClose={() => {
                          setSelectedReservation(null);
                          setActiveCellIndex(null);
                        }}
                        handleViewBookingClick={() => setIsViewingBookingDetails(true)}
                      />
                    )}
                </div>
              );
            })}
          </div>

          {/* Overlay */}
          {selectedReservation && (
            <div
              className="hidden lg:block fixed inset-0 bg-black/40 z-40"
              onClick={() => {
                setSelectedReservation(null);
                setActiveCellIndex(null);
              }}
            />
          )}
        </div>
        <Legends />
      </div>
    </div>
  );
}
