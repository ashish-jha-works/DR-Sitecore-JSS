import CrossIcon from 'assets/icons/CrossIcon';
import Image from 'next/image';
import { useMemo, MouseEvent } from 'react';
import { ReservationDetailsCardProps } from './ViewBooking.types';
import { RESERVATION_STATUS_STYLES } from 'lib/common/constants/common';

export default function ReservationDetailsCard({
  reservation,
  position,
  onClose,
  reservationStatus,
  isMobileView = false,
  handleViewBookingClick,
}: ReservationDetailsCardProps) {
  const photo = useMemo(
    () => reservation.resource_photos?.find((img) => img.title === 'portal')?.path,
    [reservation.resource_photos]
  );

  const handleClose = (e: MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const formatOneHourReservation = (startTimeStr: string): string => {
    const [datePart, timePart] = startTimeStr.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);

    const start = new Date(year, month - 1, day, hour, minute);
    const end = new Date(year, month - 1, day, hour + 1, minute); // add 1 hour

    // Day of the week
    const dayName = start.toLocaleDateString('en-US', { weekday: 'long' });

    // Date as DD-MM-YYYY
    const dateStr = start.toLocaleDateString('en-GB').replace(/\//g, '-');

    // Time strings HH:mm
    const startStr = start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const endStr = end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    return `${dayName}, ${dateStr} ${startStr}-${endStr} (1 hour)`;
  };

  const statusClass = RESERVATION_STATUS_STYLES[reservationStatus] ?? '';

  return (
    <div
      className={` ${
        !isMobileView
          ? `calendar-card absolute top-1/2 -translate-y-1/2 bg-white-pure min-h-116 w-86 z-100 shadow-md
        before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:z-[-1] before:w-3.5 before:h-3.5 before:rotate-45 before:bg-white-pure
        ${
          position === 'right'
            ? 'left-full ml-3 before:left-[-7px]'
            : 'right-full mr-3 before:right-[-7px]'
        }`
          : 'w-full h-full border border-lilac-300 mt-5 lg:hidden'
      } rounded-2xl`}
    >
      {photo && (
        <Image
          src={photo}
          alt="amenity-image"
          width={344}
          height={148}
          className="h-37 w-full object-cover rounded-t-2xl"
        />
      )}

      <div
        className="hidden lg:flex absolute bg-white-pure border border-lilac-300 h-11 items-center justify-center right-5 top-5 rounded-lg w-11 cursor-pointer"
        onClick={handleClose}
      >
        <CrossIcon className="text-lilac-500" />
      </div>

      <div className="px-6 pt-12 pb-6 lg:py-5">
        <div className="border-b border-lilac-300 flex flex-col gap-1 pb-2 w-full">
          <span
            className={`text-body-sm px-4 py-2 inline max-w-min rounded-full border-solid ${statusClass}`}
          >
            {reservationStatus}
          </span>

          <p>{reservation.resource_properties?.Type ?? 'N/A'}</p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <h5 className="text-body font-medium">Booking Details</h5>

          <div className="flex flex-col gap-1">
            <h4 className="text-body-sm font-medium">Facility</h4>
            <p className="text-body-sm font-light">{reservation.name}</p>
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="text-body-sm font-medium">Duration</h4>
            <p className="text-body-sm font-light">
              {formatOneHourReservation(reservation.start_time)}
            </p>
          </div>

          <button
            className="btn btn-primary w-full h-11 uppercase mt-5"
            onClick={handleViewBookingClick}
          >
            View Booking
          </button>
        </div>
      </div>
    </div>
  );
}
