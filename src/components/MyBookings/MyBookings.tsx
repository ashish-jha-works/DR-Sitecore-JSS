import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { CustomImage, CustomLink, CustomRichText, Text } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';

import ArrowRightIcon from 'assets/icons/ArrowRightIcon';
import { RESERVATION_STATUS_STYLES } from 'lib/common/constants/common';

interface MyBookingsProps {
  fields: {
    title: any;
    description: any;
    icon: any;
    viewCalendarCTA: any;
    viewCalendarCTAIcon: any;
    emptyStateImage: any;
    emptyStateText: any;
    applyMargin: any;
  };
}

const MyBookings = ({ fields }: MyBookingsProps) => {
  const { tCode } = useUserStore();
  const [reservations, setReservations] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
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
        const apiReservations = response?.Data?.Results || [];
        const sorted = apiReservations.sort((a: any, b: any) => {
          return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
        });
        setReservations(sorted);
        setHasLoaded(true);
      },
      onError: () => {
        setHasLoaded(true);
      },
    });
  }, [tCode]);

  const formatOneHourReservation = (startTimeStr: string): [string, string, string] => {
    const [datePart, timePart] = startTimeStr.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);

    const start = new Date(year, month - 1, day, hour, minute);
    const end = new Date(year, month - 1, day, hour + 1, minute);

    const dateStr = start.toLocaleDateString('en-GB').replace(/\//g, '-');
    const startStr = start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const endStr = end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    return [dateStr, startStr, endStr];
  };

  const showEmptyState = hasLoaded && reservations.length === 0;
  const marginClass =
    fields?.applyMargin?.value == 1 || fields?.applyMargin == 1 ? 'mt-5 md:mt-6' : '';

  return (
    <section className={`MyBookings pb-5 md:pb-6 ${marginClass}`}>
      <div className="container-sm">
        <div className="bg-white-pure border border-lilac-300 rounded-xl p-5 md:p-6 flex flex-col gap-5 md:gap-6">
          <div>
            <div className="flex gap-4 items-center">
              <CustomRichText field={fields?.icon} className="text-lilac-500" />
              <Text tag="h1" field={fields?.title} className="text-[16px] md:text-[20px]" />
            </div>
            <Text tag="p" field={fields?.description} className="text-body font-light" />
          </div>

          {showEmptyState ? (
            <div className="flex flex-col items-center gap-5 md:gap-6">
              <CustomImage field={fields?.emptyStateImage} className="w-68.75 md:w-87.5" />
              <Text
                tag="p"
                field={fields?.emptyStateText}
                className="text-body font-light text-center"
              />
              <CustomLink
                field={fields?.viewCalendarCTA}
                className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15 uppercase"
              >
                <CustomRichText field={fields?.viewCalendarCTAIcon} className="text-lilac-500" />
                {fields?.viewCalendarCTA?.value?.text || 'VIEW CALENDAR'}
              </CustomLink>
            </div>
          ) : hasLoaded && reservations.length > 0 ? (
            <div className="mb-4 lg:mb-0 rounded-xl lg:rounded-t-3xl overflow-hidden">
              <div className="table w-full">
                <div className="text-body-xs lg:text-body font-normal bg-lilac-100 hidden lg:table-header-group">
                  <div className="table-row">
                    <div className="table-cell p-4">Status</div>
                    <div className="table-cell p-4">Category</div>
                    <div className="table-cell p-4">Booking details</div>
                    <div className="table-cell p-4"></div>
                    <div className="table-cell p-4"></div>
                    <div className="table-cell p-4"></div>
                  </div>
                </div>
                <div className="text-body-xs lg:text-body font-light flex flex-col gap-3 lg:table-row-group">
                  {reservations?.slice(0, 5)?.map((reservation: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 desktop-data rounded-xl border border-solid border-lilac-200 hidden flex-wrap gap-3 lg:table-row lg:border-none lg:rounded-none"
                    >
                      <div className="lg:p-4 hidden lg:table-cell lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200">
                        <span
                          className={`text-body-sm px-4 py-2 inline max-w-min rounded-full border-solid ${
                            RESERVATION_STATUS_STYLES[
                              getReservationStatus(reservation.status, reservation.start_time)
                            ]
                          }`}
                        >
                          {getReservationStatus(reservation.status, reservation.start_time)}
                        </span>
                      </div>
                      <div className="lg:p-4 hidden lg:table-cell lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200 font-medium">
                        {reservation?.name || '-'}
                      </div>
                      <div className="lg:p-4 hidden lg:table-cell lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200">
                        <span className="lg:block font-medium">Date</span>
                        <span>{formatOneHourReservation(reservation.start_time)[0]}</span>
                      </div>
                      <div className="lg:p-4 hidden lg:table-cell lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200">
                        <span className="lg:block font-medium">From</span>
                        <span>{formatOneHourReservation(reservation.start_time)[1]}</span>
                      </div>
                      <div className="lg:p-4 hidden lg:table-cell lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200">
                        <span className="lg:block font-medium">Until</span>
                        <span>{formatOneHourReservation(reservation.start_time)[2]}</span>
                      </div>
                      <div className="lg:p-4 hidden lg:table-cell lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200">
                        <Link
                          href={`/booking-amenities/view-booking?bookingId=${reservation.reservation_id}`}
                          className="text-navy-500"
                        >
                          <ArrowRightIcon className="cursor-pointer" />
                        </Link>
                      </div>
                    </div>
                  ))}
                  {reservations?.slice(0, 5)?.map((reservation: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 mobile-data lg:hidden rounded-xl border border-solid border-lilac-200 flex flex-wrap gap-4"
                    >
                      <div className="flex flex-col justify-between">
                        <div>
                          <span
                            className={`text-body-sm px-2 py-0.5 inline max-w-min rounded-full border-solid ${
                              RESERVATION_STATUS_STYLES[
                                getReservationStatus(reservation.status, reservation.start_time)
                              ]
                            }`}
                          >
                            {getReservationStatus(reservation.status, reservation.start_time)}
                          </span>
                        </div>
                        <div className="font-medium">
                          {reservation?.resource_properties?.Type || '-'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="h-10 flex items-start justify-end">
                          <Link
                            href={`/booking-amenities/view-booking?bookingId=${reservation.reservation_id}`}
                            className="text-navy-500"
                          >
                            <ArrowRightIcon className="cursor-pointer" />
                          </Link>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="">
                            <span className="lg:block font-medium">Date: &nbsp;</span>
                            <span>{formatOneHourReservation(reservation.start_time)[0]}</span>
                          </div>
                          <div className="">
                            <span className="lg:block font-medium">From: &nbsp;</span>
                            <span>{formatOneHourReservation(reservation.start_time)[1]}</span>
                          </div>
                          <div className="">
                            <span className="lg:block font-medium">Until: &nbsp;</span>
                            <span>{formatOneHourReservation(reservation.start_time)[2]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center items-center mt-5">
                <CustomLink
                  field={fields?.viewCalendarCTA}
                  className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15 uppercase"
                >
                  <CustomRichText field={fields?.viewCalendarCTAIcon} className="text-lilac-500" />
                  {fields?.viewCalendarCTA?.value?.text || 'VIEW CALENDAR'}
                </CustomLink>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default MyBookings;
