import { useCallback } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';

import {
  buildRenewalDocumentValidation,
  type RenewalDocumentValidationResponse,
} from './renewalDocumentValidation';

export function useRenewalDocumentValidation() {
  const { tCode, ProfileType } = useUserStore();

  const { mutateAsync: fetchAttachments } = useApiMutation<any, any>(
    () => `/MyDocuments/Attachment/${tCode}`,
    'GET',
    true
  );

  const { mutateAsync: fetchDocumentStatus } = useApiMutation<any, any>(
    () => `/MyDocuments/Status?tCode=${tCode}&templateCodes=ALL`,
    'GET',
    true
  );

  const { mutateAsync: fetchTenantDetails } = useApiMutation<any, any>(
    () => `/Yardi/GetDetails?tCode=${tCode}`,
    'GET',
    true
  );

  const fetchRenewalDocumentValidation =
    useCallback(async (): Promise<RenewalDocumentValidationResponse> => {
      if (!tCode) {
        throw new Error('Missing tCode');
      }

      // paymentPlan.js fires the three calls together; any HTTP error rejects (error modal upstream)
      const [attachmentsData, statusData, tenantData] = await Promise.all([
        fetchAttachments(null),
        fetchDocumentStatus(null),
        fetchTenantDetails(null),
      ]);

      return buildRenewalDocumentValidation(
        attachmentsData,
        statusData,
        tenantData,
        ProfileType ?? undefined
      );
    }, [ProfileType, fetchAttachments, fetchDocumentStatus, fetchTenantDetails, tCode]);

  return {
    fetchRenewalDocumentValidation,
  };
}
