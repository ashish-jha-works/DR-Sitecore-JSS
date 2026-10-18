import { format, isBefore, parseISO, startOfDay, subDays } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { separatedAmount } from 'components/Renewals/PaymentPlan/utils';
import {
  RENEWAL_DIRECT_DEBIT_SIDE_LETTER_ATTACHMENT_TYPE,
  RENEWAL_THIRD_PARTY_LETTER_ATTACHMENT_TYPE,
} from 'components/Renewals/Signature/renewalSignContractConstants';
import { getPhysicalScheduleDocumentVisibility } from 'components/Renewals/Signature/renewalSignContractDocumentRules';
import { useFileDownload } from 'components/payments/PaymentsPage/useFileDownload';
import { formatDate } from 'lib/utils/helper';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import {
  RENEWAL_COLLECTION_TIME_SLOTS,
  RENEWAL_SCHEDULE_REQUEST,
  RENEWAL_SCHEDULE_ROUTES,
  parseScheduledCollectionAddress,
} from '../ScheduledCollection/scheduledCollectionConstants';
import {
  buildRenewalScheduleAvailableDates,
  isSlotPastForSelectedDate,
} from '../ScheduledCollection/useScheduledCollection';
import { RESCHEDULE_COLLECTION_MODAL_ID } from './RescheduleCollectionModal';

function parseTrackerDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = value.includes('T') ? parseISO(value) : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
}

export function isRescheduleDisabledForScheduledDate(scheduledDate?: string | null): boolean {
  const date = parseTrackerDate(scheduledDate);
  if (!date) return true;
  const cutoff = subDays(date, 1);
  return !isBefore(startOfDay(new Date()), cutoff);
}

export function useCollectionScheduled() {
  const { tCode } = useUserStore();
  const { openModal, closeModal } = useUIStore();
  const { downloadFile } = useFileDownload();
  const router = useRouter();
  const searchParams = useSearchParams();

  const optionParam = searchParams.get('option');
  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [tracker, setTracker] = useState<any>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [contractCache, setContractCache] = useState<{ base64: string; fileName: string } | null>(
    null
  );
  const [installmentsPDCDetails, setInstallmentsPDCDetails] = useState<any[]>([]);
  const [selectedPdcInstallmentIndex, setSelectedPdcInstallmentIndex] = useState(0);
  const [rescheduleSelectedDate, setRescheduleSelectedDate] = useState<Date | undefined>(undefined);
  const [rescheduleSelectedSlot, setRescheduleSelectedSlot] = useState('');
  const [isRescheduleSubmitting, setIsRescheduleSubmitting] = useState(false);

  const { mutate: fetchStepper, isPending: isLoadingStepper } = useApiMutation<any, any>(
    () => `/ContractRenewal/Stepper/${tCode}`,
    'GET',
    true
  );

  const { mutate: fetchTenantProgress, isPending: isLoadingProgress } = useApiMutation<any, any>(
    () => `/ContractRenewal/TenantProgress/${tCode}`,
    'GET',
    true
  );

  const { mutate: fetchContractDocument } = useApiMutation<any, any>(
    () => `/ContractRenewal/Contract/${tCode}`,
    'GET',
    true
  );

  const { mutate: downloadDirectDebitAPI } = useApiMutation<any, any>(
    () => `payments/Download/${tCode}/2`,
    'GET',
    true
  );

  const { mutate: downloadThirdPartyLetterAPI } = useApiMutation<any, any>(
    () =>
      `MyDocuments/DownloadDocument/${tCode}/${encodeURIComponent(
        RENEWAL_THIRD_PARTY_LETTER_ATTACHMENT_TYPE
      )}`,
    'GET',
    true
  );

  const { mutate: downloadDirectDebitSideLetterAPI } = useApiMutation<any, any>(
    () =>
      `MyDocuments/DownloadDocument/${tCode}/${encodeURIComponent(
        RENEWAL_DIRECT_DEBIT_SIDE_LETTER_ATTACHMENT_TYPE
      )}`,
    'GET',
    true
  );

  const { mutate: fetchPdcDetails } = useApiMutation<any, any>(
    () => `ContractRenewal/GetPdcDetails/${tCode}`,
    'GET',
    false
  );

  const { mutate: scheduleProposal } = useApiMutation<any, any>(
    () => `/ContractRenewal/ScheduleProposal`,
    'POST',
    true
  );

  useEffect(() => {
    if (!tCode) return;

    let pending = 2;
    const settle = () => {
      pending -= 1;
      if (pending <= 0) setHasLoaded(true);
    };

    fetchStepper(null, {
      onSuccess: (response) => {
        if (response && response !== 'null') setStepperAPIData(response);
        settle();
      },
      onError: () => {
        openModal('error-modal');
        settle();
      },
    });

    fetchTenantProgress(null, {
      onSuccess: (response) => {
        const progress = response?.RenewalProgress?.ME_RES_RENEWAL_TRACKER_V;
        if (progress) setTracker(progress);
        settle();
      },
      onError: () => {
        openModal('error-modal');
        settle();
      },
    });
  }, [tCode, fetchStepper, fetchTenantProgress, openModal]);

  const requestedFor = tracker?.Portal_Tenant_Requested_For || tracker?.Portal_Request_Type || '';

  const isDelivery =
    optionParam === 'delivery' ||
    requestedFor === RENEWAL_SCHEDULE_REQUEST.delivery ||
    stepperAPIData?.Schedule_Type === RENEWAL_SCHEDULE_REQUEST.delivery;

  const physicalScheduleDocuments = useMemo(
    () => getPhysicalScheduleDocumentVisibility(stepperAPIData),
    [stepperAPIData]
  );

  const selectedPaymentPlan = Number(stepperAPIData?.SelectedPaymentOption?.Key);

  useEffect(() => {
    if (!tCode || !physicalScheduleDocuments.showPdcDocument) return;

    fetchPdcDetails(null, {
      onSuccess: (res: any) => {
        if (!res?.PdcList?.length) return;

        const installmentDetails = res.PdcList.map((pdc: any, index: number) => {
          const splitAmount = separatedAmount(pdc?.AmountInWords);
          const [line1, line2] = splitAmount?.split('~;') ?? [];

          return {
            installmentDate: formatDate(pdc.InstallementDate),
            installmentNumber: index + 1,
            installmentAmount: pdc.InstallmentAmount,
            installmentAmountInWords1: line1,
            installmentAmountInWords2: line2,
            recieptName: pdc.RecieptName,
            pdcList: res.PdcList,
            paymentDesc: index === 0 ? 'Rent + Ejari fees + Admin fee' : 'Rent',
          };
        });

        setInstallmentsPDCDetails(installmentDetails);
      },
      onError: () => openModal('error-modal'),
    });
  }, [fetchPdcDetails, openModal, physicalScheduleDocuments.showPdcDocument, tCode]);

  const addressParts = useMemo(
    () => parseScheduledCollectionAddress(tracker?.Portal_Collection_Address),
    [tracker?.Portal_Collection_Address]
  );

  const scheduledDate = parseTrackerDate(tracker?.Portal_Collection_Date);
  const scheduledDateLabel = scheduledDate ? format(scheduledDate, 'EEEE, MMM d, yyyy') : '';
  const scheduledTimeSlot = tracker?.Portal_Collection_Time_Slot || '';

  const isRescheduleDisabled = isRescheduleDisabledForScheduledDate(
    tracker?.Portal_Collection_Date
  );

  const availableDateKeys = useMemo(
    () =>
      buildRenewalScheduleAvailableDates(
        stepperAPIData?.ScheduleCalendarStartDate,
        stepperAPIData?.ScheduleCalendarEndDate
      ),
    [stepperAPIData]
  );

  const rescheduleTimeSlots = useMemo(
    () =>
      RENEWAL_COLLECTION_TIME_SLOTS.map((slot) => ({
        label: slot,
        disabled: rescheduleSelectedDate
          ? isSlotPastForSelectedDate(slot, rescheduleSelectedDate)
          : true,
      })),
    [rescheduleSelectedDate]
  );

  const downloadContract = useCallback(() => {
    if (contractCache) {
      downloadFile(contractCache.base64, contractCache.fileName);
      return;
    }

    if (!tCode) {
      openModal('error-modal');
      return;
    }

    fetchContractDocument(null, {
      onSuccess: (response: any) => {
        if (!response?.FileBase64String || !response?.File_Name) {
          openModal('error-modal');
          return;
        }

        setContractCache({
          base64: response.FileBase64String,
          fileName: response.File_Name,
        });
        downloadFile(response.FileBase64String, response.File_Name);
      },
      onError: () => openModal('error-modal'),
    });
  }, [contractCache, downloadFile, fetchContractDocument, openModal, tCode]);

  const downloadDirectDebitForm = useCallback(() => {
    downloadDirectDebitAPI(null, {
      onSuccess: (response: any) => {
        if (response?.Document && response?.FileName) {
          downloadFile(response.Document, response.FileName);
        } else {
          openModal('error-modal');
        }
      },
      onError: () => openModal('error-modal'),
    });
  }, [downloadDirectDebitAPI, downloadFile, openModal]);

  const downloadJourneyDocument = useCallback(
    (mutate: typeof downloadThirdPartyLetterAPI) => {
      mutate(null, {
        onSuccess: (response: any) => {
          if (response?.Document && response?.FileName) {
            downloadFile(response.Document, response.FileName);
            return;
          }

          if (response?.FileBase64String && response?.File_Name) {
            downloadFile(response.FileBase64String, response.File_Name);
            return;
          }

          openModal('error-modal');
        },
        onError: () => openModal('error-modal'),
      });
    },
    [downloadFile, openModal]
  );

  const downloadThirdPartyLetter = useCallback(() => {
    downloadJourneyDocument(downloadThirdPartyLetterAPI);
  }, [downloadJourneyDocument, downloadThirdPartyLetterAPI]);

  const downloadDirectDebitSideLetter = useCallback(() => {
    downloadJourneyDocument(downloadDirectDebitSideLetterAPI);
  }, [downloadDirectDebitSideLetterAPI, downloadJourneyDocument]);

  const handleViewPdc = useCallback(() => {
    if (!installmentsPDCDetails.length) {
      openModal('error-modal');
      return;
    }

    setSelectedPdcInstallmentIndex(0);
    openModal('view-pdc-modal');
  }, [installmentsPDCDetails.length, openModal]);

  const resetRescheduleModal = useCallback(() => {
    setRescheduleSelectedDate(undefined);
    setRescheduleSelectedSlot('');
    setIsRescheduleSubmitting(false);
  }, []);

  const handleCloseRescheduleModal = useCallback(() => {
    resetRescheduleModal();
    closeModal();
  }, [closeModal, resetRescheduleModal]);

  const handleSelectRescheduleDate = useCallback((date: Date | undefined) => {
    setRescheduleSelectedDate(date);
    setRescheduleSelectedSlot('');
  }, []);

  const handleReschedule = useCallback(() => {
    if (isRescheduleDisabled) return;
    resetRescheduleModal();
    openModal(RESCHEDULE_COLLECTION_MODAL_ID);
  }, [isRescheduleDisabled, openModal, resetRescheduleModal]);

  /**
   * Legacy: crConfirmReschedulePickup / crConfirmRescheduleDelivery
   * Reuses existing address + contact from TenantProgress; only date/time change.
   */
  const handleConfirmReschedule = useCallback(() => {
    if (
      !tCode ||
      !rescheduleSelectedDate ||
      !rescheduleSelectedSlot ||
      isRescheduleSubmitting ||
      !tracker?.Portal_Collection_Address
    ) {
      return;
    }

    setIsRescheduleSubmitting(true);

    const body = {
      TenantCode: tCode,
      Proposal_ID: stepperAPIData?.ProposalId,
      App_Collection_Date: format(rescheduleSelectedDate, 'yyyy-MM-dd'),
      App_Collection_Time_Slot: rescheduleSelectedSlot,
      App_Collection_Address: tracker.Portal_Collection_Address,
      App_Collection_Contact_No: tracker?.Portal_Collection_Contact_No || '',
      Request_Type: isDelivery
        ? RENEWAL_SCHEDULE_REQUEST.delivery
        : RENEWAL_SCHEDULE_REQUEST.pickUp,
      APP_REQUEST_CREATEDBY: RENEWAL_SCHEDULE_REQUEST.createdBy,
      APP_RESCHEDULE_REQUEST: RENEWAL_SCHEDULE_REQUEST.reschedule,
    };

    scheduleProposal(body, {
      onSuccess: (response: any) => {
        if (!response?.UpdateRenewalTracker) {
          setIsRescheduleSubmitting(false);
          openModal('error-modal');
          return;
        }

        fetchTenantProgress(null, {
          onSuccess: (progressResponse) => {
            const progress = progressResponse?.RenewalProgress?.ME_RES_RENEWAL_TRACKER_V;
            if (progress) setTracker(progress);
          },
          onSettled: () => {
            fetchStepper(null, {
              onSuccess: (stepperResponse) => {
                if (stepperResponse && stepperResponse !== 'null') {
                  setStepperAPIData(stepperResponse);
                }
              },
              onSettled: () => {
                setIsRescheduleSubmitting(false);
                resetRescheduleModal();
                closeModal();
              },
            });
          },
          onError: () => {
            setIsRescheduleSubmitting(false);
            openModal('error-modal');
          },
        });
      },
      onError: () => {
        setIsRescheduleSubmitting(false);
        openModal('error-modal');
      },
    });
  }, [
    closeModal,
    fetchStepper,
    fetchTenantProgress,
    isDelivery,
    isRescheduleSubmitting,
    openModal,
    rescheduleSelectedDate,
    rescheduleSelectedSlot,
    resetRescheduleModal,
    scheduleProposal,
    stepperAPIData?.ProposalId,
    tCode,
    tracker?.Portal_Collection_Address,
    tracker?.Portal_Collection_Contact_No,
  ]);

  const handleCheckRenewalSummary = useCallback(() => {
    router.push(RENEWAL_SCHEDULE_ROUTES.summary);
  }, [router]);

  const isLoading = isLoadingStepper || isLoadingProgress || !hasLoaded;

  return {
    isLoading,
    isDelivery,
    addressParts,
    scheduledDateLabel,
    scheduledTimeSlot,
    isRescheduleDisabled,
    physicalScheduleDocuments,
    selectedPaymentPlan,
    installmentsPDCDetails,
    selectedPdcInstallmentIndex,
    downloadContract,
    downloadDirectDebitForm,
    downloadThirdPartyLetter,
    downloadDirectDebitSideLetter,
    handleViewPdc,
    handleReschedule,
    handleCheckRenewalSummary,
    rescheduleSelectedDate,
    rescheduleSelectedSlot,
    setRescheduleSelectedSlot,
    handleSelectRescheduleDate,
    availableDateKeys,
    rescheduleTimeSlots,
    isRescheduleSubmitting,
    handleConfirmReschedule,
    handleCloseRescheduleModal,
  };
}
