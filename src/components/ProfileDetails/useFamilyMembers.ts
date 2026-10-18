import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  formatPhoneInput,
  validateEmail,
  validateOccupantFullName,
  validateUAEPhone,
} from 'lib/utils/helper';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';

export const FAMILY_RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Son',
  'Daughter',
  'Father',
  'Mother',
] as const;

export type FamilyMemberFormState = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  relationship: string;
  requiresSubProfile: boolean;
};

export type FamilyMemberOccupant = {
  Occupant_Id?: string;
  Firstname?: string;
  Lastname?: string;
  Occupant_Relation?: string;
  Occupant_Email?: string | null;
  Occupant_Mobile?: string | null;
  SubProfileStatus?: number;
};

export type FamilyMemberModalMode = 'add' | 'edit';
export type FamilyMemberModalStep = 'details' | 'permissions';

export type FamilyMemberFieldErrors = Partial<Record<keyof FamilyMemberFormState, string>>;

export type SubProfileConfirmAction = 'deactivate' | 'reactivate' | 'delete';

type FamilyMemberSavedFormData = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  relationship: string;
  mode: FamilyMemberModalMode;
  parentTenantCode: string;
  occupantId?: string;
};

const emptyForm = (): FamilyMemberFormState => ({
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  relationship: '',
  requiresSubProfile: false,
});

const toFormValue = (value: unknown) => {
  const text = value == null ? '' : String(value);
  return text === '-' ? '' : text.trim();
};

export const mapOccupantToForm = (occupant: FamilyMemberOccupant): FamilyMemberFormState => ({
  firstName: toFormValue(occupant.Firstname),
  lastName: toFormValue(occupant.Lastname),
  email: toFormValue(occupant.Occupant_Email),
  mobile: toFormValue(occupant.Occupant_Mobile),
  relationship: toFormValue(occupant.Occupant_Relation),
  requiresSubProfile: false,
});

export const canEditFamilyMemberFields = (status?: number) => status === 0 || status === 4;

export const getSubprofileStatusLabel = (status?: number) => {
  switch (status) {
    case 1:
    case 5:
      return 'Pending Activation';
    case 2:
      return 'Active';
    case 3:
      return 'Locked';
    case 4:
      return 'Deactivated';
    default:
      return '';
  }
};

const isCreateDependentSuccess = (response: any) =>
  Array.isArray(response?.CreateOccupant) && response.CreateOccupant.length > 0;

const isUpdateDependentSuccess = (response: any) =>
  response?.HasException === false ||
  (Array.isArray(response?.UpdateOccupant) && response.UpdateOccupant.length > 0);

const isSubProfileSuccess = (response: any, codes: Array<string | number>) =>
  codes.some((code) => String(response?.Code) === String(code));

const toOccupantApiId = (value?: string | null) => (value == null ? '' : String(value).trim());

const getMoveOutDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

type UseFamilyMembersParams = {
  tCode: string | null;
  parentTenantCode?: string | null;
  onSaved?: () => void;
};

export const useFamilyMembers = ({ tCode, parentTenantCode, onSaved }: UseFamilyMembersParams) => {
  const { openModal } = useUIStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FamilyMemberModalMode>('add');
  const [selectedOccupant, setSelectedOccupant] = useState<FamilyMemberOccupant | null>(null);
  const [form, setForm] = useState<FamilyMemberFormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FamilyMemberFieldErrors>({});
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successHeading, setSuccessHeading] = useState('');
  const [successDescription, setSuccessDescription] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertHeading, setAlertHeading] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmHeading, setConfirmHeading] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');
  const [confirmImagePath, setConfirmImagePath] = useState('/assets/svg/error.svg');
  const [pendingConfirmAction, setPendingConfirmAction] = useState<SubProfileConfirmAction | null>(
    null
  );
  const [pendingActionOccupant, setPendingActionOccupant] = useState<FamilyMemberOccupant | null>(
    null
  );
  const [modalStep, setModalStep] = useState<FamilyMemberModalStep>('details');
  const [permissionsAcknowledged, setPermissionsAcknowledged] = useState(false);
  const [pendingSavedFormData, setPendingSavedFormData] =
    useState<FamilyMemberSavedFormData | null>(null);

  const { mutate: createDependent, isPending: isCreating } = useApiMutation<any, any>(
    '/Yardi/CreateDependent',
    'POST',
    true
  );

  const { mutate: updateDependent, isPending: isUpdating } = useApiMutation<any, any>(
    '/Yardi/UpdateDependent',
    'PUT',
    true
  );

  const { mutate: createSubProfile, isPending: isCreatingSubProfile } = useApiMutation<any, any>(
    () => `/SubProfile/Create/${tCode}`,
    'POST',
    true
  );

  const { mutate: updateSubProfile, isPending: isUpdatingSubProfile } = useApiMutation<any, any>(
    () => `/SubProfile/Update/${tCode}`,
    'PUT',
    true
  );

  const { mutate: sendSubProfile, isPending: isSendingSubProfile } = useApiMutation<any, any>(
    () => `/SubProfile/Send/${tCode}`,
    'POST',
    true
  );

  const { mutate: updateSubProfileDetails, isPending: isUpdatingSubProfileDetails } =
    useApiMutation<any, any>(() => `/SubProfile/UpdateDetails/${tCode}`, 'PUT', true);

  const { mutate: checkUserName, isPending: isCheckingUserName } = useApiMutation<string, any>(
    () => `/SubProfile/CheckUserName/${tCode}`,
    'POST',
    true,
    (username) => JSON.stringify(username)
  );

  const relationshipOptions = useMemo((): string[] => {
    const options: string[] = [...FAMILY_RELATIONSHIP_OPTIONS];
    const current = form.relationship.trim();

    if (current && !options.includes(current)) {
      options.push(current);
    }

    return options;
  }, [form.relationship]);

  const isFieldsEditable = useMemo(() => {
    if (modalMode === 'add') return true;
    return canEditFamilyMemberFields(selectedOccupant?.SubProfileStatus);
  }, [modalMode, selectedOccupant?.SubProfileStatus]);

  const resetModal = useCallback(() => {
    setForm(emptyForm());
    setFieldErrors({});
    setSelectedOccupant(null);
    setModalMode('add');
    setModalStep('details');
    setPermissionsAcknowledged(false);
    setPendingSavedFormData(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    resetModal();
  }, [resetModal]);

  const openAddModal = useCallback(() => {
    resetModal();
    setModalMode('add');
    setIsModalOpen(true);
  }, [resetModal]);

  const openEditModal = useCallback((occupant: FamilyMemberOccupant, enableSubProfile = false) => {
    setSelectedOccupant(occupant);
    setForm({ ...mapOccupantToForm(occupant), requiresSubProfile: enableSubProfile });
    setFieldErrors({});
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      resetModal();
    }
  }, [isModalOpen, resetModal]);

  const showSuccess = useCallback(
    (heading: string, description = '') => {
      setSuccessHeading(heading);
      setSuccessDescription(description);
      setIsSuccessOpen(true);
      onSaved?.();
    },
    [onSaved]
  );

  const showAlert = useCallback((heading: string, description = '') => {
    setAlertHeading(heading);
    setAlertDescription(description);
    setIsAlertOpen(true);
  }, []);

  const buildSavedFormData = useCallback(
    (): FamilyMemberSavedFormData => ({
      firstName: (form.firstName ?? '').trim(),
      lastName: (form.lastName ?? '').trim(),
      email: (form.email ?? '').trim(),
      mobile: (form.mobile ?? '').trim(),
      relationship: (form.relationship ?? '').trim(),
      mode: modalMode,
      parentTenantCode: (parentTenantCode ?? '').trim(),
      occupantId: modalMode === 'edit' ? toOccupantApiId(selectedOccupant?.Occupant_Id) : undefined,
    }),
    [
      form.firstName,
      form.lastName,
      form.email,
      form.mobile,
      form.relationship,
      modalMode,
      parentTenantCode,
      selectedOccupant?.Occupant_Id,
    ]
  );

  const showGlobalError = useCallback(() => {
    openModal('error-modal');
  }, [openModal]);

  const handleMutationError = useCallback(
    (options?: { closeFormModal?: boolean; refetch?: boolean }) => {
      const { closeFormModal = false, refetch = false } = options ?? {};

      if (closeFormModal) {
        closeModal();
      }

      if (refetch) {
        onSaved?.();
      }
    },
    [closeModal, onSaved]
  );

  const validateForm = useCallback(() => {
    const errors: FamilyMemberFieldErrors = {};

    const firstNameResult = validateOccupantFullName(form.firstName);
    if (!firstNameResult.isValid) errors.firstName = firstNameResult.message;

    const lastNameResult = validateOccupantFullName(form.lastName);
    if (!lastNameResult.isValid) errors.lastName = lastNameResult.message;

    const emailResult = validateEmail(form.email, true);
    if (!emailResult.isValid) errors.email = 'Invalid Email Id';
    if (!form.email.trim()) errors.email = "Field can't be empty";

    const mobileResult = validateUAEPhone(form.mobile, false);
    if (!mobileResult.isValid) errors.mobile = mobileResult.message;

    if (!form.relationship.trim()) {
      errors.relationship = "Field can't be empty";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  const handleFirstNameChange = (value: string) => {
    setForm((prev) => ({ ...prev, firstName: value }));
    setFieldErrors((prev) => ({ ...prev, firstName: undefined }));
  };

  const handleLastNameChange = (value: string) => {
    setForm((prev) => ({ ...prev, lastName: value }));
    setFieldErrors((prev) => ({ ...prev, lastName: undefined }));
  };

  const handleEmailChange = (value: string) => {
    setForm((prev) => ({ ...prev, email: value }));
    setFieldErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handleMobileChange = (value: string) => {
    setForm((prev) => ({ ...prev, mobile: formatPhoneInput(value) }));
    setFieldErrors((prev) => ({ ...prev, mobile: undefined }));
  };

  const handleRelationshipChange = (value: string) => {
    setForm((prev) => ({ ...prev, relationship: value }));
    setFieldErrors((prev) => ({ ...prev, relationship: undefined }));
  };

  const handleRequiresSubProfileChange = (value: boolean) => {
    setForm((prev) => ({ ...prev, requiresSubProfile: value }));
    if (!value) {
      setModalStep('details');
      setPermissionsAcknowledged(false);
    }
  };

  const finishSave = useCallback(
    (withSubProfile: boolean, savedFormData: FamilyMemberSavedFormData) => {
      const fullName = `${savedFormData.firstName} ${savedFormData.lastName}`.trim();

      closeModal();

      if (savedFormData.mode === 'add') {
        if (withSubProfile) {
          showSuccess(
            'Sub profile requested',
            `You have successfully requested to create ${fullName}'s sub profile. Further details will be sent to ${savedFormData.email}.`
          );
        } else {
          showSuccess('Dependent added', `You have successfully added ${fullName} as a dependent.`);
        }
        return;
      }

      if (withSubProfile) {
        showSuccess(
          'Sub profile requested',
          `You have successfully requested to create ${fullName}'s sub profile. Further details will be sent to ${savedFormData.email}.`
        );
      } else {
        showSuccess('Details updated', 'You have successfully updated the family member details.');
      }
    },
    [closeModal, showSuccess]
  );

  const sendActivationEmail = useCallback(
    (occupantId: string, parentCode: string, onComplete: () => void) => {
      const resolvedParentTenantCode = parentCode.trim();
      const resolvedOccupantId = toOccupantApiId(occupantId);

      if (!tCode || !resolvedParentTenantCode || !resolvedOccupantId) {
        showGlobalError();
        handleMutationError({ closeFormModal: true, refetch: true });
        return;
      }

      sendSubProfile(
        { TCode: resolvedOccupantId, ParentTCode: resolvedParentTenantCode },
        {
          onSuccess: (response) => {
            if (isSubProfileSuccess(response, ['200'])) {
              onComplete();
              return;
            }

            showGlobalError();
            handleMutationError({ closeFormModal: true, refetch: true });
          },
          onError: () => handleMutationError({ closeFormModal: true, refetch: true }),
        }
      );
    },
    [tCode, sendSubProfile, showGlobalError, handleMutationError]
  );

  const createSubProfileForOccupant = useCallback(
    (occupantId: string, savedFormData: FamilyMemberSavedFormData) => {
      const resolvedOccupantId = toOccupantApiId(occupantId);
      const resolvedParentTenantCode = savedFormData.parentTenantCode.trim();

      if (
        !tCode ||
        !resolvedParentTenantCode ||
        !resolvedOccupantId ||
        !savedFormData.firstName ||
        !savedFormData.lastName ||
        !savedFormData.email ||
        !savedFormData.mobile
      ) {
        showGlobalError();
        handleMutationError({ closeFormModal: true, refetch: true });
        return;
      }

      const fullName = `${savedFormData.firstName} ${savedFormData.lastName}`.trim();

      createSubProfile(
        {
          FirstName: savedFormData.firstName,
          LastName: savedFormData.lastName,
          Phone: savedFormData.mobile,
          Email: savedFormData.email,
          TCode: resolvedOccupantId,
          ParentTCode: resolvedParentTenantCode,
        },
        {
          onSuccess: (response) => {
            if (isSubProfileSuccess(response, ['201'])) {
              sendActivationEmail(occupantId, savedFormData.parentTenantCode, () =>
                finishSave(true, savedFormData)
              );
              return;
            }

            if (isSubProfileSuccess(response, ['400'])) {
              closeModal();
              showAlert(
                'You can have only one active sub profile at a time.',
                savedFormData.mode === 'edit'
                  ? "Please deactivate the current sub profile (if it's active or pending activation) before proceeding."
                  : "Please deactivate the current sub profile (if it's active or pending activation) before proceeding. This dependent will still be created."
              );

              if (savedFormData.mode === 'add') {
                showSuccess(
                  'Dependent added',
                  `You have successfully added ${fullName} as a dependent.`
                );
              } else {
                onSaved?.();
              }
              return;
            }

            showGlobalError();
            handleMutationError({ closeFormModal: true, refetch: true });
          },
          onError: () => handleMutationError({ closeFormModal: true, refetch: true }),
        }
      );
    },
    [
      tCode,
      createSubProfile,
      sendActivationEmail,
      showAlert,
      showGlobalError,
      handleMutationError,
      closeModal,
      finishSave,
      showSuccess,
      onSaved,
    ]
  );

  const checkUsernameValue = useCallback(
    (value: string) =>
      new Promise<boolean>((resolve) => {
        if (!tCode || !value.trim()) {
          resolve(false);
          return;
        }

        checkUserName(value.trim(), {
          onSuccess: (response) => {
            if (isSubProfileSuccess(response, ['200'])) {
              resolve(true);
              return;
            }

            if (
              isSubProfileSuccess(response, ['400']) &&
              String(response?.Status).includes('already exists')
            ) {
              resolve(false);
              return;
            }

            resolve(false);
          },
          onError: () => resolve(false),
        });
      }),
    [tCode, checkUserName]
  );

  const shouldCheckUsernames = useCallback(() => {
    if (modalMode === 'add') return true;

    const originalEmail = toFormValue(selectedOccupant?.Occupant_Email);
    const originalMobile = toFormValue(selectedOccupant?.Occupant_Mobile);

    return form.email.trim() !== originalEmail || form.mobile.trim() !== originalMobile;
  }, [modalMode, selectedOccupant, form.email, form.mobile]);

  const checkUsernameAvailability = useCallback(async () => {
    const errors: FamilyMemberFieldErrors = {};

    if (shouldCheckUsernames()) {
      const isEmailAvailable = await checkUsernameValue(form.email);
      if (!isEmailAvailable) {
        errors.email = 'Email already exists';
      }

      const isPhoneAvailable = await checkUsernameValue(form.mobile);
      if (!isPhoneAvailable) {
        errors.mobile = 'Phone already exists';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return false;
    }

    return true;
  }, [shouldCheckUsernames, checkUsernameValue, form.email, form.mobile]);

  const goToPermissionsStep = useCallback(() => {
    setModalStep('permissions');
    setPermissionsAcknowledged(false);
  }, []);

  const handleModalBack = useCallback(() => {
    setModalStep('details');
    setPermissionsAcknowledged(false);
    setPendingSavedFormData(null);
  }, []);

  const updateDependentWithSavedFormData = useCallback(
    (savedFormData: FamilyMemberSavedFormData, onSuccess: () => void) => {
      const occupantId = savedFormData.occupantId;
      if (!tCode || !occupantId) {
        showGlobalError();
        return;
      }

      updateDependent(
        {
          Tenant_Code: tCode,
          Occupant_Id: occupantId,
          Occupant_First_Name: savedFormData.firstName,
          Occupant_Last_Name: savedFormData.lastName,
          Occupant_Relation: savedFormData.relationship,
          Occupant_Email: savedFormData.email,
          Occupant_Mobile: savedFormData.mobile,
          Occupant_MoveOut_Date: '',
        },
        {
          onSuccess: (response) => {
            if (response?.code === 400 && response?.status === 'Could not update the dependent.') {
              showAlert('Could not update the dependent.', '');
              return;
            }

            if (!isUpdateDependentSuccess(response)) {
              showGlobalError();
              return;
            }

            onSuccess();
          },
          onError: () => handleMutationError(),
        }
      );
    },
    [tCode, updateDependent, showAlert, showGlobalError, handleMutationError]
  );

  const executeSave = useCallback(
    (savedFormDataOverride?: FamilyMemberSavedFormData) => {
      if (!tCode) {
        showGlobalError();
        return;
      }

      const savedFormData = savedFormDataOverride ?? pendingSavedFormData ?? buildSavedFormData();

      if (modalMode === 'edit' && form.requiresSubProfile && modalStep === 'permissions') {
        const occupantId = savedFormData.occupantId ?? pendingSavedFormData?.occupantId;
        if (!occupantId) {
          showGlobalError();
          return;
        }

        createSubProfileForOccupant(occupantId, savedFormData);
        return;
      }

      if (modalMode === 'add') {
        createDependent(
          {
            Tenant_Code: tCode,
            Occupant_First_Name: savedFormData.firstName,
            Occupant_Last_Name: savedFormData.lastName,
            Occupant_Relation: savedFormData.relationship,
            Occupant_Email: savedFormData.email,
            Occupant_Mobile: savedFormData.mobile,
          },
          {
            onSuccess: (response) => {
              if (
                response?.code === 400 &&
                response?.status === 'Could not create the dependent.'
              ) {
                showAlert('Could not create the dependent.', '');
                return;
              }

              if (!isCreateDependentSuccess(response)) {
                showGlobalError();
                return;
              }

              const occupantId = toOccupantApiId(response.CreateOccupant[0]?.Occupant_Id);

              if (form.requiresSubProfile && occupantId) {
                createSubProfileForOccupant(occupantId, savedFormData);
              } else {
                finishSave(false, savedFormData);
              }
            },
            onError: () => handleMutationError(),
          }
        );
        return;
      }

      const occupantId = savedFormData.occupantId;
      if (!occupantId) {
        showGlobalError();
        return;
      }

      updateDependentWithSavedFormData(savedFormData, () => {
        if (selectedOccupant?.SubProfileStatus === 4 && savedFormData.parentTenantCode) {
          updateSubProfileDetails(
            {
              Email: savedFormData.email,
              Phone: savedFormData.mobile,
              TCode: occupantId,
              ParentTCode: savedFormData.parentTenantCode,
            },
            {
              onSuccess: () => finishSave(false, savedFormData),
              onError: () => handleMutationError({ closeFormModal: true, refetch: true }),
            }
          );
          return;
        }

        finishSave(false, savedFormData);
      });
    },
    [
      tCode,
      modalMode,
      modalStep,
      form.requiresSubProfile,
      buildSavedFormData,
      pendingSavedFormData,
      createDependent,
      updateDependentWithSavedFormData,
      selectedOccupant?.SubProfileStatus,
      createSubProfileForOccupant,
      finishSave,
      updateSubProfileDetails,
      showAlert,
      showGlobalError,
      handleMutationError,
    ]
  );

  const handleModalNext = useCallback(async () => {
    if (!validateForm() || !tCode) {
      if (!tCode) showGlobalError();
      return;
    }

    if (modalStep === 'permissions') {
      if (!permissionsAcknowledged) return;

      const savedFormData = pendingSavedFormData ?? buildSavedFormData();
      if (form.requiresSubProfile && !savedFormData.parentTenantCode.trim()) {
        showGlobalError();
        return;
      }

      executeSave(savedFormData);
      return;
    }

    const isAvailable = await checkUsernameAvailability();
    if (!isAvailable) return;

    if (form.requiresSubProfile && isFieldsEditable) {
      if (!(parentTenantCode ?? '').trim()) {
        showGlobalError();
        return;
      }

      const savedFormData = buildSavedFormData();

      if (modalMode === 'edit') {
        updateDependentWithSavedFormData(savedFormData, () => {
          setPendingSavedFormData(savedFormData);
          goToPermissionsStep();
        });
        return;
      }

      setPendingSavedFormData(savedFormData);
      goToPermissionsStep();
      return;
    }

    executeSave();
  }, [
    validateForm,
    tCode,
    modalMode,
    modalStep,
    permissionsAcknowledged,
    pendingSavedFormData,
    buildSavedFormData,
    checkUsernameAvailability,
    form.requiresSubProfile,
    isFieldsEditable,
    parentTenantCode,
    updateDependentWithSavedFormData,
    goToPermissionsStep,
    executeSave,
    showGlobalError,
  ]);

  const resendSubProfile = useCallback(
    (occupant: FamilyMemberOccupant) => {
      const occupantId = toOccupantApiId(occupant.Occupant_Id);
      if (!occupantId || !tCode || !parentTenantCode) {
        showGlobalError();
        return;
      }

      const name = `${occupant.Firstname ?? ''} ${occupant.Lastname ?? ''}`.trim();
      const email = toFormValue(occupant.Occupant_Email);

      sendSubProfile(
        { TCode: occupantId, ParentTCode: (parentTenantCode ?? '').trim() },
        {
          onSuccess: (response) => {
            if (isSubProfileSuccess(response, ['200'])) {
              showSuccess(
                'Request resent',
                email
                  ? `You have successfully resent the request to create ${name}'s sub profile. Further details will be sent to ${email}.`
                  : `You have successfully resent the request to create ${name}'s sub profile.`
              );
            } else {
              showGlobalError();
            }
          },
          onError: () => handleMutationError(),
        }
      );
    },
    [tCode, parentTenantCode, sendSubProfile, showSuccess, showGlobalError, handleMutationError]
  );

  const executeSubProfileStatusUpdate = useCallback(
    (occupant: FamilyMemberOccupant, status: number, action: SubProfileConfirmAction) => {
      const occupantId = toOccupantApiId(occupant.Occupant_Id);
      if (!occupantId || !tCode || !parentTenantCode) {
        showGlobalError();
        return;
      }

      const name = `${occupant.Firstname ?? ''} ${occupant.Lastname ?? ''}`.trim();
      const email = toFormValue(occupant.Occupant_Email);
      const savedFormData: FamilyMemberSavedFormData = {
        firstName: toFormValue(occupant.Firstname),
        lastName: toFormValue(occupant.Lastname),
        email,
        mobile: toFormValue(occupant.Occupant_Mobile),
        relationship: toFormValue(occupant.Occupant_Relation),
        mode: 'edit',
        parentTenantCode: (parentTenantCode ?? '').trim(),
        occupantId,
      };

      updateSubProfile(
        {
          TCode: occupantId,
          ParentTCode: (parentTenantCode ?? '').trim(),
          Status: status,
        },
        {
          onSuccess: (response) => {
            if (isSubProfileSuccess(response, ['400'])) {
              showAlert(
                'You can have only one active sub profile at a time.',
                "Please deactivate the current sub profile (if it's active or pending activation) before proceeding."
              );
              return;
            }

            if (!isSubProfileSuccess(response, ['200'])) {
              showGlobalError();
              return;
            }

            if (action === 'reactivate') {
              sendActivationEmail(occupantId, savedFormData.parentTenantCode, () => {
                showSuccess(
                  'Sub profile requested',
                  email
                    ? `You have successfully requested to create ${name}'s sub profile. Further details will be sent to ${email}.`
                    : `You have successfully requested to create ${name}'s sub profile.`
                );
              });
              return;
            }

            showSuccess(
              'Sub profile deactivated',
              `You have successfully deactivated ${name}'s sub profile.`
            );
          },
          onError: () => handleMutationError(),
        }
      );
    },
    [
      tCode,
      parentTenantCode,
      updateSubProfile,
      showAlert,
      showGlobalError,
      handleMutationError,
      sendActivationEmail,
      showSuccess,
    ]
  );

  const openDeactivateConfirm = useCallback((occupant: FamilyMemberOccupant) => {
    const name = `${occupant.Firstname ?? ''} ${occupant.Lastname ?? ''}`.trim();
    setPendingActionOccupant(occupant);
    setPendingConfirmAction('deactivate');
    setConfirmHeading(`Are you sure you want to deactivate ${name}'s sub profile?`);
    setConfirmDescription(
      'By deactivating their account, all access to their sub profile will be locked.'
    );
    setConfirmImagePath('/assets/svg/error.svg');
    setIsConfirmOpen(true);
  }, []);

  const openReactivateConfirm = useCallback((occupant: FamilyMemberOccupant) => {
    const name = `${occupant.Firstname ?? ''} ${occupant.Lastname ?? ''}`.trim();
    const email = toFormValue(occupant.Occupant_Email);
    setPendingActionOccupant(occupant);
    setPendingConfirmAction('reactivate');
    setConfirmHeading(`Are you sure you want to reactivate ${name}'s sub profile?`);
    setConfirmDescription(
      email
        ? `Further details will be sent to ${email}. Upon reactivation all access to their sub profile will be restored.`
        : 'Upon reactivation all access to their sub profile will be restored.'
    );
    setConfirmImagePath('/assets/svg/error.svg');
    setIsConfirmOpen(true);
  }, []);

  const removeDependentFromYardi = useCallback(
    (occupant: FamilyMemberOccupant, onSuccess: () => void) => {
      const occupantId = toOccupantApiId(occupant.Occupant_Id);
      if (!tCode || !occupantId) {
        showGlobalError();
        return;
      }

      updateDependent(
        {
          Tenant_Code: tCode,
          Occupant_Id: occupantId,
          Occupant_First_Name: toFormValue(occupant.Firstname),
          Occupant_Last_Name: toFormValue(occupant.Lastname),
          Occupant_Relation: toFormValue(occupant.Occupant_Relation),
          Occupant_Email: toFormValue(occupant.Occupant_Email),
          Occupant_Mobile: toFormValue(occupant.Occupant_Mobile),
          Occupant_MoveOut_Date: getMoveOutDate(),
          Occupant_Gender: '',
          Occupant_DOB: '',
          Occupant_Nationality: '',
        },
        {
          onSuccess: (response) => {
            if (response?.code === 400 && response?.status === 'Could not update the dependent.') {
              showAlert('Could not update the dependent.', '');
              return;
            }

            if (!isUpdateDependentSuccess(response)) {
              showGlobalError();
              return;
            }

            onSuccess();
          },
          onError: () => handleMutationError({ refetch: true }),
        }
      );
    },
    [tCode, updateDependent, showAlert, showGlobalError, handleMutationError]
  );

  const executeDelete = useCallback(
    (occupant: FamilyMemberOccupant) => {
      const status = occupant.SubProfileStatus ?? 0;
      const name = `${occupant.Firstname ?? ''} ${occupant.Lastname ?? ''}`.trim();
      const onDeleted = () => {
        showSuccess('Dependent deleted', `You have successfully deleted ${name}'s sub profile.`);
      };

      if (status !== 0 && status !== 5) {
        const occupantId = toOccupantApiId(occupant.Occupant_Id);
        if (!occupantId || !tCode || !parentTenantCode) {
          showGlobalError();
          return;
        }

        updateSubProfile(
          {
            TCode: occupantId,
            ParentTCode: (parentTenantCode ?? '').trim(),
            Status: 5,
          },
          {
            onSuccess: (response) => {
              if (isSubProfileSuccess(response, ['400'])) {
                showAlert(
                  'You can have only one active sub profile at a time.',
                  "Please deactivate the current sub profile (if it's active or pending activation) before proceeding."
                );
                return;
              }

              if (!isSubProfileSuccess(response, ['200'])) {
                showGlobalError();
                return;
              }

              removeDependentFromYardi(occupant, onDeleted);
            },
            onError: () => handleMutationError({ refetch: true }),
          }
        );
        return;
      }

      removeDependentFromYardi(occupant, onDeleted);
    },
    [
      tCode,
      parentTenantCode,
      updateSubProfile,
      showAlert,
      showGlobalError,
      handleMutationError,
      removeDependentFromYardi,
      showSuccess,
    ]
  );

  const openDeleteConfirm = useCallback((occupant: FamilyMemberOccupant) => {
    const name = `${occupant.Firstname ?? ''} ${occupant.Lastname ?? ''}`.trim();
    const status = occupant.SubProfileStatus ?? 0;
    setPendingActionOccupant(occupant);
    setPendingConfirmAction('delete');
    setConfirmHeading(
      status === 0
        ? `Are you sure you want to delete ${name}?`
        : `Are you sure you want to delete ${name}'s sub profile?`
    );
    setConfirmDescription(
      'Once the account is deleted, all of their information, permissions, access, and contacts will be permanently removed from your account.'
    );
    setConfirmImagePath('/assets/svg/deactivate-account.svg');
    setIsConfirmOpen(true);
  }, []);

  const confirmSubProfileAction = useCallback(() => {
    if (!pendingActionOccupant || !pendingConfirmAction) return;

    if (pendingConfirmAction === 'delete') {
      executeDelete(pendingActionOccupant);
    } else {
      const status = pendingConfirmAction === 'deactivate' ? 4 : 1;
      executeSubProfileStatusUpdate(pendingActionOccupant, status, pendingConfirmAction);
    }

    setIsConfirmOpen(false);
    setPendingActionOccupant(null);
    setPendingConfirmAction(null);
  }, [pendingActionOccupant, pendingConfirmAction, executeDelete, executeSubProfileStatusUpdate]);

  const handleActivate = useCallback(
    (occupant: FamilyMemberOccupant) => {
      const status = occupant.SubProfileStatus ?? 0;

      if (status === 1 || status === 5) {
        resendSubProfile(occupant);
        return;
      }

      if (status === 4) {
        openReactivateConfirm(occupant);
      }
    },
    [resendSubProfile, openReactivateConfirm]
  );

  const handleDeactivate = useCallback(
    (occupant: FamilyMemberOccupant) => {
      if (occupant.SubProfileStatus === 2) {
        openDeactivateConfirm(occupant);
      }
    },
    [openDeactivateConfirm]
  );

  const handleDelete = useCallback(
    (occupant: FamilyMemberOccupant) => {
      openDeleteConfirm(occupant);
    },
    [openDeleteConfirm]
  );

  const getFamilyMemberActions = useCallback((occupant: FamilyMemberOccupant) => {
    const status = occupant.SubProfileStatus ?? 0;

    return {
      showEdit: true,
      showActivate: status === 1 || status === 4 || status === 5,
      showDeactivate: status === 2,
      showDelete: true,
      activateLabel: status === 1 || status === 5 ? 'Resend' : 'Reactivate',
    };
  }, []);

  const isSaving =
    isCreating ||
    isUpdating ||
    isCreatingSubProfile ||
    isUpdatingSubProfile ||
    isSendingSubProfile ||
    isUpdatingSubProfileDetails ||
    isCheckingUserName;

  const showPermissionsStep = form.requiresSubProfile && isFieldsEditable;

  return {
    isModalOpen,
    modalMode,
    modalStep,
    showPermissionsStep,
    permissionsAcknowledged,
    selectedOccupant,
    form,
    fieldErrors,
    relationshipOptions,
    isFieldsEditable,
    isSaving,
    isSuccessOpen,
    successHeading,
    successDescription,
    isAlertOpen,
    alertHeading,
    alertDescription,
    isConfirmOpen,
    confirmHeading,
    confirmDescription,
    confirmImagePath,
    openAddModal,
    openEditModal,
    closeModal,
    handleModalNext,
    handleModalBack,
    setPermissionsAcknowledged,
    handleFirstNameChange,
    handleLastNameChange,
    handleEmailChange,
    handleMobileChange,
    handleRelationshipChange,
    handleRequiresSubProfileChange,
    handleActivate,
    handleDeactivate,
    handleDelete,
    getFamilyMemberActions,
    setIsSuccessOpen,
    setIsAlertOpen,
    setIsConfirmOpen,
    confirmSubProfileAction,
  };
};
