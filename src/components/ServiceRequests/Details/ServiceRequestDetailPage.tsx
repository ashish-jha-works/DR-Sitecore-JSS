import { Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from 'next/link';
import ImageGallery from 'src/components/common/ImageGallery';
import { useUIStore } from 'src/store/useUIStore';

import ArrowLeft from 'assets/icons/ArrowLeft';
import CalendarIcon from 'assets/icons/CalendarIcon';
import CommunityIcon from 'assets/icons/CommunityIcon';
import DocumentIcon from 'assets/icons/DocumentIcon';
import MaintenanceIcon from 'assets/icons/MaintenanceIcon';
import CancelSRModal from 'components/modals/CancelSRModal';
import CancelSRSuccessModal from 'components/modals/CancelSRSuccessModal';
import FollowUpSRModal from 'components/modals/FollowUpSRModal';
import FollowUpSRSuccessModal from 'components/modals/FollowUpSRSuccessModal';
import { formatDateTime, normalizePhone } from 'lib/utils/helper';
import { formatDate } from 'src/utils/formatDate';

import RescheduleServiceRequestModal from '../Create/modals/RescheduleServiceRequestModal';
import ServiceRequestDetailPageSkeleton from './ServiceRequestDetailPageSkeleton';
import { useServiceRequestDetailData } from './useServiceRequestDetailData';
import { useState } from 'react';
import { CreateServiceSuccessModal } from '../Create/modals/CreateServiceSuccessModal';
import CreateServiceErrorModal from '../Create/modals/CreateServiceErrorModal';
import ServiceRequestAddress from '../ServiceRequestAddress';
import InfoMessage from 'components/InfoMessage';
import CircleTickIcon from 'assets/icons/CircleTickIcon';

export default function ServiceRequestDetailPage({ rendering }: any) {
  const openModal = useUIStore((state) => state.openModal);
  const {
    serviceRequestTypeParam,
    serviceRequestID,
    serviceRequestType,
    serviceRequestDetails,
    serviceRequestAttachments,
    loadingFollowUps,
    showFollowupComments,
    followupComments,
    isDetailsLoading,
    isLoadingAttachments,
    referrer,
    tenantDetails,

    getDisabledStatus,
    setLoadingFollowUps,
    setShowFollowupComments,
    cancelServiceRequest,
    createSRFollowUP,
  } = useServiceRequestDetailData();

  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [isRescheduled, setIsRescheduled] = useState(false);

  const handleRescheduleClick = () => {
    setOpenRescheduleModal(true);
    openModal('reschedule-service-request-modal');
  };

  return (
    <div className="ServiceRequestDetailPage bg-silver-chalice-50">
      <div className="container-sm py-5 md:py-6 flex flex-col gap-5 md:gap-6">
        <Link
          href={'/service-requests'}
          className="text-body-sm font-medium flex gap-4 text-navy-500 uppercase items-center"
        >
          <ArrowLeft className="size-5 md:size-7" />
          back to service requests
        </Link>
        <div className="bg-white-pure border border-lilac-300 rounded-xl p-5 md:p-6 flex flex-col">
          {serviceRequestType === 1 && (
            <h3 className="flex gap-2 md:gap-4 text-heading-3 font-normal items-center">
              <span>
                <MaintenanceIcon className="size-7 md:size-8 text-lilac-500" />
              </span>
              Maintenance request details
            </h3>
          )}
          {serviceRequestType === 2 && (
            <h3 className="flex gap-2 md:gap-4 text-heading-3 font-normal items-center">
              <span>
                <CommunityIcon className="size-7 md:size-8 text-lilac-500" />
              </span>
              Community care request details
            </h3>
          )}
          {serviceRequestType === 3 && (
            <h3 className="flex gap-2 md:gap-4 text-heading-3 font-normal items-center">
              <span>
                <DocumentIcon className="size-7 md:size-8 text-lilac-500" />
              </span>
              Leasing request details
            </h3>
          )}
          {isDetailsLoading || isLoadingAttachments ? (
            <ServiceRequestDetailPageSkeleton />
          ) : (
            serviceRequestDetails.Status != undefined && (
              <>
                {referrer == 'cr' && (
                  <div className="text-body font-light pt-2 lg:pt-3">
                    Your request has been submitted. Please review the details below.
                  </div>
                )}
                <ul>
                  <li className="py-2 lg:py-3">
                    <span
                      className={`font-light text-body-sm min-w-20 w-fit lg:h-8.5 h-8 flex justify-center items-center rounded-full border border-solid px-5
                      ${
                        serviceRequestDetails.Status.toLowerCase().replace(/ /g, '-') == 'open' &&
                        'text-lilac-800 bg-lilac-100 border-lilac-500'
                      }
                      ${
                        serviceRequestDetails.Status.toLowerCase().replace(/ /g, '-') == 'closed' &&
                        'text-success-900 bg-success-50 border-success-500'
                      }
                      ${
                        serviceRequestDetails.Status.toLowerCase().replace(/ /g, '-') ==
                          'in-progress' && 'text-warning-900 bg-warning-50 border-warning-500'
                      }
                      ${
                        serviceRequestDetails.Status.toLowerCase().replace(/ /g, '-') ==
                          'cancelled' ||
                        (serviceRequestDetails.Status.toLowerCase().replace(/ /g, '-') ==
                          'canceled' &&
                          'text-danger-900 bg-danger-50 border-danger-500')
                      }
                    `}
                    >
                      {serviceRequestDetails.Status}
                    </span>
                  </li>
                  <li className="pt-4 pb-2 lg:pt-6 lg:pb-3 border-t border-solid border-lilac-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
                      <div className="col-span-1 flex flex-col gap-2">
                        <p className="text-body font-light text-navy-500">
                          SR ID: <span className="font-medium">{serviceRequestID}</span>
                        </p>
                        <p className="text-body font-light text-navy-500">
                          Your contact:{' '}
                          <span className="font-medium">
                            {normalizePhone(serviceRequestDetails.Caller_Phone)}
                          </span>
                        </p>
                      </div>
                      <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                        <p className="text-body font-light text-navy-500">
                          Raised:{' '}
                          <span className="font-medium">
                            {formatDate(serviceRequestDetails.Call_Date, '2-digit')}
                          </span>
                        </p>
                        {serviceRequestTypeParam == 'maintenance' && (
                          <p className="text-body font-light text-navy-500">
                            {serviceRequestDetails.Status == 'Canceled' ||
                            serviceRequestDetails.Status == 'Closed' ? (
                              <>
                                Closed On:{' '}
                                <span className="font-medium">
                                  {serviceRequestDetails.Completion_Date != null
                                    ? formatDateTime(serviceRequestDetails.Completion_Date)
                                    : '-'}
                                </span>
                              </>
                            ) : (
                              <>
                                Scheduled:{' '}
                                <span className="font-medium">
                                  {serviceRequestDetails.Preferred_Date != null ? (
                                    <>
                                      {formatDateTime(serviceRequestDetails.Preferred_Date)}
                                      {serviceRequestDetails.Preferred_TimeSlot &&
                                        `, ${serviceRequestDetails.Preferred_TimeSlot}`}
                                    </>
                                  ) : (
                                    'Awaiting'
                                  )}
                                </span>
                              </>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                  <li className="pt-4 pb-2 lg:pt-6 lg:pb-3 border-t border-solid border-lilac-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      <div className="col-span-1 flex flex-col gap-2">
                        <p className="text-body font-medium text-navy-500">Service category</p>
                        <p className="text-body font-light text-navy-500">
                          {serviceRequestDetails.Category}
                        </p>
                        {serviceRequestTypeParam != 'leasing' && (
                          <p className="text-body font-light text-navy-500">
                            {serviceRequestDetails.Sub_Category}
                          </p>
                        )}
                      </div>
                      <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                        <ServiceRequestAddress
                          serviceRequestType={serviceRequestType}
                          serviceRequestDetails={serviceRequestDetails}
                          tenantDetails={tenantDetails}
                        />
                      </div>
                    </div>
                  </li>
                  <li
                    className={`${
                      isRescheduled ? 'pt-0!' : ''
                    } pt-4 pb-2 lg:pt-6 lg:pb-3 border-t border-solid border-lilac-300`}
                  >
                    {isRescheduled ? (
                      <InfoMessage
                        IconComponent={CircleTickIcon}
                        status="success"
                        className="my-4 md:my-6"
                      >
                        <p className="text-body font-light">
                          We have received your rescheduling request and will contact you to confirm
                          your revised date and time.
                        </p>
                      </InfoMessage>
                    ) : null}
                    <p className="text-body font-medium text-navy-500 mb-2">Issue description</p>
                    <p className="text-body font-light text-navy-500">
                      {serviceRequestDetails.Problem_Description}
                    </p>
                    {serviceRequestAttachments.length > 0 && (
                      <div className="mt-4 lg:mt-6 mb-6">
                        <ImageGallery images={serviceRequestAttachments} />
                      </div>
                    )}
                  </li>
                  {serviceRequestTypeParam == 'maintenance' &&
                    serviceRequestDetails.Status != 'Canceled' &&
                    serviceRequestDetails.Status != 'Closed' && (
                      <li className="pt-4 pb-2 lg:pt-6 lg:pb-3 border-t border-solid border-lilac-300">
                        <button
                          className="text-body font-medium text-sky-700 underline uppercase outline-0 cursor-pointer"
                          onClick={() => {
                            setLoadingFollowUps(true);
                            setShowFollowupComments(!showFollowupComments);
                          }}
                        >
                          {showFollowupComments
                            ? 'HIDE FOLLOW-UP COMMENTS'
                            : 'SHOW FOLLOW-UP COMMENTS'}
                        </button>
                        {showFollowupComments && (
                          <ul className="mt-3">
                            {(followupComments?.length ?? 0) === 0 && !loadingFollowUps && (
                              <li className="mt-2">
                                <p className="text-body font-normal text-navy-500">
                                  Sorry, there are no follow-up comments.
                                </p>
                              </li>
                            )}
                            {followupComments?.map((item: any, index: number) => (
                              <li key={index} className="mt-2">
                                <p className="text-body font-normal text-navy-500">
                                  <span className="font-light">{formatDate(item.CREATEDATE)}</span>:{' '}
                                  {item.DESCRIPTION}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )}
                  {serviceRequestTypeParam == 'maintenance' &&
                    serviceRequestDetails.Status != 'Canceled' &&
                    serviceRequestDetails.Status != 'Closed' &&
                    !isRescheduled && (
                      <li className="pt-4 pb-2 lg:pt-6 lg:pb-3 border-t border-solid border-lilac-300">
                        <button
                          className={`btn btn-secondary w-full md:w-68.75 px-0 h-11 md:h-15 uppercase ${
                            getDisabledStatus('RESCHEDULE') && 'disabled'
                          }`}
                          onClick={handleRescheduleClick}
                        >
                          <CalendarIcon />
                          Reschedule
                        </button>
                        {getDisabledStatus('RESCHEDULE') && (
                          <p className="text-body-xs font-light text-navy-500 mt-2">
                            Rescheduling not allowed for this request.
                          </p>
                        )}
                      </li>
                    )}
                  {serviceRequestTypeParam == 'maintenance' &&
                    (serviceRequestDetails.Status == 'Canceled' ||
                      serviceRequestDetails.Status == 'Closed') && (
                      <li className="py-4 lg:py-6 border-t border-solid border-lilac-300">
                        <Link
                          href={{
                            pathname: `/service-requests/reopen`,
                            query: {
                              serviceRequestType: serviceRequestTypeParam,
                              id: serviceRequestID?.trim(),
                            },
                          }}
                          className={`btn btn-primary btn-sm ${
                            getDisabledStatus('REOPEN') && 'disabled'
                          }`}
                        >
                          REOPEN
                        </Link>
                      </li>
                    )}
                </ul>
              </>
            )
          )}
        </div>
        {serviceRequestTypeParam == 'maintenance' &&
          serviceRequestDetails.Status != 'Canceled' &&
          serviceRequestDetails.Status != 'Closed' &&
          (isRescheduled ? (
            <div className="flex flex-col md:flex-row md:justify-end gap-4 md:gap-6">
              <Link
                href="/service-requests"
                className="btn btn-primary w-full md:w-68.75 px-0 h-11 md:h-15 uppercase"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:justify-end gap-4 md:gap-6">
              <div className="grow md:max-w-68.5">
                <button
                  className={`btn btn-secondary w-full md:w-68.75 px-0 h-11 md:h-15 uppercase ${
                    !serviceRequestDetails.isCancellable && 'disabled'
                  }`}
                  onClick={() => openModal('cancel-sr-modal')}
                >
                  Cancel Request
                </button>
                {!serviceRequestDetails.isCancellable && (
                  <p className="text-body-xs font-light text-navy-500 mt-2">
                    Cancellation not allowed for this request.
                  </p>
                )}
              </div>
              <CancelSRModal cancelServiceRequest={cancelServiceRequest} />
              <CancelSRSuccessModal id={serviceRequestID} />

              <div className="grow md:max-w-68.5">
                <button
                  className={`btn btn-primary w-full md:w-68.75 px-0 h-11 md:h-15 uppercase ${
                    getDisabledStatus('FOLLOW UP') && 'disabled'
                  }`}
                  onClick={() => openModal('followup-sr-modal')}
                >
                  Follow Up
                </button>
                {getDisabledStatus('FOLLOW UP') && (
                  <p className="text-body-xs font-light text-navy-500 mt-2">
                    Follow-up option is not available as you have recently followed-up, or request
                    is still in progress.
                  </p>
                )}
              </div>
              <FollowUpSRModal createSRFollowUP={createSRFollowUP} />
              <FollowUpSRSuccessModal />
            </div>
          ))}
        <Placeholder name="quick-links" rendering={rendering} />
      </div>

      {/* Reschedule Modal */}
      {openRescheduleModal ? (
        <RescheduleServiceRequestModal
          templateCode={serviceRequestDetails?.Template_Code?.trim()}
          community={serviceRequestDetails?.Maximo_Site_ID}
          woNum={serviceRequestDetails.Maximo_ID}
          serviceRequestID={serviceRequestID}
          setIsRescheduled={setIsRescheduled}
        />
      ) : null}

      <CreateServiceSuccessModal serviceRequestId={serviceRequestID} isTypeReschedule={true} />
      <CreateServiceErrorModal serviceRequestId={serviceRequestID} isTypeReschedule={true} />
    </div>
  );
}
