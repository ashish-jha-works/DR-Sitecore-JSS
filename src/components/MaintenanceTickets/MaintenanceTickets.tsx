import ArrowRightIcon from 'assets/icons/ArrowRightIcon';
import Link from 'next/link';
import { JSX, useEffect, useState } from 'react';
import { CustomLink, Text } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';
import { formatDate } from 'src/utils/formatDate';

export default function MaintenanceTickets({ fields }: any): JSX.Element {
  const { tCode, ProfileType } = useUserStore();
  const [serviceRequestList, setServiceRequestList] = useState([]);
  const [requestLoaded, setRequestLoaded] = useState(false);

  const { mutate } = useApiMutation<any, any>(`/ServiceRequest/Home/${tCode}`, 'GET', false);

  useEffect(() => {
    if (tCode) {
      mutate(null, {
        onSuccess: (response) => {
          setRequestLoaded(true);
          if (ProfileType === 8 && response?.Code === 403) {
            console.warn('Subprofile deactivated');
          } else {
            if (response?.ServiceRequests?.length > 0) {
              setServiceRequestList(response.ServiceRequests);
            }
          }
        },
      });
    }
  }, [tCode, mutate, ProfileType]);

  if (requestLoaded && serviceRequestList?.length == 0) {
    return <></>;
  }
  return (
    <section className="MaintenanceTickets mt-8 md:mt-10">
      <div className="container-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap mb-6">
          <Text
            tag="h3"
            field={fields?.title}
            className="text-heading-2 font-normal mb-6 lg:mb-0 order-1"
          />
          <div className="order-2 lg:order-3 w-full">
            {serviceRequestList.length == 0 && (
              <div className="w-full mb-8 lg:mt-8 lg:table lg:rounded-t-3xl lg:bg-silver-chalice-100 lg:overflow-hidden">
                <div className="hidden lg:table-row bg-silver-chalice-300">
                  <div className="lg:table-cell lg:p-6 lg:align-middle">
                    <div className="h-4 bg-silver-chalice-400 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                  </div>
                  <div className="lg:table-cell lg:p-6 lg:align-middle">
                    <div className="h-4 bg-silver-chalice-400 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                  </div>
                  <div className="lg:table-cell lg:p-6 lg:align-middle">
                    <div className="h-4 bg-silver-chalice-400 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                  </div>
                  <div className="lg:table-cell lg:p-6 lg:align-middle">
                    <div className="h-4 bg-silver-chalice-400 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                  </div>
                  <div className="lg:table-cell lg:p-6 lg:align-middle lg:last:table-cell">
                    <div className="h-4 bg-silver-chalice-400 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                  </div>
                  <div className="lg:table-cell lg:p-6 lg:align-middle lg:last:table-cell"></div>
                </div>

                <div className="flex flex-col gap-3 lg:table-row-group">
                  <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-silver-chalice-100 lg:table-row lg:bg-transparent lg:p-0">
                    <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
                      <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                    </div>

                    <div className="order-1 flex-[1_1_45%] lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
                      <div className="h-5 max-w-18.75 rounded-full bg-silver-chalice-200 lg:h-9 lg:max-w-none lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                    </div>

                    <div className="order-3 flex-[1_1_45%] text-left lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
                      <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                      <div className="mt-1 h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                    </div>

                    <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
                      <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                    </div>
                    <div className="hidden lg:table-cell lg:p-6 lg:align-middle">
                      <div className="h-2.5 rounded-lg bg-silver-chalice-200 lg:h-4 lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                    </div>

                    <div className="order-2 flex-[1_1_45%] text-right lg:table-cell lg:p-6 lg:align-middle lg:order-0 lg:flex-none">
                      <div className="h-2.5 w-4.5 inline-block rounded-lg bg-silver-chalice-200 lg:h-9 lg:w-full lg:block lg:bg-silver-chalice-400 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                    </div>

                    <div className="flex flex-col gap-1 order-4 flex-[1_1_45%] text-left lg:hidden">
                      <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                      <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                      <div className="h-2.5 rounded-lg bg-silver-chalice-200 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {serviceRequestList.length != 0 && (
              <div className="mb-4 lg:mt-8 lg:mb-0 rounded-xl lg:rounded-t-3xl overflow-hidden">
                <div className="table w-full">
                  <div className="text-body-xs lg:text-body font-normal bg-lilac-100 hidden lg:table-header-group">
                    <div className="table-row">
                      <div className="table-cell p-4">SR ID</div>
                      <div className="table-cell p-4">Status</div>
                      <div className="table-cell p-4">Category</div>
                      <div className="table-cell p-4">Raised</div>
                      <div className="table-cell p-4">Scheduled/Closed</div>
                      <div className="table-cell p-4"></div>
                    </div>
                  </div>
                  <div className="text-body-xs lg:text-body font-light flex flex-col gap-3 lg:table-row-group">
                    {serviceRequestList?.map((item: any, index: any) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl border border-solid border-lilac-200 flex flex-wrap gap-3 lg:table-row lg:border-none lg:rounded-none"
                      >
                        <div className="lg:p-4 hidden lg:table-cell lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200">
                          #{item.WO_Code}
                        </div>
                        <div className="lg:p-4 lg:table-cell lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200 order-1 flex-[1_1_45%]">
                          <span
                            className={`font-light text-body-sm w-21 lg:w-25 lg:h-9 h-4.5 flex justify-center items-center rounded-full border border-solid
                            ${
                              item.Status.toLowerCase().replace(/ /g, '-') == 'open'
                                ? 'text-lilac-800 bg-lilac-100 border-lilac-500'
                                : ''
                            }
                            ${
                              item.Status.toLowerCase().replace(/ /g, '-') == 'closed'
                                ? 'text-success-900 bg-success-50 border-success-500'
                                : ''
                            }
                            ${
                              item.Status.toLowerCase().replace(/ /g, '-') == 'in-progress'
                                ? 'text-warning-900 bg-warning-50 border-warning-500'
                                : ''
                            }
                            ${
                              item.Status.toLowerCase().replace(/ /g, '-') == 'cancelled' ||
                              item.Status.toLowerCase().replace(/ /g, '-') == 'canceled'
                                ? 'text-danger-900 bg-danger-50 border-danger-500'
                                : ''
                            }
                            `}
                          >
                            {item.Status}
                          </span>
                        </div>
                        <div className="lg:p-4 lg:table-cell lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200 order-3 flex-[1_1_45%] text-start">
                          <span className="block font-medium">{item.Category}</span>
                          {item.Sub_Category}
                        </div>
                        <div className="lg:p-4 hidden lg:table-cell lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200">
                          {formatDate(item.Call_Date, '2-digit')}
                        </div>
                        <div className="lg:p-4 hidden lg:table-cell lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200">
                          {item.Status === 'Closed' || item.Status === 'Canceled' ? (
                            <div>
                              {item.Completion_Date == null
                                ? 'NA'
                                : formatDate(item.Completion_Date, '2-digit')}
                            </div>
                          ) : (
                            <div>
                              {item.Preferred_Date == null && item.Preferred_TimeSlot == null ? (
                                <>Awaiting</>
                              ) : (
                                <>
                                  {formatDate(item.Preferred_Date, '2-digit')}
                                  <br />
                                  {item.Preferred_TimeSlot}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="lg:p-4 lg:table-cell lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200 order-2 flex-[1_1_45%] text-end">
                          <Link
                            href={`/services/details?servicetype=${
                              item.ServiceRequestType
                            }&id=${item.WO_Code.trim()}&hp=true`}
                            className="text-body-sm font-normal text-navy-500 hover:text-lilac-300"
                          >
                            <span className="lg:block font-medium">
                              <ArrowRightIcon
                                width={16}
                                height={16}
                                className="inline-block size-4 lg:size-7"
                              />
                            </span>
                          </Link>
                        </div>
                        <div className="lg:p-4 lg:hidden lg:align-middle lg:border-b lg:border-solid lg:border-lilac-200 order-4 flex-[1_1_45%] text-start">
                          <div className="mb-1.5">
                            Ticket no.{' '}
                            <span className="inline-block font-medium">#{item.WO_Code}</span>
                          </div>
                          <div className="mb-1.5">
                            Raised on:{' '}
                            <span className="inline-block font-medium">
                              {formatDate(item.Call_Date, '2-digit')}
                            </span>
                          </div>
                          {item.Status === 'Closed' || item.Status === 'Canceled' ? (
                            <div className="mb-1.5">
                              {item.Status === 'Closed' && (
                                <span className="inline-block font-regular">Closed on:&nbsp;</span>
                              )}
                              {item.Status === 'Canceled' && (
                                <span className="inline-block font-regular">
                                  Cancelled on:&nbsp;
                                </span>
                              )}
                              <span>
                                {item.Completion_Date == null
                                  ? 'NA'
                                  : formatDate(item.Completion_Date, '2-digit')}
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="mb-1.5">
                                <span className="inline-block font-regular">
                                  Scheduled on:&nbsp;
                                </span>
                                <span className="inline-block">
                                  {item.Preferred_Date == null && item.Preferred_TimeSlot == null
                                    ? 'Awaiting'
                                    : formatDate(item.Preferred_Date, '2-digit')}
                                </span>
                              </div>
                              {!(
                                item.Preferred_Date == null && item.Preferred_TimeSlot == null
                              ) && (
                                <div className="mb-1.5">
                                  <span className="inline-block font-regular">Time:&nbsp;</span>
                                  <span className="inline-block">{item.Preferred_TimeSlot}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <CustomLink
            field={fields?.viewAllLink}
            className="btn btn-primary w-full md:w-68.75 px-0 h-11 md:h-15 uppercase order-3 lg:order-2"
          />
        </div>
      </div>
    </section>
  );
}
