import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import { SERVICE_REQUEST_TYPE } from 'lib/common/constants/common';
import { convertTimeSlotToSchedule, formatToMMDDYYYY, getFileMetaData } from 'lib/utils/helper';

import { TechnicianDaySchedule, TechnicianSlot } from '../Create/createRequest.types';
import { useServiceRequestTenantDetails } from '../useServiceRequestTenantDetails';
import { normalizeCommunityServiceRequestDetails } from '../utils/serviceRequestAddress';

export const useReopenServiceRequest = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal } = useUIStore();
  const { tCode, FirstName, LastName, Mobile, Community } = useUserStore();
  const setUserData = useUserStore((s) => s.setUserData);

  const serviceRequestType = searchParams.get('serviceRequestType');
  const serviceRequestID = searchParams.get('id');

  const isMaintenance = serviceRequestType === SERVICE_REQUEST_TYPE.MAINTENANCE;
  const isCommunity = serviceRequestType === SERVICE_REQUEST_TYPE.COMMUNITY;
  const isLeasing = serviceRequestType === SERVICE_REQUEST_TYPE.LEASING;

  const isValidServiceType = useMemo(
    () =>
      Boolean(
        serviceRequestType && Object.values(SERVICE_REQUEST_TYPE).includes(serviceRequestType)
      ),
    [serviceRequestType]
  );

  // ---------------- STATE ----------------

  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [phoneNumberError, setPhoneNumberError] = useState<string>();
  const [issue, setIssue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [step, setStep] = useState(1);

  const [technicianSchedule, setTechnicianSchedule] = useState<TechnicianDaySchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [slots, setSlots] = useState<TechnicianSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TechnicianSlot | null>(null);
  const [manualMode, setManualMode] = useState(false);

  const [serviceRequestDetails, setServiceRequestDetails] = useState<any>({});
  const tenantDetails = useServiceRequestTenantDetails(tCode);

  const isScheduleSelected = Boolean(selectedDate && selectedSlot?.Slot);
  const isPhoneValid = phoneNumber?.length === 11;
  const isIssueValid = issue?.trim()?.length > 0;

  // ---------------- API ----------------

  const { mutate: createServiceRequest } = useApiMutation<any, any>(
    'Yardi/CreateServiceRequest',
    'POST',
    true
  );

  const { mutate: mutateProfileData } = useApiMutation<any, any>(
    () => `/Tenant/${tCode}/Notifications/ProfileLiteApps`,
    'GET',
    false
  );

  const { mutate: uploadImageRequest } = useApiMutation<any, any>(
    () => `/Attachment`,
    'POST',
    true
  );

  const { mutate: loadDetails, isPending: isDetailsLoading } = useApiMutation<any, any>(
    `/ServiceRequest/${serviceRequestID}?tCode=${tCode}`,
    'GET',
    false
  );

  // ---------------- EFFECTS ----------------

  useEffect(() => {
    if (Mobile) {
      setPhoneNumber(Mobile);
      return;
    }

    if (!tCode) return;

    mutateProfileData(null, {
      onSuccess: (res) => setUserData({ Email: res?.Email, Mobile: res?.Mobile }),
      onError: () => openModal('error-modal'),
    });
  }, [Mobile, tCode]);

  useEffect(() => {
    if (!tCode || !serviceRequestID) return;

    loadDetails(null, {
      onSuccess: (response) => {
        const serviceRequest = isCommunity
          ? normalizeCommunityServiceRequestDetails(response.ServiceRequest)
          : response.ServiceRequest;

        setServiceRequestDetails(serviceRequest);
      },
      onError: () => {
        openModal('');
      },
    });
  }, [tCode, serviceRequestID]);

  // ---------------- VALIDATION ----------------

  const isNextBtnDisabled = useMemo(() => {
    if (isMaintenance) {
      if (step === 1) {
        return !isIssueValid;
      }
      return !isScheduleSelected;
    }

    if (isCommunity || isLeasing) {
      return !isIssueValid;
    }

    if (isLeasing) {
      return !(isPhoneValid && isIssueValid);
    }

    return true;
  }, [isMaintenance, isCommunity, isLeasing, step, isIssueValid, isScheduleSelected, isPhoneValid]);

  // ---------------- HELPERS ----------------

  const uploadAttachments = useCallback(async () => {
    if (!selectedFiles.length) return '';

    let transactionId = '';

    for (const file of selectedFiles) {
      const { fileName, base64 }: any = await getFileMetaData(file);

      const response: any = await new Promise((resolve, reject) => {
        uploadImageRequest(
          {
            FileName: fileName,
            Attachment: base64,
            TransactionID: transactionId,
          },
          { onSuccess: resolve, onError: reject }
        );
      });

      if (response?.TransactionID) {
        transactionId = response.TransactionID;
      }
    }

    return transactionId;
  }, [selectedFiles]);

  const buildRequestBody = (transactionId: string): Record<string, any> => {
    const callerName = `${FirstName} ${LastName}`.replaceAll(/&/g, 'And');

    const body: Record<string, any> = {
      Source: 'Portal',
      CreateSRAttachment: {
        Object_Type: 'SR',
        Object_Reference: tCode,
        Transaction_Id: transactionId,
      },
      Lead: '',
      Tenant_Code: tCode,
      Template_Code: serviceRequestDetails?.Template_Code.trim(),
      Category: serviceRequestDetails?.Category + ''?.replace(/\s/g, ' '),
      SubCategory: serviceRequestDetails?.Sub_Category + ''?.replace(/\s/g, ' '),
      Problem_Description: issue,
      Caller_Name: callerName,
      Caller_Number: phoneNumber,
      SchedStart: '',
      SchedFinish: '',
      Preferred_Date: '',
      Preferred_TimeSlot: '',
      Related_WOID: serviceRequestID,
      Common_Area: null,
    };

    if (isCommunity && serviceRequestDetails?.Location) {
      body.Problem_Description = `${issue}$${serviceRequestDetails?.Location}$`;
    }

    if (isMaintenance && selectedDate && selectedSlot) {
      const slotSchedule = convertTimeSlotToSchedule(selectedDate, selectedSlot.Slot);

      if (manualMode) {
        body.Preferred_Date = formatToMMDDYYYY(selectedDate) || '';
        body.Preferred_TimeSlot = selectedSlot.Slot || '';
      } else {
        body.Lead = selectedSlot?.PersonId;
        body.SchedStart = selectedSlot.SCHEDSTART || slotSchedule?.ScheduleStart || '';
        body.SchedFinish = selectedSlot.SCHEDFINISH || slotSchedule?.ScheduleFinish || '';
      }
    }

    return body;
  };

  // ---------------- HANDLERS ----------------

  const handleCancelBtnClick = () => {
    if (step === 1) router.push('/service-requests');
    else setStep(1);
  };

  const handleFinalSubmit = async () => {
    try {
      const transactionId = await uploadAttachments();
      const requestBody = buildRequestBody(transactionId);

      createServiceRequest(requestBody, {
        onSuccess: (res) => {
          const sr = res?.CreateServiceRequest?.SR_Number;
          if (!sr) return;
          openModal('create-service-success-modal');
        },
        onError: () => openModal('create-service-error-modal'),
      });
    } catch {
      openModal('create-service-error-modal');
    }
  };

  const handleNextBtnClick = () => {
    if (isMaintenance && step === 1) {
      setStep(2);
      return;
    }

    handleFinalSubmit();
  };

  // ---------------- RETURN ----------------

  return {
    serviceRequestType,
    isValidServiceType,
    phoneNumber,
    setPhoneNumber,
    phoneNumberError,
    setPhoneNumberError,
    issue,
    setIssue,
    selectedFiles,
    setSelectedFiles,
    step,
    technicianSchedule,
    setTechnicianSchedule,
    selectedDate,
    setSelectedDate,
    slots,
    setSlots,
    selectedSlot,
    setSelectedSlot,
    manualMode,
    setManualMode,
    isNextBtnDisabled,
    handleCancelBtnClick,
    handleNextBtnClick,
    Community,
    serviceRequestID,
    serviceRequestDetails,
    isDetailsLoading,
    tenantDetails,
  };
};
