import Tabs from 'src/common/Tabx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';
import DayView from './DayView';
import MonthView from './MonthView';
import { AmenityBookingDetails } from 'components/CreateBooking/AmenityBookingDetails/AmenityBookingDetails';
import Link from 'next/link';
import ArrowLeft from 'assets/icons/ArrowLeft';
import { Reservation } from './ViewBooking.types';
import { formatEventDate } from 'lib/utils/helper';
import CancelBookingModal from 'components/CreateBooking/BookAmenity/CancelBookingModal';
import CancelBookingSuccessModal from 'components/CreateBooking/BookAmenity/CancelBookingSuccessModal';
import { useSearchParams } from 'next/navigation';

export default function ViewBooking({ fields }: any) {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedDateForDayView, setSelectedDateForDayView] = useState<Date | null>(null);
  const [isViewingBookingDetails, setIsViewingBookingDetails] = useState(false);
  const [isBookingCancelled, setIsBookingCancelled] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const { tCode } = useUserStore();
  const { mutate: fetchReservations } = useApiMutation<any, any>(
    `/Amenities/${tCode}/Reservations`,
    'GET',
    true
  );

  const getReservationStatus = useCallback((status: string | number, start_time: string) => {
    const parsedStatus = Number(status);
    const startTime = new Date(start_time);
    const currentTime = new Date();

    if (parsedStatus === 0) return '';
    if (parsedStatus > 8) return 'Cancelled';
    if (startTime > currentTime) return 'Upcoming';

    return 'Previous';
  }, []);

  useEffect(() => {
    if (!tCode) return;

    fetchReservations(null, {
      onSuccess: (response) => {
        setReservations(response?.Data?.Results || []);
        if (bookingId) {
          response?.Data?.Results?.forEach((reservation: any) => {
            if (reservation.reservation_id === bookingId) {
              setSelectedReservation(reservation);
              setIsViewingBookingDetails(true);
            }
          });
        }
      },
    });
  }, [tCode, bookingId]);

  useEffect(() => {
    if (selectedDateForDayView) {
      setActiveTab(2);
    }
  }, [selectedDateForDayView]);

  const addCalendarEventDetails = useMemo(() => {
    const duration = formatEventDate(
      selectedReservation?.start_time?.split('T')[0] as string,
      `${selectedReservation?.start_time.slice(11, 13)}:00 - ${String(
        Number(selectedReservation?.start_time.slice(11, 13)) + 1
      ).padStart(2, '0')}:00`
    );
    const description = `<b>Booking Details:</b>\n\n<b>Facility:</b> ${selectedReservation?.name}\n<b>Location:</b> <a href="${selectedReservation?.resource_properties?.MapUrl}">${selectedReservation?.resource_properties?.MapUrl}</a>\n<b>Duration:</b> ${duration}\n<b>Booking Reference:</b> ${selectedReservation?.reservation_id}`;

    return {
      title: `${selectedReservation?.resource_properties?.Type} at ${selectedReservation?.name}`,
      description: description,
    };
  }, [selectedReservation]);

  return (
    <section className="ViewBooking bg-silver-chalice-50">
      {isViewingBookingDetails && selectedReservation ? (
        <div className="container-sm py-5 md:py-6 flex flex-col gap-5 md:gap-6">
          <Link
            href={`${bookingId ? '/community?activeTab=BookAmenities' : '/view-booking'}`}
            className="text-body-sm font-medium flex gap-2 text-navy-500 uppercase items-center"
            onClick={() => {
              setIsViewingBookingDetails(false);
              setSelectedReservation(null);
            }}
          >
            <ArrowLeft className="size-5 md:size-7" />
            Back
          </Link>
          <AmenityBookingDetails
            fields={fields}
            step={3}
            bookingData={{ Reservation_Id: selectedReservation?.reservation_id }}
            isBookingCancelled={isBookingCancelled}
            selectedAmenity={{ Type: selectedReservation?.resource_properties?.Type }}
            selectedLocationData={{
              Name: selectedReservation?.name,
              MapUrl: selectedReservation?.resource_properties?.MapUrl,
            }}
            selectedDate={selectedReservation?.start_time?.split('T')[0] as any}
            selectedTime={`${selectedReservation?.start_time.slice(11, 13)}:00 - ${String(
              Number(selectedReservation?.start_time.slice(11, 13)) + 1
            ).padStart(2, '0')}:00`}
            addCalendarEventDetails={addCalendarEventDetails}
            bookingStatus={getReservationStatus(
              selectedReservation.status,
              selectedReservation.start_time
            )}
            bannerImage={
              selectedReservation.resource_photos?.find((img) => img.title === 'portal-new')?.path
            }
          />
          <CancelBookingModal
            reservationId={selectedReservation?.reservation_id}
            setIsBookingCancelled={setIsBookingCancelled}
          />
          <CancelBookingSuccessModal />
        </div>
      ) : (
        <Tabs
          tabs={[
            {
              id: 1,
              label: 'MONTH VIEW',
              content: (
                <MonthView
                  fields={fields}
                  reservations={reservations}
                  setSelectedDateForDayView={setSelectedDateForDayView}
                  getReservationStatus={getReservationStatus}
                  selectedReservation={selectedReservation}
                  setSelectedReservation={setSelectedReservation}
                  setIsViewingBookingDetails={setIsViewingBookingDetails}
                />
              ),
            },
            {
              id: 2,
              label: 'DAY VIEW',
              content: (
                <DayView
                  fields={fields}
                  reservations={reservations}
                  date={selectedDateForDayView}
                  getReservationStatus={getReservationStatus}
                  selectedReservation={selectedReservation}
                  setSelectedReservation={setSelectedReservation}
                  setIsViewingBookingDetails={setIsViewingBookingDetails}
                />
              ),
            },
          ]}
          activeTabId={activeTab}
          onTabChange={(id) => {
            if (id === 1) {
              setSelectedDateForDayView(null);
            }
            setActiveTab(id as number);
            setSelectedReservation(null);
          }}
        />
      )}
    </section>
  );
}
