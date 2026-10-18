import CrossIcon from 'assets/icons/CrossIcon';
import { Input } from 'src/components/common/Input';
import { PetFieldErrors, PetFormState, PetModalMode } from './usePets';

interface AddPetModalProps {
  isOpen: boolean;
  mode: PetModalMode;
  form: PetFormState;
  fieldErrors: PetFieldErrors;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onNameChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onBreedChange: (value: string) => void;
}

export default function AddPetModal({
  isOpen,
  mode,
  form,
  fieldErrors,
  isSaving,
  onClose,
  onSave,
  onNameChange,
  onTypeChange,
  onBreedChange,
}: AddPetModalProps) {
  const heading = mode === 'add' ? 'Add pet' : 'Edit pet';
  const buttonLabel = mode === 'add' ? 'Add pet' : 'Save changes';
  const isSaveDisabled = isSaving || !form.name.trim() || !form.type.trim();

  return (
    <div className={`custom-modal ${isOpen ? 'show' : ''}`}>
      <div className="custom-modal__wrapper !max-w-[600px]">
        <div className="flex items-center mb-5 md:mb-6">
          <h4 className="text-navy-500 text-heading-2 text-start font-normal grow">{heading}</h4>
          <button type="button" className="shrink" onClick={onClose}>
            <CrossIcon className="text-lilac-500 size-6 cursor-pointer" />
          </button>
        </div>

        <div className="form-group !text-start">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-3 md:gap-x-5 md:gap-y-4">
            <Input
              label="Name"
              value={form.name}
              maxLength={40}
              onChange={(e) => onNameChange(e.target.value)}
              error={fieldErrors.name}
            />
            <Input
              label="Type"
              value={form.type}
              maxLength={18}
              onChange={(e) => onTypeChange(e.target.value)}
              error={fieldErrors.type}
            />
            <Input
              label="Breed"
              value={form.breed}
              maxLength={18}
              onChange={(e) => onBreedChange(e.target.value)}
              error={fieldErrors.breed}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="btn btn-primary md:btn-sm px-10 uppercase md:w-[275px]"
              disabled={isSaveDisabled}
              onClick={onSave}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
