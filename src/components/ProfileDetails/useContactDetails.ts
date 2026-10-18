import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  formatLandlineInput,
  formatPhoneInput,
  validateCompanyNameOrAddress,
  validateEmail,
  validatePoBox,
  validateUAELandline,
  validateUAEPhone,
} from 'lib/utils/helper';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

export const EMERGENCY_CONTACT_RELATIONSHIP_OPTIONS = [
  'None',
  'Spouse',
  'Son',
  'Daughter',
  'Father',
  'Mother',
  'Roommate',
  'Friends',
  'Guarantor',
  'Other',
] as const;

export type ContactFormState = {
  Tenant_Mobile: string;
  Tenant_Email: string;
  Tenant_Alt_Mob_No: string;
  Tenant_Landline_No: string;
  tenant_emergency_Name: string;
  tenant_emergency_Relation: string;
  Tenant_Emergency_No: string;
  Tenant_Zip: string;
  Company_Name: string;
  Company_Addr: string;
};

export const emptyContactForm = (): ContactFormState => ({
  Tenant_Mobile: '',
  Tenant_Email: '',
  Tenant_Alt_Mob_No: '',
  Tenant_Landline_No: '',
  tenant_emergency_Name: '',
  tenant_emergency_Relation: '',
  Tenant_Emergency_No: '',
  Tenant_Zip: '',
  Company_Name: '',
  Company_Addr: '',
});

const toFormValue = (value: unknown) => {
  const text = value == null ? '' : String(value);
  return text === '-' ? '' : text;
};

export const mapFieldsToForm = (fields: any): ContactFormState => ({
  Tenant_Mobile: toFormValue(fields?.Tenant_Mobile),
  Tenant_Email: toFormValue(fields?.Tenant_Email),
  Tenant_Alt_Mob_No: toFormValue(fields?.Tenant_Alt_Mob_No),
  Tenant_Landline_No: toFormValue(fields?.Tenant_Landline_No),
  tenant_emergency_Name: toFormValue(fields?.tenant_emergency_Name),
  tenant_emergency_Relation: toFormValue(fields?.tenant_emergency_Relation),
  Tenant_Emergency_No: toFormValue(fields?.Tenant_Emergency_No),
  Tenant_Zip: toFormValue(fields?.Tenant_Zip),
  Company_Name: toFormValue(fields?.Company_Name),
  Company_Addr: toFormValue(fields?.Company_Addr),
});

const toApiValue = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length === 0 ? '-' : trimmed;
};

const isUpdateTenantSuccess = (response: any) =>
  Array.isArray(response?.UpdateTenantProfile) && response.UpdateTenantProfile.length > 0;

type UseContactDetailsParams = {
  fields: any;
  tCode: string | null;
  onSaved?: () => void;
};

export const useContactDetails = ({ fields, tCode, onSaved }: UseContactDetailsParams) => {
  const { openModal } = useUIStore();
  const setUserData = useUserStore((state) => state.setUserData);

  const [form, setForm] = useState<ContactFormState>(emptyContactForm);
  const [isMobileEditing, setIsMobileEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [isDetailsEditing, setIsDetailsEditing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormState, string>>>(
    {}
  );
  const [isMobileOtpOpen, setIsMobileOtpOpen] = useState(false);
  const [mobileOtpError, setMobileOtpError] = useState(false);
  const [isEmailVerifyModalOpen, setIsEmailVerifyModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isMobileSuccessOpen, setIsMobileSuccessOpen] = useState(false);

  const emergencyRelationshipOptions = useMemo((): string[] => {
    const options: string[] = [...EMERGENCY_CONTACT_RELATIONSHIP_OPTIONS];
    const current = form.tenant_emergency_Relation.trim();

    if (current && !options.includes(current)) {
      options.push(current);
    }

    return options;
  }, [form.tenant_emergency_Relation]);

  const { mutate: updateTenantDetails, isPending: isSavingDetails } = useApiMutation<any, any>(
    '/Yardi/UpdateTenantDetails',
    'PUT',
    true
  );

  const { mutate: requestToken, isPending: isSendingToken } = useApiMutation<any, any>(
    (requestData) =>
      `/Token/Send?profileId=${tCode}&registrationMode=${
        requestData.registrationMode
      }&newEmailorPhone=${encodeURIComponent(requestData.newEmailorPhone)}&tokenType=${
        requestData.tokenType
      }`,
    'POST',
    true
  );

  const { mutate: validateToken, isPending: isValidatingOtp } = useApiMutation<any, any>(
    (requestData) =>
      `/Token/Validate?token=${
        requestData.token
      }&registrationMode=Phone&profileId=${tCode}&newPhoneNumber=${encodeURIComponent(
        requestData.newPhoneNumber
      )}`,
    'PUT',
    true
  );

  useEffect(() => {
    if (fields && Object.keys(fields).length > 0) {
      setForm(mapFieldsToForm(fields));
    }
  }, [fields]);

  const updateField = (key: keyof ContactFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, Tenant_Mobile: formatPhoneInput(e.target.value) }));
    setFieldErrors((prev) => ({ ...prev, Tenant_Mobile: undefined }));
  };

  const handleAltMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, Tenant_Alt_Mob_No: formatPhoneInput(e.target.value) }));
    setFieldErrors((prev) => ({ ...prev, Tenant_Alt_Mob_No: undefined }));
  };

  const handleLandlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, Tenant_Landline_No: formatLandlineInput(e.target.value) }));
    setFieldErrors((prev) => ({ ...prev, Tenant_Landline_No: undefined }));
  };

  const handleEmergencyMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, Tenant_Emergency_No: formatPhoneInput(e.target.value) }));
    setFieldErrors((prev) => ({ ...prev, Tenant_Emergency_No: undefined }));
  };

  const handleEmergencyRelationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, tenant_emergency_Relation: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, tenant_emergency_Relation: undefined }));
  };

  const showSuccess = useCallback(() => {
    setIsSuccessOpen(true);
    onSaved?.();
  }, [onSaved]);

  const showMobileSuccess = useCallback(() => {
    setIsMobileSuccessOpen(true);
    onSaved?.();
  }, [onSaved]);

  const saveTenantDetails = useCallback(
    (payload: Record<string, string>, onComplete: () => void) => {
      if (!tCode) {
        openModal('error-modal');
        return;
      }

      updateTenantDetails(
        { Tenant_Code: tCode, ...payload },
        {
          onSuccess: (response) => {
            if (isUpdateTenantSuccess(response)) {
              onComplete();
              showSuccess();
            } else {
              openModal('error-modal');
            }
          },
          onError: () => openModal('error-modal'),
        }
      );
    },
    [tCode, updateTenantDetails, openModal, showSuccess]
  );

  const cancelMobileEdit = () => {
    setForm((prev) => ({ ...prev, Tenant_Mobile: toFormValue(fields?.Tenant_Mobile) }));
    setFieldErrors((prev) => ({ ...prev, Tenant_Mobile: undefined }));
    setIsMobileEditing(false);
  };

  const cancelEmailEdit = () => {
    setForm((prev) => ({ ...prev, Tenant_Email: toFormValue(fields?.Tenant_Email) }));
    setFieldErrors((prev) => ({ ...prev, Tenant_Email: undefined }));
    setIsEmailEditing(false);
  };

  const cancelDetailsEdit = () => {
    setForm((prev) => ({
      ...prev,
      ...mapFieldsToForm(fields),
      Tenant_Mobile: prev.Tenant_Mobile,
      Tenant_Email: prev.Tenant_Email,
    }));
    setFieldErrors({});
    setIsDetailsEditing(false);
  };

  const saveMobile = () => {
    const result = validateUAEPhone(form.Tenant_Mobile, false);
    if (!result.isValid) {
      setFieldErrors((prev) => ({ ...prev, Tenant_Mobile: result.message }));
      return;
    }
    if (!tCode) {
      openModal('error-modal');
      return;
    }

    requestToken(
      { newEmailorPhone: form.Tenant_Mobile, registrationMode: 'Phone', tokenType: '4' },
      {
        onSuccess: () => {
          setMobileOtpError(false);
          setIsMobileOtpOpen(true);
        },
        onError: () => openModal('error-modal'),
      }
    );
  };

  const resendMobileOtp = () => {
    requestToken(
      { newEmailorPhone: form.Tenant_Mobile, registrationMode: 'Phone', tokenType: '4' },
      {
        onSuccess: () => setMobileOtpError(false),
        onError: () => openModal('error-modal'),
      }
    );
  };

  const verifyMobileOtp = (otp: string) => {
    validateToken(
      { token: otp, newPhoneNumber: form.Tenant_Mobile },
      {
        onSuccess: (response: any) => {
          if (response?.Code === 200 || response?.Status === 'Success') {
            setIsMobileOtpOpen(false);
            setIsMobileEditing(false);
            setMobileOtpError(false);
            setUserData({ Mobile: form.Tenant_Mobile });
            showMobileSuccess();
          } else {
            setMobileOtpError(true);
          }
        },
        onError: () => setMobileOtpError(true),
      }
    );
  };

  const saveEmail = () => {
    const result = validateEmail(form.Tenant_Email, true);
    if (!result.isValid) {
      setFieldErrors((prev) => ({ ...prev, Tenant_Email: 'Invalid Email Id' }));
      return;
    }
    if (!tCode) {
      openModal('error-modal');
      return;
    }

    requestToken(
      { newEmailorPhone: form.Tenant_Email, registrationMode: 'EmailOTP', tokenType: '10' },
      {
        onSuccess: () => {
          setIsEmailEditing(false);
          setIsEmailVerifyModalOpen(true);
        },
        onError: () => openModal('error-modal'),
      }
    );
  };

  const saveDetails = () => {
    const errors: Partial<Record<keyof ContactFormState, string>> = {};

    const altResult = validateUAEPhone(form.Tenant_Alt_Mob_No, true);
    if (!altResult.isValid) errors.Tenant_Alt_Mob_No = altResult.message;

    const landlineResult = validateUAELandline(form.Tenant_Landline_No, true);
    if (!landlineResult.isValid) errors.Tenant_Landline_No = landlineResult.message;

    const emergencyResult = validateUAEPhone(form.Tenant_Emergency_No, false);
    if (!emergencyResult.isValid) errors.Tenant_Emergency_No = emergencyResult.message;

    const poBoxResult = validatePoBox(form.Tenant_Zip);
    if (!poBoxResult.isValid) errors.Tenant_Zip = poBoxResult.message;

    const companyNameResult = validateCompanyNameOrAddress(form.Company_Name);
    if (!companyNameResult.isValid) errors.Company_Name = 'Invalid Company Name';

    const companyAddrResult = validateCompanyNameOrAddress(form.Company_Addr);
    if (!companyAddrResult.isValid) errors.Company_Addr = 'Invalid Company Address';

    if (!form.tenant_emergency_Name.trim()) {
      errors.tenant_emergency_Name = "Field can't be empty";
    }
    if (!form.tenant_emergency_Relation.trim()) {
      errors.tenant_emergency_Relation = "Field can't be empty";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    saveTenantDetails(
      {
        Tenant_Alt_Mob_No: toApiValue(form.Tenant_Alt_Mob_No),
        Tenant_Landline_No: toApiValue(form.Tenant_Landline_No),
        Tenant_Emergency_No: toApiValue(form.Tenant_Emergency_No),
        Tenant_Zip: form.Tenant_Zip.trim(),
        Company_Name: toApiValue(form.Company_Name),
        Company_Addr: toApiValue(form.Company_Addr),
        Emergency_Contact_Name: form.tenant_emergency_Name.trim(),
        Emergency_Contact_RelationShip: form.tenant_emergency_Relation,
      },
      () => setIsDetailsEditing(false)
    );
  };

  const isSaving = isSavingDetails || isSendingToken || isValidatingOtp;

  return {
    form,
    fieldErrors,
    isMobileEditing,
    isEmailEditing,
    isDetailsEditing,
    isMobileOtpOpen,
    mobileOtpError,
    isEmailVerifyModalOpen,
    isSuccessOpen,
    isMobileSuccessOpen,
    emergencyRelationshipOptions,
    isSaving,
    setForm,
    setIsMobileOtpOpen,
    setIsEmailVerifyModalOpen,
    setIsSuccessOpen,
    setIsMobileSuccessOpen,
    updateField,
    handleMobileChange,
    handleAltMobileChange,
    handleLandlineChange,
    handleEmergencyMobileChange,
    handleEmergencyRelationChange,
    setIsMobileEditing,
    setIsEmailEditing,
    setIsDetailsEditing,
    cancelMobileEdit,
    cancelEmailEdit,
    cancelDetailsEdit,
    saveMobile,
    saveEmail,
    saveDetails,
    resendMobileOtp,
    verifyMobileOtp,
  };
};
