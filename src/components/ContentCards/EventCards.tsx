import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CustomLink, RichText, Text } from 'src/common/SitecoreOverrides';

import ClockIcon from 'assets/icons/ClockIcon';
import LocationIcon from 'assets/icons/LocationIcon';
import AddToCalendar from 'components/common/AddToCalendar';
import ImageSlider from 'components/common/ImageSlider';
import Pagination from 'components/Pagination/Pagination';
import { formatToYYYYMMDD, sortItemsByStartDateDesc } from 'lib/utils/helper';

export default function EventCards({ fields }: any) {
  const pathname = usePathname();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const isOffersPage = pathname === '/offers' ? true : false;

  function getFeaturedItem(items: any) {
    if (!Array.isArray(items)) return false;

    // Step 1: filter featured items
    const featuredItems = items.filter((item) => item?.fields?.Featured?.value === true);

    // Step 2: no featured items
    if (featuredItems.length === 0) {
      return false;
    }

    // Step 3: one featured item
    if (featuredItems.length === 1) {
      return featuredItems[0];
    }

    // Step 4: multiple → find latest StartDate
    return featuredItems.reduce((latest, current) => {
      const latestDate = new Date(latest?.fields?.StartDate?.value || 0);
      const currentDate = new Date(current?.fields?.StartDate?.value || 0);

      return currentDate > latestDate ? current : latest;
    });
  }

  function getItemId(item: any) {
    return item?.fields?.id?.value || item?.id;
  }

  const sortedItems = sortItemsByStartDateDesc(fields?.items || []);
  const featuredItem = getFeaturedItem(sortedItems);

  // Exclude featured item from listing — it's already shown in the big card
  const listingItems =
    sortedItems.filter((item: any) => {
      if (!featuredItem) return true;
      return getItemId(item) !== getItemId(featuredItem);
    }) || [];

  const currentEventItems = listingItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function parseTimeSlot(input: string) {
    const regex =
      /^([A-Za-z]+ \d{1,2}, \d{4}) \| (\d{1,2}:\d{2} (AM|PM))(?: - (\d{1,2}:\d{2} (AM|PM)))?$/;

    const match = input.match(regex);
    if (!match) return false;

    const dateStr = match[1];
    const startTimeStr = match[2];
    const endTimeStr = match[4] || null;

    function to24Hour(timeStr: string) {
      const [time, modifier] = timeStr.split(' ');
      // eslint-disable-next-line prefer-const
      let [hours, minutes] = time.split(':').map(Number);

      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    function addOneHour(time24: string) {
      // eslint-disable-next-line prefer-const
      let [hours, minutes] = time24.split(':').map(Number);
      hours = (hours + 1) % 24;

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    const start24 = to24Hour(startTimeStr);

    // Check if the given date & time is in the past
    const startDateTime = new Date(`${dateStr} ${start24}`);
    if (startDateTime < new Date()) {
      return false;
    }

    const end24 = endTimeStr ? to24Hour(endTimeStr) : addOneHour(start24);

    return `${start24} - ${end24}`;
  }

  return (
    <section className="EventCards pb-5 md:pb-6">
      {!isOffersPage ? (
        <Text
          tag="h4"
          className="container-sm text-heading-2 font-normal mb-6"
          field={fields?.Title}
        />
      ) : null}
      {/* Featured Event Content Card Start */}
      {featuredItem ? (
        <div className={`container-sm h-full FeaturedEvent ${isOffersPage ? 'mt-6' : ''}`}>
          <div className={`h-full border border-solid border-lilac-500 rounded-2xl`}>
            <div className="h-full grid grid-cols-1 md:grid-cols-2">
              <div className="col-span-1 md:order-2 rounded-t-2xl lg:rounded-t-none lg:rounded-r-2xl overflow-hidden">
                <div className="h-57.5 md:h-full">
                  <ImageSlider
                    images={featuredItem?.fields?.images}
                    imageClassName="w-full! md:max-w-117.5! h-auto! aspect-[1.41/1] object-cover"
                  />
                </div>
              </div>
              <div className="col-span-1 md:order-1 bg-lilac-100 rounded-b-2xl lg:rounded-br-none lg:rounded-l-2xl">
                <div className="p-6 flex flex-col justify-between lg:p-8 md:h-full gap-3 lg:gap-4">
                  <div className="space-y-3 lg:space-y-4">
                    {featuredItem?.fields?.Tag?.value ? (
                      <span className="text-body-sm font-light mb-3 uppercase block">
                        {featuredItem?.fields?.Tag?.value}
                      </span>
                    ) : null}
                    <Text
                      tag="h4"
                      className="font-colgent text-heading-1 font-normal"
                      field={featuredItem?.fields?.Title}
                    />
                    {!isOffersPage && featuredItem?.fields?.DateAndTime?.value?.trim() ? (
                      <div className="mt-2 md:mt-4 flex gap-2 lg:gap-3">
                        <ClockIcon className="text-lilac-500 size-5" />
                        <Text
                          tag="p"
                          className="text-body font-light"
                          field={featuredItem?.fields?.DateAndTime}
                        />
                      </div>
                    ) : null}
                    {!isOffersPage && featuredItem?.fields?.Location?.value?.trim() ? (
                      <div className="mt-2 md:mt-4 flex gap-2 lg:gap-3">
                        <LocationIcon className="text-lilac-500 size-5" />
                        <Text
                          tag="p"
                          className="text-body font-light"
                          field={featuredItem?.fields?.Location}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col flex-wrap lg:flex-row gap-4 lg:gap-2 mt-4">
                    {featuredItem?.fields?.AddToCalendarCTALabel?.value?.trim() && // Check If Add To Calendar is Enabled
                    parseTimeSlot(featuredItem?.fields?.DateAndTime?.value) ? ( // Check if Date and Time is in correct format
                      <AddToCalendar
                        label={featuredItem?.fields?.AddToCalendarCTALabel?.value}
                        title={featuredItem?.fields?.Title?.value}
                        description={featuredItem?.fields?.Description?.value}
                        date={
                          formatToYYYYMMDD(featuredItem?.fields?.StartDate?.value as Date) as string
                        }
                        timeRange={
                          parseTimeSlot(featuredItem?.fields?.DateAndTime?.value) as string
                        }
                        timeZone="Asia/Dubai"
                        showGoogle
                        showOutlookWeb
                        showOutlookDesktop
                        isPrimaryBtn={false}
                        className="md:w-full"
                        containerClassName="w-full!"
                      />
                    ) : null}
                    <Link
                      href={`${fields?.DetailsURL?.value?.href}?Id=${
                        featuredItem?.fields?.id?.value || featuredItem?.id
                      }`}
                      className="btn btn-primary px-8 py-5 md:px-auto md:py-3.5 h-11 lg:h-15 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* Featured Event Content Card End */}
      {currentEventItems?.length > 0 ? (
        <div className="container-sm">
          {currentEventItems?.map((item: any, index: number) => (
            <div
              className="mt-8 md:mt-6 flex flex-col md:flex-row bg-white-pure rounded-xl border border-solid border-lilac-300"
              key={index.toString()}
            >
              <div className="w-full h-72 md:w-87.5 md:h-auto shrink-0 overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-r-none">
                <ImageSlider
                  images={item?.fields?.images}
                  imageClassName="w-full! md:max-w-81.5! h-auto! aspect-[1.41/1] object-cover"
                />
              </div>
              <div className="px-5 py-6 lg:p-8  flex-1">
                <h4 className="text-body-xs font-light mb-2 lg:mb-3 text-navy-500 uppercase">
                  {item?.fields?.Tag?.value}
                </h4>
                <h3 className="text-base leading-6 font-medium text-navy-500">
                  {item?.fields?.Title?.value}
                </h3>
                <ul className="mt-5">
                  {isOffersPage && item?.fields?.SubTitle?.value?.trim() ? (
                    <li className={`flex items-center gap-3.5 text-body-sm font-light`}>
                      <RichText field={item?.fields?.SubTitle} className="text-navy-500" />
                    </li>
                  ) : null}
                  {!isOffersPage && item?.fields?.DateAndTime?.value?.trim() ? (
                    <li className={`flex items-center gap-3.5 text-body font-light`}>
                      <ClockIcon className="text-lilac-500" width={20} height={20} />
                      <span className="text-navy-500">{item?.fields?.DateAndTime?.value}</span>
                    </li>
                  ) : null}
                  {!isOffersPage && item?.fields?.Location?.value?.trim() ? (
                    <li className={`flex items-center gap-3.5 text-body font-light pt-3`}>
                      <LocationIcon className="text-lilac-500" />
                      <span className="text-navy-500">{item?.fields?.Location?.value}</span>
                    </li>
                  ) : null}
                </ul>
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mt-4">
                  {item?.fields?.AddToCalendarCTALabel?.value?.trim() &&
                  parseTimeSlot(item?.fields?.DateAndTime?.value) ? (
                    <AddToCalendar
                      label={item?.fields?.AddToCalendarCTALabel?.value}
                      title={item?.fields?.Title?.value}
                      description={item?.fields?.Description?.value}
                      date={formatToYYYYMMDD(item?.fields?.StartDate?.value as Date) as string}
                      timeRange={parseTimeSlot(item?.fields?.DateAndTime?.value) as string}
                      timeZone="Asia/Dubai"
                      showGoogle
                      showOutlookWeb
                      showOutlookDesktop
                      isPrimaryBtn={false}
                      className="md:w-full max-h-11"
                    />
                  ) : null}
                  <Link
                    href={`${fields?.DetailsURL?.value?.href}?Id=${
                      item?.fields?.id?.value || item?.id
                    }`}
                    className="btn btn-primary w-full lg:w-58.5 px-8 py-5 md:px-auto md:py-3.5 h-11 text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
          <Pagination
            totalItems={listingItems.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(pageNumber: number) => setCurrentPage(pageNumber)}
          />
        </div>
      ) : !featuredItem ? (
        // No Events Found Dialogue area
        <div className="flex flex-col items-center gap-8 lg:gap-6 px-4">
          <RichText field={fields?.noResultFoundImage} className="w-68.75 md:w-87.5" />
          <Text tag="p" field={fields?.noResultFoundText} className="text-body font-light" />
          <CustomLink
            field={fields?.backCTA}
            className="btn btn-secondary w-full md:w-68.75 px-0 h-11 md:h-15 uppercase"
          ></CustomLink>
        </div>
      ) : null}
    </section>
  );
}
