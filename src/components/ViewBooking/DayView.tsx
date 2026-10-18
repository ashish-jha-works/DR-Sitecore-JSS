import { useCallback, useMemo, useRef, useState } from 'react';
import ArrowLeft from 'assets/icons/ArrowLeft';
import Legends from './Legends';
import { CustomLink } from 'src/common/SitecoreOverrides';
import { DayViewProps, Reservation } from './ViewBooking.types';
import ReservationDetailsCard from './ReservationDetailsCard';
import { RESERVATION_STATUS_STYLES } from 'lib/common/constants/common';
import { getOrdinalSuffix } from 'lib/utils/helper';

export default function DayView({
  fields,
  reservations,
  date,
  getReservationStatus,
  selectedReservation,
  setSelectedReservation,
  setIsViewingBookingDetails,
}: DayViewProps) {
  const today = useMemo(() => date ?? new Date(), [date]);

  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const mobileCardRef = useRef<HTMLDivElement | null>(null);

  const weekday = today.toLocaleDateString('en-GB', { weekday: 'long' });
  const day = today.getDate();
  const month = today.toLocaleDateString('en-GB', { month: 'long' });
  const year = today.getFullYear();
  const formattedDate = `${weekday}, ${day}${getOrdinalSuffix(day)} ${month} ${year}`;

  // Generate hourly slots from 6:00 to 22:00
  const timeSlots = useMemo(() => {
    const slots: { start: number; end: number; label: string }[] = [];

    for (let hour = 6; hour < 22; hour++) {
      slots.push({
        start: hour,
        end: hour + 1,
        label: `${hour}:00-${hour + 1}:00`,
      });
    }

    return slots;
  }, []);

  // Map reservations to hour slots for the given day
  const reservationsBySlot = useMemo(() => {
    const map: Record<number, Reservation[]> = {};

    reservations.forEach((res: Reservation) => {
      const start = new Date(res.start_time);
      const end = new Date(res.end_time);

      if (
        start.toDateString() === today.toDateString() ||
        end.toDateString() === today.toDateString()
      ) {
        let slotHour = start.getHours();
        const lastHour = end.getHours();

        while (slotHour <= lastHour) {
          if (!map[slotHour]) map[slotHour] = [];
          map[slotHour].push(res);
          slotHour++;
        }
      }
    });

    return map;
  }, [reservations, today]);

  const handleBookingHarnessClick = useCallback(
    (reservation: Reservation, slot: number) => {
      if (window.innerWidth <= 1200) {
        setIsMobileView(true);
        setTimeout(() => {
          mobileCardRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }

      setSelectedReservation(reservation);
      setActiveSlot(slot);
    },
    [setSelectedReservation]
  );

  const closePopup = () => {
    setSelectedReservation(null);
    setActiveSlot(null);
  };

  return (
    <div className="MonthView container-sm">
      <CustomLink
        field={fields.backCTA}
        className="flex items-center gap-2 text-body-sm font-medium text-navy-500 mb-6"
      >
        <ArrowLeft width={28} height={28} />
        {fields?.backCTA?.value?.text}
      </CustomLink>

      <div className="p-4 md:p-8 rounded-xl bg-white-pure border border-lilac-300">
        <h3 className="text-heading-3 font-normal text-navy-500 mb-6">{formattedDate}</h3>

        {/* Day Calendar */}
        <div className="rounded-xl border border-lilac-300 overflow-visible">
          <ul>
            {timeSlots.map((slot) => (
              <li key={slot.start} className={`${slot.start !== 6 && 'border-t'} border-lilac-300`}>
                <div className="flex">
                  {/* Time Column */}
                  <div className="shrink-0 w-30 bg-lilac-100 p-2 text-body text-navy-500 text-center border-r border-lilac-300">
                    {slot.label}
                  </div>

                  {/* Booking Harness Block */}
                  <div className="flex flex-col grow text-body-sm font-medium relative">
                    {reservationsBySlot[slot.start]?.map((res) => {
                      const status = getReservationStatus(res.status, res.start_time);
                      const statusClass =
                        RESERVATION_STATUS_STYLES[status] ?? 'bg-lilac-100 text-navy-500';
                      const hasMultipleBookings = (reservationsBySlot[slot.start]?.length || 0) > 1;

                      return (
                        <div
                          key={`${slot.start}-${res.reservation_id}`}
                          className="relative h-full"
                        >
                          <div
                            className={`w-full h-full px-4 flex items-center event-harness cursor-pointer ${
                              hasMultipleBookings ? '' : 'py-2'
                            } ${statusClass} border-none`}
                            onClick={() => handleBookingHarnessClick(res, slot.start)}
                          >
                            {res.name}
                          </div>

                          {/* Reservation Details Popup */}
                          {selectedReservation &&
                            !isMobileView &&
                            activeSlot === slot.start &&
                            selectedReservation.reservation_id === res.reservation_id && (
                              <ReservationDetailsCard
                                reservation={selectedReservation}
                                position="left"
                                reservationStatus={getReservationStatus(
                                  selectedReservation.status,
                                  selectedReservation.start_time
                                )}
                                onClose={closePopup}
                                handleViewBookingClick={() => setIsViewingBookingDetails(true)}
                              />
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Overlay */}
          {selectedReservation && !isMobileView && (
            <div className="hidden lg:block fixed inset-0 bg-black/30 z-40" onClick={closePopup} />
          )}
        </div>

        <Legends />
      </div>

      {/* Reservation Details Mobile */}
      {selectedReservation &&
        // activeSlot === slot.start &&
        isMobileView && (
          <div ref={mobileCardRef} className="lg:hidden mt-6">
            <ReservationDetailsCard
              reservation={selectedReservation}
              position="left"
              reservationStatus={getReservationStatus(
                selectedReservation.status,
                selectedReservation.start_time
              )}
              onClose={closePopup}
              isMobileView={true}
              handleViewBookingClick={() => setIsViewingBookingDetails(true)}
            />
          </div>
        )}
    </div>
  );
}
