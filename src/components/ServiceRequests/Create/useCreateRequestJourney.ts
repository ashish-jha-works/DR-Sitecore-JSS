import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import { SERVICE_REQUEST_CONFIG, SERVICE_REQUEST_TYPE } from 'lib/common/constants/common';
import { convertTimeSlotToSchedule, formatToMMDDYYYY, getFileMetaData } from 'lib/utils/helper';

import {
  CategoryResponse,
  SubCategoryResponse,
  TechnicianDaySchedule,
  TechnicianSlot,
} from './createRequest.types';

export const useCreateRequestJourney = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal } = useUIStore();
  const { tCode, FirstName, LastName, Mobile, Community } = useUserStore();
  const setUserData = useUserStore((s) => s.setUserData);

  const serviceRequestType = searchParams.get('serviceRequestType');

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
  const [location, setLocation] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState<string>();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategoryResponse[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryResponse | null>(null);
  const [issue, setIssue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [step, setStep] = useState(1);
  const [serviceRequestId, setServiceRequestId] = useState('');

  const [technicianSchedule, setTechnicianSchedule] = useState<TechnicianDaySchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [slots, setSlots] = useState<TechnicianSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TechnicianSlot | null>(null);
  const [manualMode, setManualMode] = useState(false);

  const isEmergencyRequest = Boolean(selectedSubCategory?.isEmergency);

  const isScheduleSelected = Boolean(selectedDate && selectedSlot?.Slot);
  const isIssueValid = issue.trim().length > 0;

  // ---------------- API ----------------

  const { mutate: fetchCategories, isPending: isLoadingCategories } = useApiMutation<any, any>(
    `Yardi/GetCategories?serviceRequestType=${
      SERVICE_REQUEST_CONFIG[serviceRequestType as string]?.id
    }`,
    'GET',
    false
  );

  const { mutate: fetchSubCategories } = useApiMutation<any, any>(
    `Yardi/GetSubCategories?categoryId=${selectedCategory?.Id}`,
    'GET',
    true
  );

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

  // ---------------- EFFECTS ----------------

  useEffect(() => {
    if (!serviceRequestType) return;

    fetchCategories(null, {
      onSuccess: (res) => setCategories(res?.Categories || []),
      onError: () => openModal('error-modal'),
    });
  }, [serviceRequestType]);

  useEffect(() => {
    if (!selectedCategory?.Id || isLeasing) return;

    fetchSubCategories(null, {
      onSuccess: (res) => {
        setSelectedSubCategory(null);
        setSubCategories(res?.SubCategories || []);
      },
      onError: () => openModal('error-modal'),
    });
  }, [selectedCategory?.Id, isLeasing]);

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

  // ---------------- VALIDATION ----------------

  const isNextBtnDisabled = useMemo(() => {
    if (isMaintenance) {
      if (step === 1) {
        return !(phoneNumber && selectedCategory && selectedSubCategory && isIssueValid);
      }
      return !isScheduleSelected;
    }

    if (isCommunity) {
      return !(
        phoneNumber &&
        location.trim().length > 0 &&
        selectedCategory &&
        selectedSubCategory &&
        isIssueValid
      );
    }

    if (isLeasing) {
      return !(phoneNumber && selectedCategory && isIssueValid);
    }

    return true;
  }, [
    isMaintenance,
    isCommunity,
    isLeasing,
    step,
    selectedCategory,
    selectedSubCategory,
    isIssueValid,
    isScheduleSelected,
    phoneNumber,
    location,
  ]);

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
      Template_Code: selectedSubCategory?.TemplateCode,
      Category: selectedCategory?.CategoryName?.replace(/\s/g, ' '),
      SubCategory: isLeasing ? '' : selectedSubCategory?.SubCategoryName?.replace(/\s/g, ' '),
      Problem_Description: issue,
      Caller_Name: callerName,
      Caller_Number: phoneNumber,
      SchedStart: '',
      SchedFinish: '',
      Preferred_Date: '',
      Preferred_TimeSlot: '',
      Related_WOID: '',
      Common_Area: null,
    };

    if (isCommunity && location) {
      body.Problem_Description = `${issue}$${location}$`;
    }

    if (isMaintenance && !isEmergencyRequest && selectedDate && selectedSlot) {
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
          setServiceRequestId(sr);
          openModal('create-service-success-modal');
        },
        onError: () => openModal('create-service-error-modal'),
      });
    } catch {
      openModal('create-service-error-modal');
    }
  };

  const handleNextBtnClick = () => {
    const isPhoneNumberValid = phoneNumber?.trim() && phoneNumber?.length === 11;

    if (!isPhoneNumberValid) {
      setPhoneNumberError('Invalid mobile number, please try another.');
      return;
    }

    if (isMaintenance && !isEmergencyRequest && step === 1) {
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
    location,
    setLocation,
    phoneNumberError,
    setPhoneNumberError,
    categories,
    selectedCategory,
    setSelectedCategory,
    subCategories,
    selectedSubCategory,
    setSelectedSubCategory,
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
    serviceRequestId,
    isEmergencyRequest,
    Community,
    isLoadingCategories,
  };
};
