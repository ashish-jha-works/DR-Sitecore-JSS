import { format, isSameDay, startOfDay } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';

import { separatedAmount } from 'components/Renewals/PaymentPlan/utils';
import {
  RENEWAL_DIRECT_DEBIT_SIDE_LETTER_ATTACHMENT_TYPE,
  RENEWAL_THIRD_PARTY_LETTER_ATTACHMENT_TYPE,
} from 'components/Renewals/Signature/renewalSignContractConstants';
import { getPhysicalScheduleDocumentVisibility } from 'components/Renewals/Signature/renewalSignContractDocumentRules';
import { useFileDownload } from 'components/payments/PaymentsPage/useFileDownload';
import {
  formatDate,
  formatPhoneInput,
  validateCompanyNameOrAddress,
  validatePoBox,
  validateUAEPhone,
} from 'lib/utils/helper';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import {
  buildScheduleCollectionAddress,
  RENEWAL_COLLECTION_TIME_SLOTS,
  RENEWAL_SCHEDULE_REQUEST,
  RENEWAL_SCHEDULE_ROUTES,
} from './scheduledCollectionConstants';

export type ScheduleAddressForm = {
  addressLine1: string;
  addressLine2: string;
  poBox: string;
  emirate: string;
  contactNumber: string;
};

export type ScheduleAddressErrors = Partial<
  Record<'addressLine1' | 'addressLine2' | 'poBox' | 'contactNumber', string>
>;

function parseStepperDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
}

/**
 * dates outside ScheduleCalendarStartDate–EndDate disabled,
 * and Sundays disabled
 */
export function buildRenewalScheduleAvailableDates(
  startDate?: string | null,
  endDate?: string | null
): Set<string> {
  const start = parseStepperDate(startDate);
  const end = parseStepperDate(endDate);
  const result = new Set<string>();

  if (!start || !end || start > end) return result;

  const current = new Date(start);
  while (current <= end) {
    if (current.getDay() !== 0) {
      result.add(format(current, 'yyyy-MM-dd'));
    }
    current.setDate(current.getDate() + 1);
  }

  return result;
}

export function isSlotPastForSelectedDate(slotLabel: string, selectedDate: Date): boolean {
  const today = new Date();
  if (!isSameDay(selectedDate, today)) return false;

  const startStr = slotLabel.split(' - ')[0]?.trim() ?? '';
  const match = startStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return false;

  let hour = parseInt(match[1], 10) % 12;
  const minutes = parseInt(match[2], 10);
  if (match[3].toUpperCase() === 'PM') hour += 12;

  const slotStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hour,
    minutes,
    0
  );

  return today >= slotStart;
}

const EMPTY_ADDRESS: ScheduleAddressForm = {
  addressLine1: '',
  addressLine2: '',
  poBox: '',
  emirate: 'Dubai',
  contactNumber: '',
};

/**  GetProfile / Yardi GetDetails → schedule address fields. */
export function mapTenantDetailsToScheduleAddress(tenant: any): ScheduleAddressForm {
  const unit = (tenant?.Unit_Code ?? '').trim();
  const property = (tenant?.Property_Code ?? '').trim();
  const project = (tenant?.Tenant_Project_Name ?? '').trim();
  const zip = (tenant?.Tenant_Zip ?? '').trim();
  const mobile = (tenant?.Tenant_Mobile ?? '').trim();

  return {
    addressLine1: unit,
    addressLine2: [property, project].filter(Boolean).join(' '),
    poBox: zip,
    emirate: 'Dubai',
    contactNumber: formatPhoneInput(mobile),
  };
}

function validateAddressField(value: string, required: boolean): string | undefined {
  const trimmed = value.trim();
  if (required && !trimmed) return 'Invalid Address';
  if (!trimmed) return undefined;
  return validateCompanyNameOrAddress(trimmed).isValid ? undefined : 'Invalid Address';
}

function getAddressValidationErrors(form: ScheduleAddressForm): ScheduleAddressErrors {
  return {
    addressLine1: validateAddressField(form.addressLine1, true),
    addressLine2: validateAddressField(form.addressLine2, true),
    poBox: (() => {
      const result = validatePoBox(form.poBox);
      return result.isValid ? undefined : result.message || 'Invalid PO BOX';
    })(),
    contactNumber: (() => {
      const result = validateUAEPhone(form.contactNumber, false);
      return result.isValid ? undefined : result.message || 'Invalid Mobile Number';
    })(),
  };
}

export function useScheduledCollection() {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();
  const { downloadFile } = useFileDownload();
  const router = useRouter();
  const searchParams = useSearchParams();

  const scheduleOption = searchParams.get('option') ?? 'collection';
  const isDelivery = scheduleOption === 'delivery';

  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [addressForm, setAddressForm] = useState<ScheduleAddressForm>(EMPTY_ADDRESS);
  const [addressSnapshot, setAddressSnapshot] = useState<ScheduleAddressForm>(EMPTY_ADDRESS);
  const [addressErrors, setAddressErrors] = useState<ScheduleAddressErrors>({});
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [hasAddressLoaded, setHasAddressLoaded] = useState(false);
  const [contractCache, setContractCache] = useState<{ base64: string; fileName: string } | null>(
    null
  );
  const [installmentsPDCDetails, setInstallmentsPDCDetails] = useState<any[]>([]);
  const [selectedPdcInstallmentIndex, setSelectedPdcInstallmentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: fetchStepper, isPending: isLoadingStepper } = useApiMutation<any, any>(
    () => `/ContractRenewal/Stepper/${tCode}`,
    'GET',
    true
  );

  const { mutate: fetchProfile, isPending: isLoadingProfile } = useApiMutation<any, any>(
    () => `/Yardi/GetDetails?tCode=${tCode}`,
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

  const { mutate: fetchTenantProgress } = useApiMutation<any, any>(
    () => `/ContractRenewal/TenantProgress/${tCode}`,
    'GET',
    true
  );

  const refreshStepper = useCallback(() => {
    if (!tCode) return;
    fetchStepper(null, {
      onSuccess: (response) => {
        if (response && response !== 'null') {
          setStepperAPIData(response);
        }
      },
    });
  }, [fetchStepper, tCode]);

  useEffect(() => {
    if (!tCode) return;

    fetchStepper(null, {
      onSuccess: (response) => {
        if (response && response !== 'null') {
          setStepperAPIData(response);
        }
      },
      onError: () => openModal('error-modal'),
    });

    fetchProfile(null, {
      onSuccess: (response) => {
        const tenant = response?.Tenant_Details?.[0];
        if (tenant) {
          const mapped = mapTenantDetailsToScheduleAddress(tenant);
          setAddressForm(mapped);
          setAddressSnapshot(mapped);
        }
        setHasAddressLoaded(true);
      },
      onError: () => {
        setHasAddressLoaded(true);
        openModal('error-modal');
      },
    });
  }, [tCode, fetchStepper, fetchProfile, openModal]);

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

  const availableDateKeys = useMemo(
    () =>
      buildRenewalScheduleAvailableDates(
        stepperAPIData?.ScheduleCalendarStartDate,
        stepperAPIData?.ScheduleCalendarEndDate
      ),
    [stepperAPIData]
  );

  const handleSelectDate = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot('');
  }, []);

  const timeSlots = useMemo(
    () =>
      RENEWAL_COLLECTION_TIME_SLOTS.map((slot) => ({
        label: slot,
        disabled: selectedDate ? isSlotPastForSelectedDate(slot, selectedDate) : true,
      })),
    [selectedDate]
  );

  const updateAddressField = useCallback(
    (field: keyof ScheduleAddressForm) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAddressForm((prev) => ({ ...prev, [field]: value }));

      if (field === 'poBox') {
        const result = validatePoBox(value);
        setAddressErrors((prev) => ({
          ...prev,
          poBox: result.isValid ? undefined : result.message || 'Invalid PO BOX',
        }));
        return;
      }

      if (field === 'addressLine1' || field === 'addressLine2') {
        setAddressErrors((prev) => ({
          ...prev,
          [field]: validateAddressField(value, true),
        }));
      }
    },
    []
  );

  const handleMobileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setAddressForm((prev) => ({ ...prev, contactNumber: formatted }));
    const result = validateUAEPhone(formatted, false);
    setAddressErrors((prev) => ({
      ...prev,
      contactNumber: result.isValid ? undefined : result.message || 'Invalid Mobile Number',
    }));
  }, []);

  /**
   * SAVE: validate + lock fields only.
   * CANCEL: restore values from when EDIT was opened.
   */
  const handleEditAddress = useCallback(() => {
    setAddressSnapshot(addressForm);
    setAddressErrors({});
    setIsAddressEditing(true);
  }, [addressForm]);

  const handleCancelAddress = useCallback(() => {
    setAddressForm(addressSnapshot);
    setAddressErrors({});
    setIsAddressEditing(false);
  }, [addressSnapshot]);

  const handleSaveAddress = useCallback(() => {
    const nextErrors = getAddressValidationErrors(addressForm);
    setAddressErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    // Keep edited values in state and disable inputs.
    setAddressSnapshot(addressForm);
    setIsAddressEditing(false);
  }, [addressForm]);

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

  const isAddressValid = useMemo(() => {
    const errors = getAddressValidationErrors(addressForm);
    return !Object.values(errors).some(Boolean);
  }, [addressForm]);

  const isScheduleEnabled = useMemo(
    () =>
      Boolean(selectedDate && selectedSlot && isAddressValid && !isAddressEditing && !isSubmitting),
    [isAddressEditing, isAddressValid, isSubmitting, selectedDate, selectedSlot]
  );

  /**
   * POST ScheduleProposal → on UpdateRenewalTracker, TenantProgress + Stepper.
   */
  const handleSchedule = useCallback(() => {
    if (!isScheduleEnabled || !selectedDate || !tCode) return;

    const nextErrors = getAddressValidationErrors(addressForm);
    setAddressErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setIsSubmitting(true);

    const body = {
      TenantCode: tCode,
      Proposal_ID: stepperAPIData?.ProposalId,
      App_Collection_Date: format(selectedDate, 'yyyy-MM-dd'),
      App_Collection_Time_Slot: selectedSlot,
      App_Collection_Address: buildScheduleCollectionAddress(addressForm),
      App_Collection_Contact_No: addressForm.contactNumber,
      Request_Type: isDelivery
        ? RENEWAL_SCHEDULE_REQUEST.delivery
        : RENEWAL_SCHEDULE_REQUEST.pickUp,
      APP_REQUEST_CREATEDBY: RENEWAL_SCHEDULE_REQUEST.createdBy,
      APP_RESCHEDULE_REQUEST: RENEWAL_SCHEDULE_REQUEST.schedule,
    };

    scheduleProposal(body, {
      onSuccess: (response: any) => {
        if (!response?.UpdateRenewalTracker) {
          setIsSubmitting(false);
          openModal('error-modal');
          return;
        }

        // getDataForScheduledProposal + fetchContractStepper after schedule
        fetchTenantProgress(null, {
          onSettled: () => {
            refreshStepper();
            setIsSubmitting(false);
            const option = isDelivery ? 'delivery' : 'collection';
            router.push(`${RENEWAL_SCHEDULE_ROUTES.collectionScheduled}?option=${option}`);
          },
        });
      },
      onError: () => {
        setIsSubmitting(false);
        openModal('error-modal');
      },
    });
  }, [
    addressForm,
    fetchTenantProgress,
    isDelivery,
    isScheduleEnabled,
    openModal,
    refreshStepper,
    router,
    scheduleProposal,
    selectedDate,
    selectedSlot,
    stepperAPIData?.ProposalId,
    tCode,
  ]);

  const isLoading = isLoadingStepper || isLoadingProfile || !stepperAPIData || !hasAddressLoaded;

  return {
    isLoading,
    scheduleOption,
    isDelivery,
    stepperAPIData,
    selectedDate,
    selectedSlot,
    setSelectedSlot,
    handleSelectDate,
    availableDateKeys,
    timeSlots,
    addressForm,
    addressErrors,
    isAddressEditing,
    handleEditAddress,
    handleCancelAddress,
    handleSaveAddress,
    updateAddressField,
    handleMobileChange,
    physicalScheduleDocuments,
    selectedPaymentPlan,
    installmentsPDCDetails,
    selectedPdcInstallmentIndex,
    downloadContract,
    downloadDirectDebitForm,
    downloadThirdPartyLetter,
    downloadDirectDebitSideLetter,
    handleViewPdc,
    isScheduleEnabled,
    isSubmitting,
    handleSchedule,
  };
}
