import Link from 'next/link';
import ArrowLeft from 'assets/icons/ArrowLeft';
import CommunityIcon from 'assets/icons/CommunityIcon';
import DocumentIcon from 'assets/icons/DocumentIcon';
import MaintenanceIcon from 'assets/icons/MaintenanceIcon';
import { formatDateTime, normalizePhone } from 'lib/utils/helper';
import { formatDate } from 'src/utils/formatDate';
import { SERVICE_REQUEST_TYPE } from 'lib/common/constants/common';
import { Textarea } from 'components/common/Textarea';
import UploadImage from 'components/common/UploadImage';
import ServiceRequestAddress from '../ServiceRequestAddress';
import ReopenServiceRequestSkeleton from './ReopenServiceRequestSkeleton';

export default function ReopenServiceRequest({
  serviceRequestID,
  serviceRequestType,
  serviceRequestDetails,
  tenantDetails,
  isDetailsLoading,
  issue,
  setIssue,
  selectedFiles,
  setSelectedFiles,
}: any) {
  return (
    <div className="ReopenServiceRequest bg-silver-chalice-50">
      <div className="container-sm py-5 md:py-6 flex flex-col gap-5 md:gap-6">
        <Link
          href={'/service-requests'}
          className="text-body-sm font-medium flex gap-4 text-navy-500 uppercase items-center"
        >
          <ArrowLeft className="size-5 md:size-7" />
          back to service requests
        </Link>
        <div className="bg-white-pure border border-lilac-300 rounded-xl p-5 md:p-6 flex flex-col">
          {serviceRequestType === SERVICE_REQUEST_TYPE.MAINTENANCE && (
            <h3 className="flex gap-2 md:gap-4 text-heading-3 font-normal items-center">
              <span>
                <MaintenanceIcon className="size-7 md:size-8 text-lilac-500" />
              </span>
              Maintenance request details
            </h3>
          )}
          {serviceRequestType === SERVICE_REQUEST_TYPE.COMMUNITY && (
            <h3 className="flex gap-2 md:gap-4 text-heading-3 font-normal items-center">
              <span>
                <CommunityIcon className="size-7 md:size-8 text-lilac-500" />
              </span>
              Community care request details
            </h3>
          )}
          {serviceRequestType === SERVICE_REQUEST_TYPE.LEASING && (
            <h3 className="flex gap-2 md:gap-4 text-heading-3 font-normal items-center">
              <span>
                <DocumentIcon className="size-7 md:size-8 text-lilac-500" />
              </span>
              Leasing request details
            </h3>
          )}
          {isDetailsLoading ? (
            <ReopenServiceRequestSkeleton />
          ) : (
            serviceRequestDetails.Status != undefined && (
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
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-1 lg:gap-2">
                      <p className="text-body font-light text-navy-500">
                        Raised:{' '}
                        <span className="font-medium">
                          {formatDate(serviceRequestDetails.Call_Date, '2-digit')}
                        </span>
                      </p>
                      {serviceRequestType == SERVICE_REQUEST_TYPE.MAINTENANCE && (
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
                      {serviceRequestType != SERVICE_REQUEST_TYPE.LEASING && (
                        <p className="text-body font-light text-navy-500">
                          {serviceRequestDetails.Sub_Category}
                        </p>
                      )}
                    </div>
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-1 lg:gap-2">
                      <ServiceRequestAddress
                        serviceRequestType={serviceRequestType}
                        serviceRequestDetails={serviceRequestDetails}
                        tenantDetails={tenantDetails}
                      />
                    </div>
                  </div>
                </li>
                <div className="form-group pt-4 pb-2 lg:pt-6 lg:pb-3 border-t border-solid border-lilac-300">
                  <Textarea
                    label="Comments for reopening*"
                    containerClassName="text-end"
                    placeholder="Please describe the issue in detail to help us understand it better."
                    value={issue}
                    onChange={(e) => {
                      setIssue(e.target.value);
                    }}
                    maxLength={1500}
                    helperText={`Description within ${1500 - issue.length} characters`}
                    className="min-h-12! md:h-12"
                    labelClassName="text-body font-medium text-start"
                  />
                </div>
                {serviceRequestType !== SERVICE_REQUEST_TYPE.LEASING ? (
                  <UploadImage
                    label="Upload images"
                    labelClassName="text-body! font-medium"
                    helperText=" Images must be in JPG or PNG format. You may upload up to 3 images, with each image not exceeding 5 MB."
                    accept={['.jpg', '.png']}
                    files={selectedFiles}
                    onChange={setSelectedFiles}
                  />
                ) : null}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
}
