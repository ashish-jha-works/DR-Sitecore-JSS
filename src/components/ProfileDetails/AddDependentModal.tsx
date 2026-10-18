import CalendarIcon from 'assets/icons/CalendarIcon';
import CrossIcon from 'assets/icons/CrossIcon';
import InfoIcon from 'assets/icons/InfoIcon';
import MaintenanceIcon from 'assets/icons/MaintenanceIcon';
import { CustomRichText } from 'src/common/SitecoreOverrides';
import InfoMessage from 'src/components/InfoMessage';
import { Input } from 'src/components/common/Input';
import {
  DomesticWorkerFieldErrors,
  DomesticWorkerFormState,
  DomesticWorkerModalMode,
  DomesticWorkerModalStep,
} from './useDomesticWorkers';

interface AddDependentModalProps {
  isOpen: boolean;
  mode: DomesticWorkerModalMode;
  modalStep: DomesticWorkerModalStep;
  permissionsAcknowledged: boolean;
  fields?: any;
  form: DomesticWorkerFormState;
  fieldErrors: DomesticWorkerFieldErrors;
  isFieldsEditable: boolean;
  isSaving: boolean;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onMobileChange: (value: string) => void;
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

export default function AddDependentModal({
  isOpen,
  mode,
  modalStep,
  permissionsAcknowledged,
  fields,
  form,
  fieldErrors,
  isFieldsEditable,
  isSaving,
  onClose,
  onNext,
  onBack,
  onFirstNameChange,
  onLastNameChange,
  onMobileChange,
  onRequiresSubProfileChange,
  onPermissionsAcknowledgedChange,
}: AddDependentModalProps) {
  const isAddMode = mode === 'add';
  const title = isAddMode ? 'Add dependent details' : 'Edit dependent details';
  const isDetailsStep = modalStep === 'details';
  const isPermissionsStep = modalStep === 'permissions';

  const isDetailsFormValid = form.firstName.trim() && form.lastName.trim() && form.mobile.trim();

  const isPrimaryDisabled =
    isSaving ||
    (isDetailsStep && !isDetailsFormValid) ||
    (isPermissionsStep && !permissionsAcknowledged);

  const primaryLabel = isPermissionsStep
    ? isAddMode
      ? 'Add Dependent'
      : 'Save Changes'
    : isAddMode
    ? 'Add Dependent'
    : 'Save Changes';

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
                  label="Name"
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
              </div>

              <div className="max-w-[360px] mt-3">
                <Input
                  label="Mobile number (05X XXXXXXX)"
                  value={form.mobile}
                  onChange={(e) => onMobileChange(e.target.value)}
                  disabled={!isFieldsEditable}
                  error={fieldErrors.mobile}
                />
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
                      Will the domestic worker require a sub profile?
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
              className={`btn btn-primary ${
                isPermissionsStep ? 'uppercase w-full sm:flex-1' : 'md:btn-sm px-10'
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
