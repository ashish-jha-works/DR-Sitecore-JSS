import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { separatedAmount } from 'components/Renewals/PaymentPlan/utils';
import { useFileDownload } from 'components/payments/PaymentsPage/useFileDownload';
import { formatDate } from 'lib/utils/helper';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import {
  PHYSICAL_SCHEDULE_OPTION,
  RENEWAL_DIRECT_DEBIT_SIDE_LETTER_ATTACHMENT_TYPE,
  RENEWAL_ROUTES,
  RENEWAL_THIRD_PARTY_LETTER_ATTACHMENT_TYPE,
  SIGN_METHOD,
} from './renewalSignContractConstants';
import { getPhysicalScheduleDocumentVisibility } from './renewalSignContractDocumentRules';
import type {
  PhysicalScheduleOption,
  SignContractView,
  SignMethod,
} from './renewalSignContract.types';

export function useSignContract() {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();
  const { downloadFile } = useFileDownload();
  const router = useRouter();

  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [view, setView] = useState<SignContractView>('method');
  const [signMethod, setSignMethod] = useState<SignMethod>('');
  const [physicalOption, setPhysicalOption] = useState<PhysicalScheduleOption>('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contractCache, setContractCache] = useState<{ base64: string; fileName: string } | null>(
    null
  );
  const [installmentsPDCDetails, setInstallmentsPDCDetails] = useState<any[]>([]);
  const [selectedPdcInstallmentIndex, setSelectedPdcInstallmentIndex] = useState(0);

  const { mutate: fetchStepper, isPending: isLoadingStepper } = useApiMutation<any, any>(
    () => `/ContractRenewal/Stepper/${tCode}`,
    'GET',
    false
  );

  const { mutate: trackContractDetails } = useApiMutation<any, any>(
    () => `ContractRenewal/TrackContractDetails`,
    'POST',
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

  const loadStepper = useCallback(() => {
    if (!tCode) return;

    fetchStepper(null, {
      onSuccess: (response) => {
        if (response && response !== 'null') {
          setStepperAPIData(response);
        }
      },
      onError: () => openModal('error-modal'),
    });
  }, [tCode, fetchStepper, openModal]);

  useEffect(() => {
    loadStepper();
  }, [loadStepper]);

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

  const redirectToSchedulePickup = useCallback(
    (option: PhysicalScheduleOption = PHYSICAL_SCHEDULE_OPTION.COLLECTION) => {
      const query = option ? `?option=${option}` : '';
      router.push(`${RENEWAL_ROUTES.schedulePickup}${query}`);
    },
    [router]
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

  const handleConfirmMethod = useCallback(() => {
    if (!signMethod || isSubmitting) return;

    // Digital / Smart Pass signing is not implemented yet — physical only for now
    if (signMethod === SIGN_METHOD.PHYSICAL) {
      setView('physical-schedule');
    }
  }, [isSubmitting, signMethod]);

  const handleProceedPhysicalSchedule = useCallback(() => {
    if (!physicalOption || isSubmitting) return;

    setIsSubmitting(true);

    const userState = physicalOption === PHYSICAL_SCHEDULE_OPTION.COLLECTION ? 3 : 2;

    trackContractDetails(
      {
        ProfileId: tCode,
        UserState: userState,
      },
      {
        onSuccess: (response: any) => {
          if (response?.Code === 200 || response?.Status === 'Success' || response) {
            loadStepper();
            redirectToSchedulePickup(physicalOption);
          } else {
            openModal('error-modal');
          }
          setIsSubmitting(false);
        },
        onError: () => {
          openModal('error-modal');
          setIsSubmitting(false);
        },
      }
    );
  }, [
    isSubmitting,
    loadStepper,
    openModal,
    physicalOption,
    redirectToSchedulePickup,
    tCode,
    trackContractDetails,
  ]);

  const isConfirmDisabled = useMemo(() => {
    if (!signMethod || isSubmitting) return true;
    // Digital not implemented yet — only physical can proceed
    if (signMethod === SIGN_METHOD.DIGITAL) return true;
    return false;
  }, [isSubmitting, signMethod]);

  const isProceedDisabled = useMemo(
    () => !physicalOption || isSubmitting,
    [isSubmitting, physicalOption]
  );

  const isLoading = isLoadingStepper || !stepperAPIData;

  return {
    isLoading,
    view,
    signMethod,
    setSignMethod,
    physicalOption,
    setPhysicalOption,
    termsAccepted,
    setTermsAccepted,
    isSubmitting,
    isConfirmDisabled,
    isProceedDisabled,
    physicalScheduleDocuments,
    selectedPaymentPlan,
    installmentsPDCDetails,
    selectedPdcInstallmentIndex,
    downloadContract,
    downloadDirectDebitForm,
    downloadThirdPartyLetter,
    downloadDirectDebitSideLetter,
    handleViewPdc,
    handleConfirmMethod,
    handleProceedPhysicalSchedule,
  };
}
