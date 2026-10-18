'use client';

import { useEffect, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';

const isNotFoundError = (error: any) => error?.response?.status === 404;

export const useServiceRequestsPage = () => {
  const { tCode, tenant_name, Community } = useUserStore();
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [communityRequests, setCommunityRequests] = useState<any[]>([]);
  const [leasingRequests, setLeasingRequests] = useState<any[]>([]);
  const [maintenanceError, setMaintenanceError] = useState<boolean>(false);
  const [communityError, setCommunityError] = useState<boolean>(false);
  const [leasingError, setLeasingError] = useState<boolean>(false);
  const [maintenanceRequestsEmpty, setMaintenanceRequestsEmpty] = useState<boolean>(false);
  const [communityRequestsEmpty, setCommunityRequestsEmpty] = useState<boolean>(false);
  const [leasingRequestsEmpty, setLeasingRequestsEmpty] = useState<boolean>(false);
  const itemsPerPage = 10;
  const [maintenanceCurrentPage, setMaintenanceCurrentPage] = useState(1);
  const currentMaintenanceItems = maintenanceRequests.slice(
    maintenanceCurrentPage * itemsPerPage - itemsPerPage,
    maintenanceCurrentPage * itemsPerPage
  );

  const [communityCurrentPage, setCommunityCurrentPage] = useState(1);
  const currentCommunityItems = communityRequests.slice(
    communityCurrentPage * itemsPerPage - itemsPerPage,
    communityCurrentPage * itemsPerPage
  );

  const [leasingCurrentPage, setLeasingCurrentPage] = useState(1);
  const currentLeasingItems = leasingRequests.slice(
    leasingCurrentPage * itemsPerPage - itemsPerPage,
    leasingCurrentPage * itemsPerPage
  );
  /* ---------------- API ---------------- */

  const { mutate: loadMaintenanceRequests, isPending: loadingMaintenanceRequest } = useApiMutation<
    any,
    any
  >(
    `/Yardi/FetchServiceRequest?tcode=${tCode}&serviceRequestPageType=1&serviceRequestType=1`,
    'GET',
    false
  );

  const { mutate: loadCommunityRequests, isPending: loadingCommunityRequest } = useApiMutation<
    any,
    any
  >(
    `/Yardi/FetchServiceRequest?tcode=${tCode}&serviceRequestPageType=1&serviceRequestType=2`,
    'GET',
    false
  );

  const { mutate: loadLeasingRequests, isPending: loadingLeasingRequest } = useApiMutation<
    any,
    any
  >(
    `/Yardi/FetchServiceRequest?tcode=${tCode}&serviceRequestPageType=1&serviceRequestType=3`,
    'GET',
    false
  );

  const handleFetchSuccess = (
    response: any,
    setRequests: (value: any[]) => void,
    setEmpty: (value: boolean) => void,
    setError: (value: boolean) => void
  ) => {
    setError(false);
    const requests = response?.ServiceRequests ?? [];
    setRequests(requests);
    setEmpty(requests.length === 0);
  };

  const handleFetchError = (
    error: any,
    setRequests: (value: any[]) => void,
    setEmpty: (value: boolean) => void,
    setError: (value: boolean) => void
  ) => {
    if (isNotFoundError(error)) {
      setError(false);
      setRequests([]);
      setEmpty(true);
      return;
    }

    setEmpty(false);
    setError(true);
  };

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (tCode) {
      loadMaintenanceRequests(null, {
        onSuccess: (response) =>
          handleFetchSuccess(
            response,
            setMaintenanceRequests,
            setMaintenanceRequestsEmpty,
            setMaintenanceError
          ),
        onError: (error) =>
          handleFetchError(
            error,
            setMaintenanceRequests,
            setMaintenanceRequestsEmpty,
            setMaintenanceError
          ),
      });
    }
  }, [tCode, loadMaintenanceRequests]);

  useEffect(() => {
    if (tCode) {
      loadCommunityRequests(null, {
        onSuccess: (response) =>
          handleFetchSuccess(
            response,
            setCommunityRequests,
            setCommunityRequestsEmpty,
            setCommunityError
          ),
        onError: (error) =>
          handleFetchError(
            error,
            setCommunityRequests,
            setCommunityRequestsEmpty,
            setCommunityError
          ),
      });
    }
  }, [tCode, loadCommunityRequests]);

  useEffect(() => {
    if (tCode) {
      loadLeasingRequests(null, {
        onSuccess: (response) =>
          handleFetchSuccess(
            response,
            setLeasingRequests,
            setLeasingRequestsEmpty,
            setLeasingError
          ),
        onError: (error) =>
          handleFetchError(error, setLeasingRequests, setLeasingRequestsEmpty, setLeasingError),
      });
    }
  }, [tCode, loadLeasingRequests]);

  return {
    tCode,
    tenant_name,
    Community,
    maintenanceRequests,
    loadingMaintenanceRequest,

    communityRequests,
    loadingCommunityRequest,

    leasingRequests,
    loadingLeasingRequest,

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

    maintenanceError,
    communityError,
    leasingError,
    maintenanceRequestsEmpty,
    communityRequestsEmpty,
    leasingRequestsEmpty,
  };
};
