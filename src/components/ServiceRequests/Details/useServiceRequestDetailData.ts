'use client';

import { useEffect, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';
import { useSearchParams } from 'next/navigation';
import { useUIStore } from 'src/store/useUIStore';
import { useServiceRequestTenantDetails } from '../useServiceRequestTenantDetails';
import { normalizeCommunityServiceRequestDetails } from '../utils/serviceRequestAddress';

export const useServiceRequestDetailData = () => {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();

  const searchParams = useSearchParams();
  const serviceRequestTypeParam = searchParams.get('serviceRequestType');
  const serviceRequestID = searchParams.get('id');
  const referrer = searchParams.get('referrer');
  const serviceTypeMap: Record<string, number> = {
    maintenance: 1,
    community: 2,
    leasing: 3,
  };

  const [serviceRequestDetails, setServiceRequestDetails] = useState<any>({});
  const [serviceRequestAttachments, setServiceRequestAttachments] = useState<any>([]);
  const [loadingFollowUps, setLoadingFollowUps] = useState<boolean>(false);
  const [followupComments, setFollowupComments] = useState<any>([]);
  const [showFollowupComments, setShowFollowupComments] = useState<boolean>(false);

  const serviceRequestType = serviceTypeMap[serviceRequestTypeParam || ''] || 1;
  const tenantDetails = useServiceRequestTenantDetails(tCode);

  /* ---------------- API ---------------- */

  const { mutate: loadDetails, isPending: isDetailsLoading } = useApiMutation<any, any>(
    `/ServiceRequest/${serviceRequestID}?tCode=${tCode}`,
    'GET',
    false
  );

  const { mutate: loadAttachments, isPending: isLoadingAttachments } = useApiMutation<any, any>(
    (requestBody) =>
      `/ServiceRequest/Attachments/${requestBody.WO_Code}/${tCode}/${requestBody.Maximo_ID}?serviceRequestType=${serviceRequestType}`,
    'GET',
    false
  );

  const { mutate: loadFollowUps } = useApiMutation<any, any>(
    `/ServiceRequest/MaximoMemo/${serviceRequestDetails.Maximo_ID}`,
    'GET',
    true
  );

  const { mutate: cancelSR } = useApiMutation<any, any>(
    `/ServiceRequest/Cancel/${serviceRequestID}?maximoID=${
      serviceRequestDetails.Maximo_ID
    }&templateCode=${serviceRequestDetails.Template_Code?.trim()}&maximoSiteId=${
      serviceRequestDetails.Maximo_Site_ID
    }`,
    'PUT',
    true
  );

  const { mutate: createFollowUP } = useApiMutation<any, any>(
    `/ServiceRequest/CreateFollowUp`,
    'POST',
    true
  );

  /* ---------------- Handlers ---------------- */

  const getDisabledStatus = (type: string) => {
    return !serviceRequestDetails?.ViewMore?.includes(type);
  };

  const cancelServiceRequest = () => {
    cancelSR(null, {
      onSuccess: (response) => {
        if (response.CancelSR) {
          openModal('cancel-sr-success-modal');
        }
      },
    });
  };

  const createSRFollowUP = (comment: string) => {
    const requestBody: any = {
      SITEID: serviceRequestDetails.Maximo_Site_ID,
      WONUM: serviceRequestDetails.Maximo_ID,
      DESCRIPTION: comment,
    };
    createFollowUP(requestBody, {
      onSuccess: (response) => {
        if (response.ReScheduleSR) {
          openModal('followUp-sr-success-modal');
        }
      },
    });
  };

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (!tCode || !serviceRequestID) return;

    loadDetails(null, {
      onSuccess: (response) => {
        const serviceRequest =
          serviceRequestType === 2
            ? normalizeCommunityServiceRequestDetails(response.ServiceRequest)
            : response.ServiceRequest;

        setServiceRequestDetails(serviceRequest);

        const woCode = response?.ServiceRequest?.WO_Code;
        if (!woCode) return;

        const maximoId = response?.ServiceRequest?.Maximo_ID || 0;

        loadAttachments(
          {
            WO_Code: woCode,
            Maximo_ID: maximoId,
          },
          {
            onSuccess: (response) => {
              if (!response?.Attachments?.length) {
                setServiceRequestAttachments([]);
                return;
              }

              const attachments = response.Attachments.map((a: any) => {
                const ext = a?.File_Name?.split('.').pop()?.toLowerCase();

                const mimeMap: Record<string, string> = {
                  pdf: 'application/pdf',
                  jpeg: 'image/jpeg',
                  jpg: 'image/jpeg',
                  bmp: 'image/bmp',
                  png: 'image/png',
                };

                const mime = mimeMap[ext || ''] || 'application/octet-stream';

                return `data:${mime};base64,${a.FileBase64String}`;
              });

              setServiceRequestAttachments(attachments);
            },
            onError: () => {
              setServiceRequestAttachments([]);
            },
          }
        );
      },
    });
  }, [tCode, serviceRequestID]);

  useEffect(() => {
    if (showFollowupComments) {
      loadFollowUps(null, {
        onSuccess: (response) => {
          setLoadingFollowUps(false);
          setFollowupComments(response?.MaximoMemo ?? []);
        },
        onError: () => {
          openModal('');
          setLoadingFollowUps(false);
        },
      });
    }
  }, [showFollowupComments]);

  return {
    serviceRequestTypeParam,
    serviceRequestID,
    serviceRequestType,
    serviceRequestDetails,
    serviceRequestAttachments,
    followupComments,
    showFollowupComments,
    loadingFollowUps,
    isDetailsLoading,
    isLoadingAttachments,
    referrer,
    tenantDetails,

    getDisabledStatus,
    setLoadingFollowUps,
    setShowFollowupComments,
    cancelServiceRequest,
    createSRFollowUP,
  };
};
