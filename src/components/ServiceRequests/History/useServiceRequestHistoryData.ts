'use client';

import { useEffect, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';
import { useSearchParams } from 'next/navigation';

export const useServiceRequestHistoryData = () => {
  const { tCode } = useUserStore();

  const searchParams = useSearchParams();
  const serviceRequestTypeParam = searchParams.get('serviceRequestType');
  const serviceTypeMap: Record<string, number> = {
    maintenance: 1,
    community: 2,
    leasing: 3,
  };

  const serviceRequestType = serviceTypeMap[serviceRequestTypeParam || ''] || 1;

  const [requests, setRequests] = useState<any[]>([]);
  const [requestsEmpty, setRequestsEmpty] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const itemsPerPage = 10;
  const [requestCurrentPage, setRequestCurrentPage] = useState(1);
  const currentRequests = requests.slice(
    requestCurrentPage * itemsPerPage - itemsPerPage,
    requestCurrentPage * itemsPerPage
  );

  const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null);
  /* ---------------- API ---------------- */

  const { mutate: loadRequests } = useApiMutation<any, any>(
    `/Yardi/FetchServiceRequest?tcode=${tCode}&serviceRequestPageType=2&serviceRequestType=${serviceRequestType}`,
    'GET',
    false
  );

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (tCode) {
      loadRequests(null, {
        onSuccess: (response) => {
          setRequests(response?.ServiceRequests);
          setRequestsEmpty(response?.ServiceRequests?.length === 0);
          setIsLoading(false);
        },
        onError: () => {},
      });
    }
  }, [tCode, loadRequests]);

  return {
    serviceRequestTypeParam,
    serviceRequestType,
    requests,
    requestsEmpty,
    currentRequests,
    requestCurrentPage,
    itemsPerPage,
    openTooltipIndex,
    isLoading,
    setOpenTooltipIndex,
    setRequestCurrentPage,
  };
};
