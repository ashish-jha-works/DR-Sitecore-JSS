import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatPhoneInput, validateOccupantFullName, validateUAEPhone } from 'lib/utils/helper';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { getSubprofileStatusLabel, SubProfileConfirmAction } from './useFamilyMembers';

export { getSubprofileStatusLabel };

export const DOMESTIC_WORKER_RELATION = 'Maid';

export type DomesticWorkerFormState = {
  firstName: string;
  lastName: string;
  mobile: string;
  requiresSubProfile: boolean;
};

export type DomesticWorkerOccupant = {
  Occupant_Id?: string;
  Firstname?: string;
  Lastname?: string;
  Occupant_Relation?: string;
  Occupant_Mobile?: string | null;
  SubProfileStatus?: number;
};

export type DomesticWorkerModalMode = 'add' | 'edit';
export type DomesticWorkerModalStep = 'details' | 'permissions';

export type DomesticWorkerFieldErrors = Partial<Record<keyof DomesticWorkerFormState, string>>;

type DomesticWorkerSavedFormData = {
  firstName: string;
  lastName: string;
  mobile: string;
  mode: DomesticWorkerModalMode;
  parentTenantCode: string;
  occupantId?: string;
};

const emptyForm = (): DomesticWorkerFormState => ({
  firstName: '',
  lastName: '',
  mobile: '',
  requiresSubProfile: false,
});

const toFormValue = (value: unknown) => {
  const text = value == null ? '' : String(value);
  return text === '-' ? '' : text.trim();
};

export const mapDomesticWorkerToForm = (
  occupant: DomesticWorkerOccupant
): DomesticWorkerFormState => ({
  firstName: toFormValue(occupant.Firstname),
  lastName: toFormValue(occupant.Lastname),
  mobile: toFormValue(occupant.Occupant_Mobile),
  requiresSubProfile: false,
});

export const canEditDomesticWorkerFields = (status?: number) =>
  status === 0 || status === 4 || status === 5;

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

type UseDomesticWorkersParams = {
  tCode: string | null;
  parentTenantCode?: string | null;
  onSaved?: () => void;
};

export const useDomesticWorkers = ({
  tCode,
  parentTenantCode,
  onSaved,
}: UseDomesticWorkersParams) => {
  const { openModal } = useUIStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<DomesticWorkerModalMode>('add');
  const [selectedOccupant, setSelectedOccupant] = useState<DomesticWorkerOccupant | null>(null);
  const [form, setForm] = useState<DomesticWorkerFormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<DomesticWorkerFieldErrors>({});
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
  const [pendingActionOccupant, setPendingActionOccupant] = useState<DomesticWorkerOccupant | null>(
    null
  );
  const [modalStep, setModalStep] = useState<DomesticWorkerModalStep>('details');
  const [permissionsAcknowledged, setPermissionsAcknowledged] = useState(false);
  const [pendingSavedFormData, setPendingSavedFormData] =
    useState<DomesticWorkerSavedFormData | null>(null);

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

  const isFieldsEditable = useMemo(() => {
    if (modalMode === 'add') return true;
    return canEditDomesticWorkerFields(selectedOccupant?.SubProfileStatus);
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

  const openEditModal = useCallback((occupant: DomesticWorkerOccupant) => {
    setSelectedOccupant(occupant);
    setForm(mapDomesticWorkerToForm(occupant));
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
    (): DomesticWorkerSavedFormData => ({
      firstName: (form.firstName ?? '').trim(),
      lastName: (form.lastName ?? '').trim(),
      mobile: (form.mobile ?? '').trim(),
      mode: modalMode,
      parentTenantCode: (parentTenantCode ?? '').trim(),
      occupantId: modalMode === 'edit' ? toOccupantApiId(selectedOccupant?.Occupant_Id) : undefined,
    }),
    [
      form.firstName,
      form.lastName,
      form.mobile,
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
    const errors: DomesticWorkerFieldErrors = {};

    const firstNameResult = validateOccupantFullName(form.firstName);
    if (!firstNameResult.isValid) errors.firstName = firstNameResult.message;

    const lastNameResult = validateOccupantFullName(form.lastName);
    if (!lastNameResult.isValid) errors.lastName = lastNameResult.message;

    const mobileResult = validateUAEPhone(form.mobile, false);
    if (!mobileResult.isValid) errors.mobile = mobileResult.message;

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

  const handleMobileChange = (value: string) => {
    setForm((prev) => ({ ...prev, mobile: formatPhoneInput(value) }));
    setFieldErrors((prev) => ({ ...prev, mobile: undefined }));
  };

  const handleRequiresSubProfileChange = (value: boolean) => {
    setForm((prev) => ({ ...prev, requiresSubProfile: value }));
    if (!value) {
      setModalStep('details');
      setPermissionsAcknowledged(false);
    }
  };

  const finishSave = useCallback(
    (withSubProfile: boolean, savedFormData: DomesticWorkerSavedFormData) => {
      const fullName = `${savedFormData.firstName} ${savedFormData.lastName}`.trim();

      closeModal();

      if (savedFormData.mode === 'add') {
        if (withSubProfile) {
          showSuccess(
            'Sub profile requested',
            `You have successfully requested to create ${fullName}'s sub profile. Further details will be sent to ${savedFormData.mobile}.`
          );
        } else {
          showSuccess(
            'Domestic worker added',
            `You have successfully added ${fullName} as a domestic worker.`
          );
        }
        return;
      }

      if (withSubProfile) {
        showSuccess(
          'Sub profile requested',
          `You have successfully requested to create ${fullName}'s sub profile. Further details will be sent to ${savedFormData.mobile}.`
        );
      } else {
        showSuccess(
          'Details updated',
          `You have successfully updated ${fullName} as a domestic worker.`
        );
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
    (occupantId: string, savedFormData: DomesticWorkerSavedFormData) => {
      const resolvedOccupantId = toOccupantApiId(occupantId);
      const resolvedParentTenantCode = savedFormData.parentTenantCode.trim();

      if (
        !tCode ||
        !resolvedParentTenantCode ||
        !resolvedOccupantId ||
        !savedFormData.firstName ||
        !savedFormData.lastName ||
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
                  : "Please deactivate the current sub profile (if it's active or pending activation) before proceeding. This domestic worker will still be created."
              );

              if (savedFormData.mode === 'add') {
                showSuccess(
                  'Domestic worker added',
                  `You have successfully added ${fullName} as a domestic worker.`
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

    const originalMobile = toFormValue(selectedOccupant?.Occupant_Mobile);

    return form.mobile.trim() !== originalMobile;
  }, [modalMode, selectedOccupant, form.mobile]);

  const checkUsernameAvailability = useCallback(async () => {
    const errors: DomesticWorkerFieldErrors = {};

    if (shouldCheckUsernames()) {
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
  }, [shouldCheckUsernames, checkUsernameValue, form.mobile]);

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
    (savedFormData: DomesticWorkerSavedFormData, onSuccess: () => void) => {
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
          Occupant_Relation: DOMESTIC_WORKER_RELATION,
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
    (savedFormDataOverride?: DomesticWorkerSavedFormData) => {
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
            Occupant_Relation: DOMESTIC_WORKER_RELATION,
            Occupant_Mobile: savedFormData.mobile,
          },
          {
            onSuccess: (response) => {
              if (
                response?.code === 400 &&
                response?.status === 'Could not create the dependent.'
              ) {
                showAlert('Could not create the domestic worker.', '');
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
    (occupant: DomesticWorkerOccupant) => {
      const occupantId = toOccupantApiId(occupant.Occupant_Id);
      if (!occupantId || !tCode || !parentTenantCode) {
        showGlobalError();
        return;
      }

      const name = `${occupant.Firstname ?? ''} ${occupant.Lastname ?? ''}`.trim();
      const mobile = toFormValue(occupant.Occupant_Mobile);

      sendSubProfile(
        { TCode: occupantId, ParentTCode: (parentTenantCode ?? '').trim() },
        {
          onSuccess: (response) => {
            if (isSubProfileSuccess(response, ['200'])) {
              showSuccess(
                'Request resent',
                mobile
                  ? `You have successfully resent the request to create ${name}'s sub profile. Further details will be sent to ${mobile}.`
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
    (occupant: DomesticWorkerOccupant, status: number, action: SubProfileConfirmAction) => {
      const occupantId = toOccupantApiId(occupant.Occupant_Id);
      if (!occupantId || !tCode || !parentTenantCode) {
        showGlobalError();
        return;
      }

      const name = `${occupant.Firstname ?? ''} ${occupant.Lastname ?? ''}`.trim();
      const mobile = toFormValue(occupant.Occupant_Mobile);
      const savedFormData: DomesticWorkerSavedFormData = {
        firstName: toFormValue(occupant.Firstname),
        lastName: toFormValue(occupant.Lastname),
        mobile,
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
                  mobile
                    ? `You have successfully requested to create ${name}'s sub profile. Further details will be sent to ${mobile}.`
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

  const openDeactivateConfirm = useCallback((occupant: DomesticWorkerOccupant) => {
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

  const openReactivateConfirm = useCallback((occupant: DomesticWorkerOccupant) => {
    const name = `${occupant.Firstname ?? ''} ${occupant.Lastname ?? ''}`.trim();
    const mobile = toFormValue(occupant.Occupant_Mobile);
    setPendingActionOccupant(occupant);
    setPendingConfirmAction('reactivate');
    setConfirmHeading(`Are you sure you want to reactivate ${name}'s sub profile?`);
    setConfirmDescription(
      mobile
        ? `Further details will be sent to ${mobile}. Upon reactivation all access to their sub profile will be restored.`
        : 'Upon reactivation all access to their sub profile will be restored.'
    );
    setConfirmImagePath('/assets/svg/error.svg');
    setIsConfirmOpen(true);
  }, []);

  const removeDependentFromYardi = useCallback(
    (occupant: DomesticWorkerOccupant, onSuccess: () => void) => {
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
          Occupant_Relation: DOMESTIC_WORKER_RELATION,
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
    (occupant: DomesticWorkerOccupant) => {
      const status = occupant.SubProfileStatus ?? 0;
      const name = `${occupant.Firstname ?? ''} ${occupant.Lastname ?? ''}`.trim();
      const onDeleted = () => {
        showSuccess(
          'Domestic worker deleted',
          `You have successfully deleted ${name}'s sub profile.`
        );
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

  const openDeleteConfirm = useCallback((occupant: DomesticWorkerOccupant) => {
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
    (occupant: DomesticWorkerOccupant) => {
      const status = occupant.SubProfileStatus ?? 0;

      if (status === 1) {
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
    (occupant: DomesticWorkerOccupant) => {
      if (occupant.SubProfileStatus === 2) {
        openDeactivateConfirm(occupant);
      }
    },
    [openDeactivateConfirm]
  );

  const handleDelete = useCallback(
    (occupant: DomesticWorkerOccupant) => {
      openDeleteConfirm(occupant);
    },
    [openDeleteConfirm]
  );

  const getDomesticWorkerActions = useCallback((occupant: DomesticWorkerOccupant) => {
    const status = occupant.SubProfileStatus ?? 0;

    return {
      showEdit: true,
      showActivate: status === 1 || status === 4,
      showDeactivate: status === 2,
      showDelete: true,
      activateLabel: status === 1 ? 'Resend' : 'Reactivate',
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
    handleMobileChange,
    handleRequiresSubProfileChange,
    handleActivate,
    handleDeactivate,
    handleDelete,
    getDomesticWorkerActions,
    setIsSuccessOpen,
    setIsAlertOpen,
    setIsConfirmOpen,
    confirmSubProfileAction,
  };
};
