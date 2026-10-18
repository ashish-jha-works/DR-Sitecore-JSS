import { SERVICE_REQUEST_TYPE } from 'lib/common/constants/common';

import {
  getCommunityCareAddress,
  getServiceRequestAddressLines,
} from './utils/serviceRequestAddress';

type ServiceRequestAddressProps = {
  serviceRequestType: number | string;
  serviceRequestDetails?: Record<string, string | null | undefined> | null;
  tenantDetails?: Record<string, string | null | undefined> | null;
};

export default function ServiceRequestAddress({
  serviceRequestType,
  serviceRequestDetails,
  tenantDetails,
}: ServiceRequestAddressProps) {
  const isCommunity = serviceRequestType === SERVICE_REQUEST_TYPE.COMMUNITY;
  const communityAddress = isCommunity ? getCommunityCareAddress(serviceRequestDetails) : null;

  if (isCommunity && communityAddress) {
    return (
      <>
        <p className="text-body font-medium text-navy-500">Address</p>
        <p className="text-body font-light text-navy-500">{communityAddress}</p>
      </>
    );
  }

  const { unitLine, propertyLine, cityLine } = getServiceRequestAddressLines(
    tenantDetails,
    serviceRequestDetails
  );

  const hasAddress = unitLine || propertyLine || cityLine;

  return (
    <>
      <p className="text-body font-medium text-navy-500">Address</p>
      {hasAddress ? (
        <>
          {unitLine ? <p className="text-body font-light text-navy-500">{unitLine}</p> : null}
          {propertyLine ? (
            <p className="text-body font-light text-navy-500">{propertyLine}</p>
          ) : null}
          {cityLine ? <p className="text-body font-light text-navy-500">{cityLine}</p> : null}
        </>
      ) : (
        <p className="text-body font-light text-navy-500">-</p>
      )}
    </>
  );
}
