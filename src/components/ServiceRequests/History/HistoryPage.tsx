import { JSX } from 'react';
import Image from 'next/image';
import MaintenanceIcon from 'assets/icons/MaintenanceIcon';
import CommunityIcon from 'assets/icons/CommunityIcon';
import DocumentIcon from 'assets/icons/DocumentIcon';
import Link from 'next/link';
import { useHistoryPage } from './useHistoryPage';
import { formatDate } from 'src/utils/formatDate';
import ArrowLeft from 'assets/icons/ArrowLeft';
import Pagination from 'components/Pagination/Pagination';
import Menu from 'assets/icons/Menu';
import TableSkeleton from '../TableSkeleton';

export default function ServiceRequestsPage(): JSX.Element {
  const {
    serviceRequestType,
    requests,
    requestsEmpty,
    isLoading,
    currentRequests,
    requestCurrentPage,
    itemsPerPage,
    openTooltipIndex,

    setOpenTooltipIndex,
    setRequestCurrentPage,
  } = useHistoryPage();
  return (
    <>
      <div className="ServiceRequestsHistoryPage bg-silver-chalice-50">
        {requestsEmpty && (
          <div className="container-sm py-14">
            <Image
              src={'/assets/svg/no-leasing-request.svg'}
              alt={''}
              width={350}
              height={250}
              className="my-0 mx-auto"
            />
            <p className="text-body text-navy-500 mt-5 md:mt-6 text-center">
              No request history available. Closed or cancelled requests will appear here.
            </p>
            <div className="flex justify-center">
              <Link
                href={'/service-requests'}
                className="btn btn-secondary w-auto text-center mt-5 md:mt-11 mb-0"
              >
                BACK TO service requests
              </Link>
            </div>
          </div>
        )}
        {!requestsEmpty && (
          <div className="container-sm py-5 md:py-6 flex flex-col gap-5 md:gap-6">
            <Link
              href={'/service-requests'}
              className="text-body-sm font-medium flex gap-4 text-navy-500 uppercase items-center"
            >
              <ArrowLeft className="size-5 md:size-7" />
              back to service requests
            </Link>
            <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
              {serviceRequestType === '1' && (
                <h3 className="flex gap-2 md:gap-4 text-heading-3 font-normal items-center">
                  <span>
                    <MaintenanceIcon className="size-7 md:size-8 text-lilac-500" />
                  </span>
                  Maintenance requests
                </h3>
              )}
              {serviceRequestType !== '1' && (
                <>
                  {serviceRequestType === '2' ? (
                    <h3 className="flex gap-2 md:gap-4 text-heading-3 font-normal items-center">
                      <span>
                        <CommunityIcon className="size-7 md:size-8 text-lilac-500" />
                      </span>
                      Community care request history
                    </h3>
                  ) : (
                    <h3 className="flex gap-2 md:gap-4 text-heading-3 font-normal items-center">
                      <span>
                        <DocumentIcon className="size-7 md:size-8 text-lilac-500" />
                      </span>
                      <span className="lowercase first-letter:uppercase">
                        {serviceRequestType} request history
                      </span>
                    </h3>
                  )}
                </>
              )}
              {isLoading && <TableSkeleton />}
              {!isLoading && (
                <>
                  <div className="rounded-t-3xl lg:overflow-hidden">
                    <div className="table w-full">
                      <div className="text-body-xs lg:text-body font-normal bg-lilac-100 hidden lg:table-header-group">
                        <div className="table-row">
                          <div className="table-cell p-4 font-medium">SR ID</div>
                          <div className="table-cell p-4 font-medium">Status</div>
                          <div className="table-cell p-4 font-medium">Category</div>
                          <div className="table-cell p-4 font-medium">Raised</div>
                          <div className="table-cell p-4 font-medium">Closed</div>
                          <div className="table-cell p-4 font-medium"></div>
                        </div>
                      </div>
                      <div className="text-body-xs lg:text-body font-light flex flex-col gap-3 lg:table-row-group">
                        {currentRequests.map((req, index) => {
                          const isLast = index === currentRequests.length - 1;
                          return (
                            <div
                              key={index}
                              className="p-3 rounded-xl border border-solid border-lilac-200 flex flex-wrap gap-3 lg:table-row lg:border-none lg:rounded-none"
                            >
                              <div
                                className={`lg:p-4 hidden lg:table-cell lg:align-middle ${
                                  !isLast ? 'lg:border-b lg:border-solid lg:border-lilac-200' : ''
                                }`}
                              >
                                {req?.WO_Code}
                              </div>
                              <div
                                className={`lg:p-4 lg:table-cell lg:align-middle ${
                                  !isLast ? 'lg:border-b lg:border-solid lg:border-lilac-200' : ''
                                } order-1 flex-[1_1_45%]`}
                              >
                                <span
                                  className={`font-light w-21 lg:w-25 lg:h-9 h-4.5 flex justify-center text-body-sm items-center rounded-full border border-solid
                                                                ${
                                                                  req.Status.toLowerCase().replace(
                                                                    / /g,
                                                                    '-'
                                                                  ) == 'open'
                                                                    ? 'text-lilac-800 bg-lilac-100 border-lilac-500'
                                                                    : ''
                                                                }
                                                                ${
                                                                  req.Status.toLowerCase().replace(
                                                                    / /g,
                                                                    '-'
                                                                  ) == 'closed'
                                                                    ? 'text-success-900 bg-success-50 border-success-500'
                                                                    : ''
                                                                }
                                                                ${
                                                                  req.Status.toLowerCase().replace(
                                                                    / /g,
                                                                    '-'
                                                                  ) == 'in-progress'
                                                                    ? 'text-warning-900 bg-warning-50 border-warning-500'
                                                                    : ''
                                                                }
                                                                ${
                                                                  req.Status.toLowerCase().replace(
                                                                    / /g,
                                                                    '-'
                                                                  ) == 'cancelled' ||
                                                                  req.Status.toLowerCase().replace(
                                                                    / /g,
                                                                    '-'
                                                                  ) == 'canceled'
                                                                    ? 'text-danger-900 bg-danger-50 border-danger-500'
                                                                    : ''
                                                                } `}
                                >
                                  {req?.Status}
                                </span>
                              </div>
                              <div
                                className={`lg:p-4 lg:table-cell lg:align-middle ${
                                  !isLast ? 'lg:border-b lg:border-solid lg:border-lilac-200' : ''
                                } order-3 flex-[1_1_45%] text-start`}
                              >
                                <span className="block font-medium">{req?.Category}</span>
                                {req?.Sub_Category}
                              </div>
                              <div
                                className={`lg:p-4 hidden lg:table-cell lg:align-middle ${
                                  !isLast ? 'lg:border-b lg:border-solid lg:border-lilac-200' : ''
                                }`}
                              >
                                {formatDate(req.Call_Date, '2-digit')}
                              </div>
                              <div
                                className={`lg:p-4 hidden lg:table-cell lg:align-middle ${
                                  !isLast ? 'lg:border-b lg:border-solid lg:border-lilac-200' : ''
                                }`}
                              >
                                {req.Status === 'Closed' || req.Status === 'Canceled' ? (
                                  <div>
                                    {req.Completion_Date == null
                                      ? 'N/A'
                                      : formatDate(req.Completion_Date, '2-digit')}
                                  </div>
                                ) : (
                                  <div>
                                    <>-</>
                                  </div>
                                )}
                              </div>
                              <div
                                className={`lg:p-4 lg:table-cell lg:align-middle ${
                                  !isLast ? 'lg:border-b lg:border-solid lg:border-lilac-200' : ''
                                } order-2 flex-[1_1_45%] text-end`}
                              >
                                <button
                                  className="relative cursor-pointer"
                                  onMouseEnter={() => {
                                    setOpenTooltipIndex(index);
                                  }}
                                  onMouseLeave={() => {
                                    setOpenTooltipIndex(null);
                                  }}
                                >
                                  <Menu className="size-4 lg:size-7" />
                                  <div
                                    className={`py-3 px-5 absolute top-1/2 right-full transform -translate-y-1/2 rounded-xl bg-white-pure border border-lilac-300 ${
                                      openTooltipIndex === index
                                        ? 'opacity-100 pointer-events-auto'
                                        : 'opacity-0 pointer-events-none'
                                    }  transition-default`}
                                  >
                                    <ul className="switch-unit__user-menu-popup-list">
                                      <li className="switch-unit__user-menu-popup-list-item">
                                        <Link
                                          href={{
                                            pathname: '/service-requests/details',
                                            query: {
                                              serviceRequestType: serviceRequestType,
                                              id: req.WO_Code.trim(),
                                            },
                                          }}
                                          className="w-full text-cta-sm py-2 px-0 whitespace-nowrap text-navy-500 hover:text-lilac-300"
                                        >
                                          VIEW DETAILS
                                        </Link>
                                      </li>
                                      {(req.CanReopen === true ||
                                        String(req.CanReopen).toLowerCase() === 'true') && (
                                        <li className="switch-unit__user-menu-popup-list-item">
                                          <Link
                                            href={{
                                              pathname: `/service-requests/reopen`,
                                              query: {
                                                serviceRequestType: serviceRequestType,
                                                id: req.WO_Code.trim(),
                                              },
                                            }}
                                            className="w-full text-cta-sm py-2 px-0 whitespace-nowrap text-navy-500 hover:text-lilac-300"
                                          >
                                            REOPEN
                                          </Link>
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                </button>
                              </div>
                              <div
                                className={`lg:p-4 lg:hidden lg:align-middle ${
                                  !isLast ? 'lg:border-b lg:border-solid lg:border-lilac-200' : ''
                                } order-4 flex-[1_1_45%] text-start`}
                              >
                                <div className="mb-1.5">
                                  SR ID:{' '}
                                  <span className="inline-block font-medium">{req.WO_Code}</span>
                                </div>
                                <div className="mb-1.5">
                                  Raised:{' '}
                                  <span className="inline-block font-medium">
                                    {formatDate(req.Call_Date, '2-digit')}
                                  </span>
                                </div>
                                {req.Status === 'Closed' || req.Status === 'Canceled' ? (
                                  <div className="mb-1.5">
                                    <span className="inline-block font-regular">Closed:&nbsp;</span>
                                    <span>
                                      {req.Completion_Date == null
                                        ? 'N/A'
                                        : formatDate(req.Completion_Date, '2-digit')}
                                    </span>
                                  </div>
                                ) : (
                                  <>
                                    <span className="inline-block font-regular">-</span>
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
                    totalItems={requests.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={requestCurrentPage}
                    onPageChange={(pageNumber: number) => setRequestCurrentPage(pageNumber)}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
