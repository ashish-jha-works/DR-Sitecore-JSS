import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';
import { formatDate } from 'src/utils/formatDate';

import ArrowRightIcon from 'assets/icons/ArrowRightIcon';
import CircleCrossIcon from 'assets/icons/CircleCrossIcon';
import CirclePlusIcon from 'assets/icons/CirclePlusIcon';
import CommunityIcon from 'assets/icons/CommunityIcon';
import DocumentIcon from 'assets/icons/DocumentIcon';
import HistoryIcon from 'assets/icons/HistoryIcon';
import MaintenanceIcon from 'assets/icons/MaintenanceIcon';
import InfoMessage from 'components/InfoMessage';
import Pagination from 'components/Pagination/Pagination';

import TableSkeleton from './TableSkeleton';
import { useServiceRequestsPage } from './useServiceRequestsPage';
import { SERVICE_REQUEST_TYPE } from 'lib/common/constants/common';

export default function ServiceRequestsPage(): JSX.Element {
  const {
    maintenanceRequests,
    loadingMaintenanceRequest,
    communityRequests,
    loadingCommunityRequest,
    leasingRequests,
    loadingLeasingRequest,
    maintenanceError,
    communityError,
    leasingError,
    maintenanceRequestsEmpty,
    communityRequestsEmpty,
    leasingRequestsEmpty,
    maintenanceCurrentPage,
    setMaintenanceCurrentPage,
    itemsPerPage,
    currentMaintenanceItems,

    communityCurrentPage,
    setCommunityCurrentPage,
    currentCommunityItems,

    leasingCurrentPage,
    setLeasingCurrentPage,
    currentLeasingItems,
  } = useServiceRequestsPage();

  return (
    <div className="ServiceRequestsPage bg-silver-chalice-50">
      <div className="pb-5 md:pb-10">
        <section className="container-sm pt-5 md:pt-10">
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap mb-5 md:mb-6">
              <div>
                <h3 className="flex gap-2 md:gap-3 text-heading-3 font-normal mb-0">
                  <span>
                    <MaintenanceIcon className="size-6 md:size-7 text-lilac-500" />
                  </span>
                  Maintenance requests
                </h3>
                <p className="mt-2 md:mt-1 text-body text-navy-500 font-light">
                  Services related to your home upkeep
                </p>
              </div>
              <div className="order-2 lg:order-3 w-full">
                {maintenanceError && (
                  <InfoMessage
                    IconComponent={CircleCrossIcon}
                    status="error"
                    className="mt-5 md:mt-6"
                  >
                    <p className="text-body text-navy-400">
                      Sorry, we could not fetch your maintenance requests.
                    </p>
                  </InfoMessage>
                )}
                {!maintenanceError && (
                  <>
                    {maintenanceRequestsEmpty ? (
                      <div className="mt-5 md:mt-6">
                        <Image
                          src={'/assets/svg/no-maintenance-request.svg'}
                          alt={''}
                          width={150}
                          height={107}
                          className="my-0 mx-auto"
                        />
                        <p className="text-body text-navy-500 mt-5 md:mt-6 text-center">
                          No active requests found.{' '}
                        </p>
                      </div>
                    ) : (
                      <>
                        {loadingMaintenanceRequest && <TableSkeleton version={1} />}
                        {!loadingMaintenanceRequest && (
                          <>
                            <div className="my-5 lg:mt-6 lg:mb-0 rounded-t-3xl lg:overflow-hidden">
                              <div className="table w-full">
                                <div className="text-body-xs lg:text-body font-normal bg-lilac-100 hidden lg:table-header-group">
                                  <div className="table-row">
                                    <div className="table-cell p-4 font-medium">SR ID</div>
                                    <div className="table-cell p-4 font-medium">Status</div>
                                    <div className="table-cell p-4 font-medium">Category</div>
                                    <div className="table-cell p-4 font-medium">Raised</div>
                                    <div className="table-cell p-4 font-medium">Scheduled</div>
                                    <div className="table-cell p-4 font-medium"></div>
                                  </div>
                                </div>
                                <div className="text-body-xs lg:text-body font-light flex flex-col gap-3 lg:table-row-group">
                                  {currentMaintenanceItems.map((request, index) => {
                                    const isLast = index === currentMaintenanceItems.length - 1;
                                    return (
                                      <div
                                        key={index}
                                        className="p-3 rounded-xl border border-solid border-lilac-200 flex flex-wrap gap-3 lg:table-row lg:border-none lg:rounded-none"
                                      >
                                        <div
                                          className={`lg:p-4 hidden lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          }`}
                                        >
                                          {request?.WO_Code}
                                        </div>
                                        <div
                                          className={`lg:p-4 lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          } order-1 flex-[1_1_45%]`}
                                        >
                                          <span
                                            className={`font-light w-21 lg:w-25 lg:h-9 h-4.5 flex justify-center text-body-sm items-center rounded-full border border-solid
                                                                        ${
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'open'
                                                                            ? 'text-lilac-800 bg-lilac-100 border-lilac-500'
                                                                            : ''
                                                                        }
                                                                        ${
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'closed'
                                                                            ? 'text-success-900 bg-success-50 border-success-500'
                                                                            : ''
                                                                        }
                                                                        ${
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'in-progress'
                                                                            ? 'text-warning-900 bg-warning-50 border-warning-500'
                                                                            : ''
                                                                        }
                                                                        ${
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'cancelled' ||
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'canceled'
                                                                            ? 'text-danger-900 bg-danger-50 border-danger-500'
                                                                            : ''
                                                                        } `}
                                          >
                                            {request?.Status}
                                          </span>
                                        </div>
                                        <div
                                          className={`lg:p-4 lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          } order-3 flex-[1_1_45%] text-start`}
                                        >
                                          <span className="block font-medium">
                                            {request?.Category}
                                          </span>
                                          {request?.Sub_Category}
                                        </div>
                                        <div
                                          className={`lg:p-4 hidden lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          }`}
                                        >
                                          {formatDate(request.Call_Date, '2-digit')}
                                        </div>
                                        <div
                                          className={`lg:p-4 hidden lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          }`}
                                        >
                                          {request.Status === 'Closed' ||
                                          request.Status === 'Canceled' ? (
                                            <div>
                                              {request.Completion_Date == null
                                                ? 'N/A'
                                                : formatDate(request.Completion_Date, '2-digit')}
                                            </div>
                                          ) : (
                                            <div>
                                              {request.Preferred_Date == null &&
                                              request.Preferred_TimeSlot == null ? (
                                                <>Awaiting</>
                                              ) : (
                                                <>
                                                  {formatDate(request.Preferred_Date, '2-digit')}
                                                  <br />
                                                  {request.Preferred_TimeSlot}
                                                </>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        <div
                                          className={`lg:p-4 lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          } order-2 flex-[1_1_45%] text-end`}
                                        >
                                          <Link
                                            href={{
                                              pathname: '/service-requests/details',
                                              query: {
                                                serviceRequestType:
                                                  SERVICE_REQUEST_TYPE.MAINTENANCE,
                                                id: request.WO_Code.trim(),
                                              },
                                            }}
                                            className="text-body-sm font-normal text-navy-500 hover:text-lilac-300"
                                          >
                                            <span className="font-medium">
                                              <ArrowRightIcon
                                                width={16}
                                                height={16}
                                                className="inline-block size-4 lg:size-7"
                                              />
                                            </span>
                                          </Link>
                                        </div>
                                        <div
                                          className={`lg:p-4 lg:hidden lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          } order-4 flex-[1_1_45%] text-start`}
                                        >
                                          <div className="mb-1.5">
                                            SR ID:{' '}
                                            <span className="inline-block font-medium">
                                              {request.WO_Code}
                                            </span>
                                          </div>
                                          <div className="mb-1.5">
                                            Raised:{' '}
                                            <span className="inline-block font-medium">
                                              {formatDate(request.Call_Date, '2-digit')}
                                            </span>
                                          </div>
                                          {request.Status === 'Closed' ||
                                          request.Status === 'Canceled' ? (
                                            <div className="mb-1.5">
                                              {request.Status === 'Closed' && (
                                                <span className="inline-block font-regular">
                                                  Closed:&nbsp;
                                                </span>
                                              )}
                                              {request.Status === 'Canceled' && (
                                                <span className="inline-block font-regular">
                                                  Cancelled:&nbsp;
                                                </span>
                                              )}
                                              <span>
                                                {request.Completion_Date == null
                                                  ? 'N/A'
                                                  : formatDate(request.Completion_Date, '2-digit')}
                                              </span>
                                            </div>
                                          ) : (
                                            <>
                                              <div className="mb-1.5">
                                                <span className="inline-block font-regular">
                                                  Scheduled:&nbsp;
                                                </span>
                                                <span className="inline-block">
                                                  {request.Preferred_Date == null &&
                                                  request.Preferred_TimeSlot == null
                                                    ? 'Awaiting'
                                                    : formatDate(request.Preferred_Date, '2-digit')}
                                                </span>
                                              </div>
                                              {!(
                                                request.Preferred_Date == null &&
                                                request.Preferred_TimeSlot == null
                                              ) && (
                                                <div className="mb-1.5">
                                                  <span className="inline-block font-regular">
                                                    Time:&nbsp;
                                                  </span>
                                                  <span className="inline-block">
                                                    {request.Preferred_TimeSlot}
                                                  </span>
                                                </div>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            <Pagination
                              totalItems={maintenanceRequests.length}
                              itemsPerPage={itemsPerPage}
                              currentPage={maintenanceCurrentPage}
                              onPageChange={(pageNumber: number) =>
                                setMaintenanceCurrentPage(pageNumber)
                              }
                            />
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
              <Link
                href={{
                  pathname: '/service-requests/history',
                  query: { serviceRequestType: SERVICE_REQUEST_TYPE.MAINTENANCE },
                }}
                className="btn w-full md:w-68.75 px-0 h-11 md:h-15 uppercase btn-secondary"
              >
                <HistoryIcon />
                View History
              </Link>
              <Link
                href={`service-requests/create?serviceRequestType=${SERVICE_REQUEST_TYPE.MAINTENANCE}`}
                className="btn w-full md:w-68.75 px-0 h-11 md:h-15 uppercase btn-primary"
              >
                <CirclePlusIcon />
                Create New
              </Link>
            </div>
          </div>
        </section>

        <section className="container-sm pt-5 md:pt-10">
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap mb-5 md:mb-6">
              <div>
                <h3 className="flex gap-2 md:gap-3 text-heading-3 font-normal mb-0">
                  <span>
                    <CommunityIcon className="size-6 md:size-7 text-lilac-500" />
                  </span>
                  Community care
                </h3>
                <p className="mt-2 md:mt-1 text-body text-navy-500 font-light">
                  Community- related maintenance, suggestions and complaints
                </p>
              </div>
              <div className="order-2 lg:order-3 w-full">
                {communityError && (
                  <InfoMessage
                    IconComponent={CircleCrossIcon}
                    status="error"
                    className="mt-5 md:mt-6"
                  >
                    <p className="text-body text-navy-400">
                      Sorry, we could not fetch your community care requests.
                    </p>
                  </InfoMessage>
                )}
                {!communityError && (
                  <>
                    {communityRequestsEmpty ? (
                      <div className="mt-5 md:mt-6">
                        <Image
                          src={'/assets/svg/no-community-request.svg'}
                          alt={''}
                          width={150}
                          height={107}
                          className="my-0 mx-auto"
                        />
                        <p className="text-body text-navy-500 mt-5 md:mt-6 text-center">
                          No active requests found.{' '}
                        </p>
                      </div>
                    ) : (
                      <>
                        {loadingCommunityRequest && <TableSkeleton version={1} />}
                        {!loadingCommunityRequest && (
                          <>
                            <div className="my-5 lg:mt-6 lg:mb-0 rounded-t-3xl lg:overflow-hidden">
                              <div className="table w-full">
                                <div className="text-body-xs lg:text-body font-normal bg-lilac-100 hidden lg:table-header-group">
                                  <div className="table-row">
                                    <div className="table-cell p-4 font-medium">SR ID</div>
                                    <div className="table-cell p-4 font-medium">Status</div>
                                    <div className="table-cell p-4 font-medium">Category</div>
                                    <div className="table-cell p-4 font-medium">Raised</div>
                                    <div className="table-cell p-4 font-medium"></div>
                                  </div>
                                </div>
                                <div className="text-body-xs lg:text-body font-light flex flex-col gap-3 lg:table-row-group">
                                  {currentCommunityItems.map((request, index) => {
                                    const isLast = index === currentCommunityItems.length - 1;
                                    return (
                                      <div
                                        key={index}
                                        className="p-3 rounded-xl border border-solid border-lilac-200 flex flex-wrap gap-3 lg:table-row lg:border-none lg:rounded-none"
                                      >
                                        <div
                                          className={`lg:p-4 hidden lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          }`}
                                        >
                                          {request?.WO_Code}
                                        </div>
                                        <div
                                          className={`lg:p-4 lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          } order-1 flex-[1_1_45%]`}
                                        >
                                          <span
                                            className={`w-21 lg:w-25 lg:h-9 h-4.5 flex justify-center items-center font-light text-body-sm rounded-full border border-solid
                                                                        ${
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'open'
                                                                            ? 'text-lilac-800 bg-lilac-100 border-lilac-500'
                                                                            : ''
                                                                        }
                                                                        ${
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'closed'
                                                                            ? 'text-success-900 bg-success-50 border-success-500'
                                                                            : ''
                                                                        }
                                                                        ${
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'in-progress'
                                                                            ? 'text-warning-900 bg-warning-50 border-warning-500'
                                                                            : ''
                                                                        }
                                                                        ${
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'cancelled' ||
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'canceled'
                                                                            ? 'text-danger-900 bg-danger-50 border-danger-500'
                                                                            : ''
                                                                        } `}
                                          >
                                            {request?.Status}
                                          </span>
                                        </div>
                                        <div
                                          className={`lg:p-4 lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          } order-3 flex-[1_1_45%] text-start`}
                                        >
                                          <span className="block font-medium">
                                            {request?.Category}
                                          </span>
                                          {request?.Sub_Category}
                                        </div>
                                        <div
                                          className={`lg:p-4 hidden lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          }`}
                                        >
                                          {formatDate(request.Call_Date, '2-digit')}
                                        </div>
                                        <div
                                          className={`lg:p-4 lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          } order-2 flex-[1_1_45%] text-end`}
                                        >
                                          <Link
                                            href={{
                                              pathname: '/service-requests/details',
                                              query: {
                                                serviceRequestType: SERVICE_REQUEST_TYPE.COMMUNITY,
                                                id: request.WO_Code.trim(),
                                              },
                                            }}
                                            className="text-body-sm font-normal text-navy-500 hover:text-lilac-300"
                                          >
                                            <span className="font-medium">
                                              <ArrowRightIcon
                                                width={16}
                                                height={16}
                                                className="inline-block size-4 lg:size-7"
                                              />
                                            </span>
                                          </Link>
                                        </div>
                                        <div
                                          className={`lg:p-4 lg:hidden lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          } order-4 flex-[1_1_45%] text-start`}
                                        >
                                          <div className="mb-1.5">
                                            SR ID:{' '}
                                            <span className="inline-block font-medium">
                                              {request.WO_Code}
                                            </span>
                                          </div>
                                          <div className="mb-1.5">
                                            Raised:{' '}
                                            <span className="inline-block font-medium">
                                              {formatDate(request.Call_Date, '2-digit')}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            <Pagination
                              totalItems={communityRequests.length}
                              itemsPerPage={itemsPerPage}
                              currentPage={communityCurrentPage}
                              onPageChange={(pageNumber: number) =>
                                setCommunityCurrentPage(pageNumber)
                              }
                            />
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
              <Link
                href={{
                  pathname: '/service-requests/history',
                  query: { serviceRequestType: SERVICE_REQUEST_TYPE.COMMUNITY },
                }}
                className="btn w-full md:w-68.75 px-0 h-11 md:h-15 uppercase btn-secondary"
              >
                <HistoryIcon />
                View History
              </Link>
              <Link
                href={`service-requests/create?serviceRequestType=${SERVICE_REQUEST_TYPE.COMMUNITY}`}
                className="btn w-full md:w-68.75 px-0 h-11 md:h-15 uppercase btn-primary"
              >
                <CirclePlusIcon />
                Create New
              </Link>
            </div>
          </div>
        </section>

        <section className="container-sm pt-5 md:pt-10">
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap mb-5 md:mb-6">
              <div>
                <h3 className="flex gap-2 md:gap-3 text-heading-3 font-normal mb-0">
                  <span>
                    <DocumentIcon className="size-6 md:size-7 text-lilac-500" />
                  </span>
                  Leasing services
                </h3>
                <p className="mt-2 md:mt-1 text-body text-navy-500 font-light">
                  Enquiries related to your lease
                </p>
              </div>
              <div className="order-2 lg:order-3 w-full">
                {leasingError && (
                  <InfoMessage
                    IconComponent={CircleCrossIcon}
                    status="error"
                    className="mt-5 md:mt-6"
                  >
                    <p className="text-body text-navy-400">
                      Sorry, we could not fetch your leasing requests.
                    </p>
                  </InfoMessage>
                )}
                {!leasingError && (
                  <>
                    {leasingRequestsEmpty ? (
                      <div className="mt-5 md:mt-6">
                        <Image
                          src={'/assets/svg/no-leasing-request.svg'}
                          alt={''}
                          width={150}
                          height={107}
                          className="my-0 mx-auto"
                        />
                        <p className="text-body text-navy-500 mt-5 md:mt-6 text-center">
                          No active requests found.{' '}
                        </p>
                      </div>
                    ) : (
                      <>
                        {loadingLeasingRequest && <TableSkeleton version={1} />}
                        {!loadingLeasingRequest && (
                          <>
                            <div className="my-5 lg:mt-6 lg:mb-0 rounded-t-3xl lg:overflow-hidden">
                              <div className="table w-full">
                                <div className="text-body-xs lg:text-body font-normal bg-lilac-100 hidden lg:table-header-group">
                                  <div className="table-row">
                                    <div className="table-cell p-4 font-medium">SR ID</div>
                                    <div className="table-cell p-4 font-medium">Status</div>
                                    <div className="table-cell p-4 font-medium">Category</div>
                                    <div className="table-cell p-4 font-medium">Date</div>
                                    <div className="table-cell p-4 font-medium"></div>
                                  </div>
                                </div>
                                <div className="text-body-xs lg:text-body font-light flex flex-col gap-3 lg:table-row-group">
                                  {currentLeasingItems.map((request, index) => {
                                    const isLast = index === currentLeasingItems.length - 1;
                                    return (
                                      <div
                                        key={index}
                                        className="p-3 rounded-xl border border-solid border-lilac-200 flex flex-wrap gap-3 lg:table-row lg:border-none lg:rounded-none"
                                      >
                                        <div
                                          className={`lg:p-4 hidden lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          }`}
                                        >
                                          {request?.WO_Code}
                                        </div>
                                        <div
                                          className={`lg:p-4 lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          } order-1 flex-[1_1_45%]`}
                                        >
                                          <span
                                            className={`w-21 lg:w-25 lg:h-9 h-4.5 flex justify-center items-center text-body-sm rounded-full border border-solid font-light
                                                                        ${
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'open'
                                                                            ? 'text-lilac-800 bg-lilac-100 border-lilac-500'
                                                                            : ''
                                                                        }
                                                                        ${
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'closed'
                                                                            ? 'text-success-900 bg-success-50 border-success-500'
                                                                            : ''
                                                                        }
                                                                        ${
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'in-progress'
                                                                            ? 'text-warning-900 bg-warning-50 border-warning-500'
                                                                            : ''
                                                                        }
                                                                        ${
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'cancelled' ||
                                                                          request.Status.toLowerCase().replace(
                                                                            / /g,
                                                                            '-'
                                                                          ) == 'canceled'
                                                                            ? 'text-danger-900 bg-danger-50 border-danger-500'
                                                                            : ''
                                                                        } `}
                                          >
                                            {request?.Status}
                                          </span>
                                        </div>
                                        <div
                                          className={`lg:p-4 lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          } order-3 flex-[1_1_45%] text-start`}
                                        >
                                          <span className="block font-medium">
                                            {request?.Category}
                                          </span>
                                          {request?.Sub_Category}
                                        </div>
                                        <div
                                          className={`lg:p-4 hidden lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          }`}
                                        >
                                          {formatDate(request.Call_Date, '2-digit')}
                                        </div>
                                        <div
                                          className={`lg:p-4 lg:table-cell lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          } order-2 flex-[1_1_45%] text-end`}
                                        >
                                          <Link
                                            href={{
                                              pathname: '/service-requests/details',
                                              query: {
                                                serviceRequestType: SERVICE_REQUEST_TYPE.LEASING,
                                                id: request.WO_Code.trim(),
                                              },
                                            }}
                                            className="text-body-sm font-normal text-navy-500 hover:text-lilac-300"
                                          >
                                            <span className="font-medium">
                                              <ArrowRightIcon
                                                width={16}
                                                height={16}
                                                className="inline-block size-4 lg:size-7"
                                              />
                                            </span>
                                          </Link>
                                        </div>
                                        <div
                                          className={`lg:p-4 lg:hidden lg:align-middle ${
                                            !isLast
                                              ? 'lg:border-b lg:border-solid lg:border-lilac-200'
                                              : ''
                                          } order-4 flex-[1_1_45%] text-start`}
                                        >
                                          <div className="mb-1.5">
                                            SR ID:{' '}
                                            <span className="inline-block font-medium">
                                              {request.WO_Code}
                                            </span>
                                          </div>
                                          <div className="mb-1.5">
                                            Date:{' '}
                                            <span className="inline-block font-medium">
                                              {formatDate(request.Call_Date, '2-digit')}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            <Pagination
                              totalItems={leasingRequests.length}
                              itemsPerPage={itemsPerPage}
                              currentPage={leasingCurrentPage}
                              onPageChange={(pageNumber: number) =>
                                setLeasingCurrentPage(pageNumber)
                              }
                            />
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
              <Link
                href={{
                  pathname: '/service-requests/history',
                  query: { serviceRequestType: SERVICE_REQUEST_TYPE.LEASING },
                }}
                className="btn w-full md:w-68.75 px-0 h-11 md:h-15 uppercase btn-secondary"
              >
                <HistoryIcon />
                View History
              </Link>
              <Link
                href={`service-requests/create?serviceRequestType=${SERVICE_REQUEST_TYPE.LEASING}`}
                className="btn w-full md:w-68.75 px-0 h-11 md:h-15 uppercase btn-primary"
              >
                <CirclePlusIcon />
                Create New
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
