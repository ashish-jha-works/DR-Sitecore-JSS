import ChevronDown from 'assets/icons/ChevronDown';
import CalendarIcon from 'assets/icons/CalendarIcon';
import CrossIcon from 'assets/icons/CrossIcon';
import InfoIcon from 'assets/icons/InfoIcon';
import MaintenanceIcon from 'assets/icons/MaintenanceIcon';
import { CustomRichText } from 'src/common/SitecoreOverrides';
import InfoMessage from 'src/components/InfoMessage';
import { Input } from 'src/components/common/Input';
import {
  FamilyMemberFieldErrors,
  FamilyMemberFormState,
  FamilyMemberModalMode,
  FamilyMemberModalStep,
} from './useFamilyMembers';

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  mode: FamilyMemberModalMode;
  modalStep: FamilyMemberModalStep;
  showPermissionsStep: boolean;
  permissionsAcknowledged: boolean;
  fields?: any;
  form: FamilyMemberFormState;
  fieldErrors: FamilyMemberFieldErrors;
  relationshipOptions: string[];
  isFieldsEditable: boolean;
  isSaving: boolean;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onMobileChange: (value: string) => void;
  onRelationshipChange: (value: string) => void;
  onRequiresSubProfileChange: (value: boolean) => void;
  onPermissionsAcknowledgedChange: (value: boolean) => void;
}

function PermissionsStep({ fields }: { fields?: any }) {
  return (
    <div className="text-left">
      <InfoMessage IconComponent={InfoIcon} status="normal" className="mb-5">
        <CustomRichText
          field={fields?.dependentSubProfilePermissionsBanner}
          className="text-body text-navy-500 font-light [&_p]:m-0"
        />
      </InfoMessage>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <div className="rounded-xl border border-lilac-200 bg-white-pure p-4 md:p-5">
          <div className="flex items-center gap-3 mb-3">
            <MaintenanceIcon className="text-lilac-500 shrink-0" width={28} height={28} />
            <h6 className="text-body text-navy-500 font-medium">Maintenance</h6>
          </div>
          <CustomRichText
            field={fields?.dependentSubProfileMaintenanceText}
            className="text-body-sm text-navy-500 font-light [&_p]:m-0"
          />
        </div>

        <div className="rounded-xl border border-lilac-200 bg-white-pure p-4 md:p-5">
          <div className="flex items-center gap-3 mb-3">
            <CalendarIcon className="text-lilac-500 shrink-0" width={28} height={28} />
            <h6 className="text-body text-navy-500 font-medium">Event updates</h6>
          </div>
          <CustomRichText
            field={fields?.dependentSubProfileEventsText}
            className="text-body-sm text-navy-500 font-light [&_p]:m-0"
          />
        </div>
      </div>
    </div>
  );
}

export default function AddFamilyMemberModal({
  isOpen,
  mode,
  modalStep,
  permissionsAcknowledged,
  fields,
  form,
  fieldErrors,
  relationshipOptions,
  isFieldsEditable,
  isSaving,
  onClose,
  onNext,
  onBack,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onMobileChange,
  onRelationshipChange,
  onRequiresSubProfileChange,
  onPermissionsAcknowledgedChange,
}: AddFamilyMemberModalProps) {
  const isAddMode = mode === 'add';
  const title = isAddMode ? 'Add dependent' : 'Edit dependent';
  const isDetailsStep = modalStep === 'details';
  const isPermissionsStep = modalStep === 'permissions';

  const isDetailsFormValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.mobile.trim() &&
    form.relationship;

  const isPrimaryDisabled =
    isSaving ||
    (isDetailsStep && !isDetailsFormValid) ||
    (isPermissionsStep && !permissionsAcknowledged);

  const primaryLabel = isAddMode ? 'ADD DEPENDENT' : 'SAVE CHANGES';

  return (
    <div className={`custom-modal ${isOpen ? 'show' : ''}`}>
      <div className="custom-modal__wrapper !max-w-[780px]">
        <div className="flex items-center mb-5 md:mb-6">
          <h4 className="text-navy-500 text-heading-2 text-start font-normal grow">{title}</h4>
          <button type="button" className="shrink" onClick={onClose} disabled={isSaving}>
            <CrossIcon className="text-lilac-500 size-6 cursor-pointer" />
          </button>
        </div>

        {isDetailsStep ? (
          <>
            <InfoMessage IconComponent={InfoIcon} status="normal" className="mb-5 text-left">
              <CustomRichText
                field={fields?.addDependentInfoText}
                className="text-body text-navy-500 font-light [&_p]:m-0"
              />
            </InfoMessage>

            <div className="form-group !text-start">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-1 md:gap-x-5 md:gap-y-3">
                <Input
                  label="First name"
                  value={form.firstName}
                  onChange={(e) => onFirstNameChange(e.target.value)}
                  disabled={!isFieldsEditable}
                  error={fieldErrors.firstName}
                />
                <Input
                  label="Last name"
                  value={form.lastName}
                  onChange={(e) => onLastNameChange(e.target.value)}
                  disabled={!isFieldsEditable}
                  error={fieldErrors.lastName}
                />
                <Input
                  label="Email"
                  value={form.email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  type="email"
                  disabled={!isFieldsEditable}
                  error={fieldErrors.email}
                />
                <Input
                  label="Mobile number (05X XXXXXXX)"
                  value={form.mobile}
                  onChange={(e) => onMobileChange(e.target.value)}
                  disabled={!isFieldsEditable}
                  error={fieldErrors.mobile}
                />
                <div>
                  <label
                    htmlFor="add-family-relationship"
                    className="mb-2 block font-light text-body text-navy-500"
                  >
                    Relationship
                  </label>
                  <div className="relative">
                    <select
                      id="add-family-relationship"
                      value={form.relationship}
                      onChange={(e) => onRelationshipChange(e.target.value)}
                      disabled={!isFieldsEditable}
                      className="w-full appearance-none rounded-xl border border-lilac-500 bg-white-pure px-4 py-3 pe-10 font-light text-body text-navy-500 outline-none glow focus:border-navy-500 focus:ring-0 focus:shadow-none disabled:cursor-not-allowed disabled:bg-lilac-100 disabled:text-lilac-700"
                    >
                      <option value="">Select</option>
                      {relationshipOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lilac-500"
                      width={20}
                      height={20}
                    />
                  </div>
                  {fieldErrors.relationship ? (
                    <p className="text-danger-500 text-body-xs mt-1">{fieldErrors.relationship}</p>
                  ) : null}
                </div>
              </div>

              {isFieldsEditable ? (
                <>
                  <div className="mt-4 mb-2 md:mt-6 md:mb-3 text-left flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onRequiresSubProfileChange(!form.requiresSubProfile)}
                      className={`relative inline-flex h-7 w-12 rounded-full transition-colors ${
                        form.requiresSubProfile ? 'bg-success-500' : 'bg-danger-500'
                      }`}
                      aria-label="Toggle sub profile requirement"
                      disabled={isSaving}
                    >
                      <span
                        className={`absolute top-0.5 size-6 rounded-full bg-white-pure transition-transform ${
                          form.requiresSubProfile ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <span className="text-body text-navy-500 font-light">
                      Will the dependent require a sub profile?
                    </span>
                  </div>

                  <CustomRichText
                    field={fields?.dependentSubProfileHelpText}
                    className="text-body-sm text-navy-500 font-light text-left mt-2 [&_p]:m-0"
                  />
                </>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <PermissionsStep fields={fields} />
            <label className="mt-5 flex items-start gap-3 text-left cursor-pointer">
              <input
                type="checkbox"
                checked={permissionsAcknowledged}
                onChange={(e) => onPermissionsAcknowledgedChange(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 rounded border-lilac-400 text-lilac-500 focus:ring-lilac-500"
                disabled={isSaving}
              />
              <CustomRichText
                field={fields?.dependentSubProfileAcknowledgementText}
                className="text-body text-navy-500 font-light [&_p]:m-0"
              />
            </label>
          </>
        )}

        {isFieldsEditable ? (
          <div
            className={`mt-6 flex gap-3 ${
              isPermissionsStep ? 'flex-col sm:flex-row' : 'justify-end'
            }`}
          >
            {isPermissionsStep ? (
              <button
                type="button"
                className="btn btn-secondary uppercase w-full sm:flex-1"
                onClick={onBack}
                disabled={isSaving}
              >
                BACK
              </button>
            ) : null}
            <button
              type="button"
              className={`btn btn-primary uppercase ${
                isPermissionsStep
                  ? 'w-full sm:flex-1'
                  : 'h-11 md:h-[60px] w-full md:w-[275px] md:max-w-none'
              }`}
              disabled={isPrimaryDisabled}
              onClick={onNext}
            >
              {primaryLabel}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
