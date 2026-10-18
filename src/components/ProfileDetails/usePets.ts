import { useCallback, useEffect, useState } from 'react';
import { validatePetBreed, validatePetName, validatePetType } from 'lib/utils/helper';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';

export type PetDetails = {
  Pet_Id?: string;
  Pet_Name?: string;
  Pet_Type?: string;
};

export type PetFormState = {
  name: string;
  type: string;
  breed: string;
};

export type PetModalMode = 'add' | 'edit';

export type PetFieldErrors = Partial<Record<keyof PetFormState, string>>;

const emptyForm = (): PetFormState => ({
  name: '',
  type: '',
  breed: '',
});

const toFormValue = (value: unknown) => {
  const text = value == null ? '' : String(value);
  return text === '-' ? '' : text.trim();
};

export const parsePetType = (petType?: string) => {
  const value = toFormValue(petType);
  if (!value) {
    return { type: '', breed: '' };
  }

  const separatorIndex = value.indexOf('-');
  if (separatorIndex === -1) {
    return { type: value, breed: '' };
  }

  return {
    type: value.slice(0, separatorIndex).trim(),
    breed: toFormValue(value.slice(separatorIndex + 1)),
  };
};

export const mapPetToForm = (pet: PetDetails): PetFormState => {
  const { type, breed } = parsePetType(pet.Pet_Type);
  return {
    name: toFormValue(pet.Pet_Name),
    type,
    breed,
  };
};

const buildPetTypeValue = (type: string, breed: string) => {
  const typeValue = type.trim();
  const breedValue = breed.trim();

  if (!typeValue && !breedValue) {
    return null;
  }

  return `${typeValue}-${breedValue}`;
};

const isCreatePetSuccess = (response: any) =>
  Array.isArray(response?.CreatePet) && response.CreatePet.length > 0;

const isUpdatePetSuccess = (response: any) =>
  Array.isArray(response?.UpdatePet) && response.UpdatePet.length > 0;

type UsePetsParams = {
  tCode: string | null;
  onSaved?: () => void;
};

export const usePets = ({ tCode, onSaved }: UsePetsParams) => {
  const { openModal } = useUIStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<PetModalMode>('add');
  const [selectedPet, setSelectedPet] = useState<PetDetails | null>(null);
  const [form, setForm] = useState<PetFormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<PetFieldErrors>({});
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successHeading, setSuccessHeading] = useState('');
  const [successDescription, setSuccessDescription] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const alertHeading = '';
  const alertDescription = '';
  //TODO: Below states are not being used anywhere right now, can be removed if not in use
  // const [alertHeading, setAlertHeading] = useState('');
  // const [alertDescription, setAlertDescription] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmHeading, setConfirmHeading] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');
  const [pendingDeletePet, setPendingDeletePet] = useState<PetDetails | null>(null);

  const { mutate: createPet, isPending: isCreating } = useApiMutation<any, any>(
    '/Yardi/CreatePet',
    'POST',
    true
  );

  const { mutate: updatePet, isPending: isUpdating } = useApiMutation<any, any>(
    '/Yardi/UpdatePet',
    'PUT',
    true
  );

  const resetModal = useCallback(() => {
    setForm(emptyForm());
    setFieldErrors({});
    setSelectedPet(null);
    setModalMode('add');
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

  const openEditModal = useCallback((pet: PetDetails) => {
    setSelectedPet(pet);
    setForm(mapPetToForm(pet));
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

  // TODO: Uncomment if alert is required to be shown anywhere
  // const showAlert = useCallback((heading: string, description = '') => {
  //   setAlertHeading(heading);
  //   setAlertDescription(description);
  //   setIsAlertOpen(true);
  // }, []);

  const showGlobalError = useCallback(() => {
    openModal('error-modal');
  }, [openModal]);

  const handleMutationError = useCallback(
    ({ refetch = false }: { refetch?: boolean } = {}) => {
      if (refetch) {
        onSaved?.();
      }
      showGlobalError();
    },
    [onSaved, showGlobalError]
  );

  const validateForm = useCallback(() => {
    const errors: PetFieldErrors = {};
    const nameResult = validatePetName(form.name);
    const typeResult = validatePetType(form.type);
    const breedResult = validatePetBreed(form.breed);

    if (!nameResult.isValid) {
      errors.name = nameResult.message;
    }

    if (!typeResult.isValid) {
      errors.type = typeResult.message;
    }

    if (!breedResult.isValid) {
      errors.breed = breedResult.message;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  const handleSave = useCallback(() => {
    if (!validateForm() || !tCode) {
      return;
    }

    const petType = buildPetTypeValue(form.type, form.breed);
    const petName = form.name.trim();

    if (modalMode === 'add') {
      createPet(
        {
          Tenant_Code: tCode,
          Pet_Name: petName,
          Pet_Type: petType ?? '',
        },
        {
          onSuccess: (response) => {
            if (!isCreatePetSuccess(response)) {
              showGlobalError();
              return;
            }

            closeModal();
            showSuccess('Pet added', `You have successfully added ${petName}.`);
          },
          onError: () => handleMutationError({ refetch: true }),
        }
      );
      return;
    }

    const petId = selectedPet?.Pet_Id;
    if (!petId) {
      showGlobalError();
      return;
    }

    updatePet(
      {
        Pet_Id: petId,
        Tenant_Code: tCode,
        Pet_Name: petName || null,
        Pet_Type: petType,
        Pet_Weight: '1',
      },
      {
        onSuccess: (response) => {
          if (!isUpdatePetSuccess(response)) {
            showGlobalError();
            return;
          }

          closeModal();
          showSuccess('Pet updated', `You have successfully updated ${petName}.`);
        },
        onError: () => handleMutationError({ refetch: true }),
      }
    );
  }, [
    validateForm,
    tCode,
    modalMode,
    form,
    selectedPet?.Pet_Id,
    createPet,
    updatePet,
    closeModal,
    showSuccess,
    showGlobalError,
    handleMutationError,
  ]);

  const handleDelete = useCallback((pet: PetDetails) => {
    const petName = toFormValue(pet.Pet_Name) || 'this pet';
    setPendingDeletePet(pet);
    setConfirmHeading(`Are you sure you want to delete ${petName} from your saved pets?`);
    setConfirmDescription('');
    setIsConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!pendingDeletePet?.Pet_Id || !tCode) {
      showGlobalError();
      return;
    }

    const { type, breed } = parsePetType(pendingDeletePet.Pet_Type);
    const petName = toFormValue(pendingDeletePet.Pet_Name);

    updatePet(
      {
        Pet_Id: pendingDeletePet.Pet_Id,
        Tenant_Code: tCode,
        Pet_Name: petName || null,
        Pet_Type: buildPetTypeValue(type, breed),
        Pet_Weight: '0',
      },
      {
        onSuccess: (response) => {
          setIsConfirmOpen(false);
          setPendingDeletePet(null);

          if (!isUpdatePetSuccess(response)) {
            showGlobalError();
            return;
          }

          showSuccess('Pet deleted', `You have successfully deleted ${petName || 'the pet'}.`);
        },
        onError: () => {
          setIsConfirmOpen(false);
          setPendingDeletePet(null);
          handleMutationError({ refetch: true });
        },
      }
    );
  }, [pendingDeletePet, tCode, updatePet, showSuccess, showGlobalError, handleMutationError]);

  const handleNameChange = useCallback((value: string) => {
    setForm((current) => ({ ...current, name: value }));
    setFieldErrors((current) => ({ ...current, name: undefined }));
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setForm((current) => ({ ...current, type: value }));
    setFieldErrors((current) => ({ ...current, type: undefined }));
  }, []);

  const handleBreedChange = useCallback((value: string) => {
    setForm((current) => ({ ...current, breed: value }));
    setFieldErrors((current) => ({ ...current, breed: undefined }));
  }, []);

  const getPetActions = useCallback(
    () => ({
      showEdit: true,
      showDelete: true,
    }),
    []
  );

  const isSaving = isCreating || isUpdating;

  return {
    isModalOpen,
    modalMode,
    form,
    fieldErrors,
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
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
    handleDelete,
    confirmDelete,
    handleNameChange,
    handleTypeChange,
    handleBreedChange,
    getPetActions,
    parsePetType,
    setIsSuccessOpen,
    setIsAlertOpen,
    setIsConfirmOpen,
  };
};
