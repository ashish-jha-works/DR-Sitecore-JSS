import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import { formatNumber } from 'lib/utils/helper';

import { getRenewalRouteAfterDocumentTrack } from '../UploadDocuments/renewalDocumentValidation';
import { useRenewalDocumentValidation } from '../UploadDocuments/useRenewalDocumentValidation';

export interface DocumentVerificationTrackParams {
  selectedInstallmentPlan?: string | number;
  selectedPaymentPlan?: string | number;
  totalPayableAmount?: number | string;
  leasePeriodInMonths?: string | number;
  proposalStartDate?: string;
  proposalEndDate?: string;
  ejariFees?: number;
  adminFees?: number;
  paymentRefNo?: string | number | null;
  paymentOptionId?: number;
  onTrackSuccess?: () => void;
}

export function useDocumentVerification() {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();
  const router = useRouter();
  const { fetchRenewalDocumentValidation } = useRenewalDocumentValidation();

  const { mutate: updateStepperAPI } = useApiMutation<any, any>(
    () => `ContractRenewal/TrackContractDetails`,
    'POST',
    true
  );

  const checkDocumentValidation = useCallback(
    async (params: DocumentVerificationTrackParams): Promise<void> => {
      if (!tCode) {
        openModal('error-modal');
        return;
      }

      try {
        const validation = await fetchRenewalDocumentValidation();

        // paymentPlan.js: UserState 1 = docs failed/expired/rejected; 2 = valid / in progress
        const userState = validation.documentsFailed ? 1 : 2;

        // paymentPlan.js track payload — always AnyDocFailed, no PaymentOptionId
        const stepperReqData: Record<string, any> = {
          ProfileId: tCode,
          TotalPayableAmount: formatNumber(params.totalPayableAmount),
          NoOfInstallments: parseInt(String(params.selectedInstallmentPlan), 10),
          UserState: userState,
          LeasePeriodInMonths: params.leasePeriodInMonths?.toString(),
          ProposalStartDate: params.proposalStartDate,
          ProposalEndDate: params.proposalEndDate,
          EjariFees: params.ejariFees,
          AdminFees: params.adminFees,
          PaymentReferenceNumber: params.paymentRefNo,
          AnyDocFailed: userState === 1,
          PaymentOptionId: params.paymentOptionId,
          Source: 'Portal',
        };

        await new Promise<void>((resolve, reject) => {
          updateStepperAPI(stepperReqData, {
            onSuccess: (res: any) => {
              if (res?.Code === 200 || res?.Status === 'Success' || (res && res !== 'null')) {
                params.onTrackSuccess?.();
                router.push(getRenewalRouteAfterDocumentTrack(userState));
                resolve();
              } else {
                openModal('error-modal');
                reject(new Error('TrackContractDetails failed'));
              }
            },
            onError: () => {
              openModal('error-modal');
              reject(new Error('TrackContractDetails error'));
            },
          });
        });
      } catch {
        openModal('error-modal');
      }
    },
    [fetchRenewalDocumentValidation, openModal, router, tCode, updateStepperAPI]
  );

  return {
    checkDocumentValidation,
  };
}
