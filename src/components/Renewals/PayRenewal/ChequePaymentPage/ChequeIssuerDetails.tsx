import { CustomRichText, Text } from 'src/common/SitecoreOverrides';
import { Input } from 'components/common/Input';
import { Radio } from 'components/common/Radio';
import DateInput from 'components/common/DateInput';
import { ChangeEvent, useMemo, useState } from 'react';
import {
  ChequeSectionStatus,
  CompanyIssuerFields,
  IndividualIssuerFields,
} from './ChequePaymentPage.types';

/* ---------------- Per-field validation config ---------------- */

const ALPHANUMERIC_PATTERN = /^[a-zA-Z0-9]+$/;
const NUMERIC_PATTERN = /^[0-9]+$/;

const individualFieldRules = {
  chequeIssuerName: { type: 'text', minLength: 1, maxLength: 50 },
  passportNumber: {
    type: 'text',
    minLength: 6,
    maxLength: 20,
    pattern: ALPHANUMERIC_PATTERN,
    patternMessage: 'Passport number can only contain letters and numbers',
  },
  passportExpiry: { type: 'date' },
  EIDNumber: {
    type: 'text',
    minLength: 15,
    maxLength: 15,
    pattern: NUMERIC_PATTERN,
    patternMessage: 'EID number must contain only digits',
  },
  EIDExpiry: { type: 'date' },
};

const companyFieldRules: Record<keyof CompanyIssuerFields, any> = {
  chequeIssuerName: { type: 'text', minLength: 1, maxLength: 100 },
  tradeLicenseNumber: { type: 'text', minLength: 1, maxLength: 20 },
  tradeLicenseExpiry: { type: 'date' },
};

const isTextRule = (rule: any) => rule.type === 'text';

// Returns an error message for a text field, or undefined if it's valid.
const getTextFieldError = (value: string, rule: any): string | undefined => {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'This field is required';
  if (trimmed.length < rule.minLength) {
    return `Minimum ${rule.minLength} character${rule.minLength > 1 ? 's' : ''} required`;
  }
  if (trimmed.length > rule.maxLength) return `Maximum ${rule.maxLength} characters allowed`;
  if (rule.pattern && !rule.pattern.test(trimmed)) {
    return rule.patternMessage || 'Invalid format';
  }
  return undefined;
};

const isTextFieldValid = (value: string, rule: any) => !getTextFieldError(value, rule);

const isDateFieldValid = (value: Date | null) => value instanceof Date && !isNaN(value.getTime());

const isFieldValid = (rule: any, value: string | Date | null) =>
  rule.type === 'date'
    ? isDateFieldValid(value as Date | null)
    : isTextFieldValid(value as string, rule);

const valuesEqual = (a: unknown, b: unknown) => {
  if (a instanceof Date || b instanceof Date) {
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
  }
  return a === b;
};

// Expiry dates must be today or later - build "today" at midnight so today
// itself isn't excluded by the current time-of-day.
const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

type ChequeIssuerDetailsProps = {
  fields: any;
  chequeIssuerOptions: { label: string; value: string }[];
  chequeIssuerType: string | undefined;
  setChequeIssuerType: (value: string) => void;
  individualValues: IndividualIssuerFields;
  companyValues: CompanyIssuerFields;
  savedIndividualValues: IndividualIssuerFields | null;
  savedCompanyValues: CompanyIssuerFields | null;
  status: ChequeSectionStatus;
  onChangeIndividualField: (key: keyof IndividualIssuerFields, value: string) => void;
  onChangeCompanyField: (key: keyof CompanyIssuerFields, value: string) => void;
  onChangeIndividualDateField: (key: keyof IndividualIssuerFields, value: Date | null) => void;
  onChangeCompanyDateField: (key: keyof CompanyIssuerFields, value: Date | null) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
};

export default function ChequeIssuerDetails({
  fields,
  chequeIssuerOptions,
  chequeIssuerType,
  setChequeIssuerType,
  individualValues,
  companyValues,
  savedIndividualValues,
  savedCompanyValues,
  status,
  onChangeIndividualField,
  onChangeCompanyField,
  onChangeIndividualDateField,
  onChangeCompanyDateField,
  onSave,
  onCancel,
  onEdit,
}: ChequeIssuerDetailsProps) {
  const isIndividual = chequeIssuerType === 'Individual';
  const isCompany = chequeIssuerType === 'Company';

  const isDisabled = status === 'saved';
  const isRadioDisabled = status === 'saved';

  const currentValues = isIndividual ? individualValues : isCompany ? companyValues : null;
  const savedValues = isIndividual ? savedIndividualValues : isCompany ? savedCompanyValues : null;

  const minExpiryDate = useMemo(() => getStartOfToday(), []);

  // Which text fields the user has interacted with - errors only surface
  // for a field once it's been touched, not on a still-empty pristine field.
  const [touchedIndividualFields, setTouchedIndividualFields] = useState<
    Partial<Record<keyof IndividualIssuerFields, boolean>>
  >({});
  const [touchedCompanyFields, setTouchedCompanyFields] = useState<
    Partial<Record<keyof CompanyIssuerFields, boolean>>
  >({});

  const markIndividualTouched = (key: keyof IndividualIssuerFields) => () => {
    setTouchedIndividualFields((prev) => ({ ...prev, [key]: true }));
  };

  const markCompanyTouched = (key: keyof CompanyIssuerFields) => () => {
    setTouchedCompanyFields((prev) => ({ ...prev, [key]: true }));
  };

  const getIndividualError = (key: keyof IndividualIssuerFields) => {
    const rule = individualFieldRules[key];
    if (!touchedIndividualFields[key] || !isTextRule(rule)) return undefined;
    return getTextFieldError(individualValues[key] as string, rule);
  };

  const getCompanyError = (key: keyof CompanyIssuerFields) => {
    const rule = companyFieldRules[key];
    if (!touchedCompanyFields[key] || !isTextRule(rule)) return undefined;
    return getTextFieldError(companyValues[key] as string, rule);
  };

  const canSave = useMemo(() => {
    if (isIndividual) {
      return (Object.keys(individualFieldRules) as (keyof IndividualIssuerFields)[]).every((key) =>
        isFieldValid(individualFieldRules[key], individualValues[key])
      );
    }
    if (isCompany) {
      return (Object.keys(companyFieldRules) as (keyof CompanyIssuerFields)[]).every((key) =>
        isFieldValid(companyFieldRules[key], companyValues[key])
      );
    }
    return false;
  }, [isIndividual, isCompany, individualValues, companyValues]);

  const isDirty = useMemo(() => {
    if (!currentValues) return false;
    if (savedValues) {
      return Object.keys(currentValues).some(
        (key) => !valuesEqual((currentValues as any)[key], (savedValues as any)[key])
      );
    }
    return Object.values(currentValues).some((value) => !!value);
  }, [currentValues, savedValues]);

  const showCancel = Boolean(savedValues) || isDirty;

  const handleIndividualInputChange =
    (key: keyof IndividualIssuerFields) => (e: ChangeEvent<HTMLInputElement>) => {
      onChangeIndividualField(key, e.target.value);
    };

  const handleCompanyInputChange =
    (key: keyof CompanyIssuerFields) => (e: ChangeEvent<HTMLInputElement>) => {
      onChangeCompanyField(key, e.target.value);
    };

  const handleCancel = () => {
    setTouchedIndividualFields({});
    setTouchedCompanyFields({});
    onCancel();
  };

  return (
    <div className="form-group bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col gap-2 lg:gap-3">
        <div className="flex items-center gap-4">
          <CustomRichText field={fields?.chequeIssuerDetailsHeadingIcon} />
          <Text
            tag="h1"
            field={fields?.chequeIssuerDetailsHeading}
            className="text-[16px] md:text-[20px]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 !text-start">
        <Text tag="p" field={fields?.chequeIssuerDetailsDesc} className="text-body font-light" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-2 md:gap-x-5 md:gap-y-4">
          {chequeIssuerOptions.map(({ label, value }) => {
            const isSelected = chequeIssuerType === value;

            return (
              <Radio
                key={value}
                id={`cheque-issuer-type-${value.toLowerCase()}`}
                name="cheque-issuer-type"
                value={value}
                label={label}
                checked={isSelected}
                disabled={isRadioDisabled}
                onChange={setChequeIssuerType}
                className={`w-full border rounded-lg p-3 md:p-4 flex-row-reverse justify-between items-center mb-0! ${
                  isSelected ? 'bg-lilac-100 border-lilac-400' : 'bg-white-pure border-lilac-300'
                }`}
                inputClassName="size-4!"
              />
            );
          })}
        </div>
      </div>

      {isIndividual ? (
        <div className="grid lg:grid-cols-2 gap-y-0 lg:gap-x-6 lg:gap-y-1">
          <Input
            label={fields?.chequeIssuerNameLabel?.value}
            value={individualValues.chequeIssuerName}
            onChange={handleIndividualInputChange('chequeIssuerName')}
            onBlur={markIndividualTouched('chequeIssuerName')}
            disabled={isDisabled}
            maxLength={individualFieldRules.chequeIssuerName.maxLength}
            containerClassName="mt-0!"
            error={getIndividualError('chequeIssuerName')}
          />
          <Input
            label={fields?.passportNumberLabel?.value}
            value={individualValues.passportNumber}
            onChange={handleIndividualInputChange('passportNumber')}
            onBlur={markIndividualTouched('passportNumber')}
            disabled={isDisabled}
            maxLength={individualFieldRules.passportNumber.maxLength}
            containerClassName="mt-0!"
            error={getIndividualError('passportNumber')}
          />
          <DateInput
            label={fields?.passportExpiryLabel?.value}
            selectedDate={individualValues.passportExpiry as any}
            onSelect={(date: Date | null) => onChangeIndividualDateField('passportExpiry', date)}
            disabled={isDisabled}
            disableBefore={minExpiryDate}
            className="mb-2"
          />
          <Input
            label={fields?.EIDNumberLabel?.value}
            value={individualValues.EIDNumber}
            onChange={handleIndividualInputChange('EIDNumber')}
            onBlur={markIndividualTouched('EIDNumber')}
            disabled={isDisabled}
            maxLength={individualFieldRules.EIDNumber.maxLength}
            containerClassName="mt-0!"
            error={getIndividualError('EIDNumber')}
          />
          <DateInput
            label={fields?.EIDExpiryLabel?.value}
            selectedDate={individualValues.EIDExpiry as any}
            onSelect={(date: Date | null) => onChangeIndividualDateField('EIDExpiry', date)}
            disabled={isDisabled}
            disableBefore={minExpiryDate}
          />
        </div>
      ) : null}

      {isCompany ? (
        <div className="grid lg:grid-cols-2 gap-y-2 lg:gap-x-6 lg:gap-y-3">
          <Input
            label={fields?.chequeIssuerNameLabel?.value}
            value={companyValues.chequeIssuerName}
            onChange={handleCompanyInputChange('chequeIssuerName')}
            onBlur={markCompanyTouched('chequeIssuerName')}
            disabled={isDisabled}
            maxLength={companyFieldRules.chequeIssuerName.maxLength}
            containerClassName="mt-0!"
            error={getCompanyError('chequeIssuerName')}
          />
          <Input
            label={fields?.tradeLicenseNumberLabel?.value}
            value={companyValues.tradeLicenseNumber}
            onChange={handleCompanyInputChange('tradeLicenseNumber')}
            onBlur={markCompanyTouched('tradeLicenseNumber')}
            disabled={isDisabled}
            maxLength={companyFieldRules.tradeLicenseNumber.maxLength}
            containerClassName="mt-0!"
            error={getCompanyError('tradeLicenseNumber')}
          />
          <DateInput
            label={fields?.tradeLicenseExpiryLabel?.value}
            selectedDate={companyValues.tradeLicenseExpiry as any}
            onSelect={(date: Date | null) => onChangeCompanyDateField('tradeLicenseExpiry', date)}
            disabled={isDisabled}
            disableBefore={minExpiryDate}
          />
        </div>
      ) : null}

      {isIndividual || isCompany ? (
        <div className="btn-wrapper flex flex-col lg:flex-row lg:justify-end items-end gap-4 md:gap-6">
          {status === 'editing' ? (
            <>
              {showCancel ? (
                <button
                  type="button"
                  className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15 uppercase"
                  onClick={handleCancel}
                >
                  {fields?.chequeIssuerCancelCTALabel?.value}
                </button>
              ) : null}
              <button
                type="button"
                className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
                onClick={onSave}
                disabled={!canSave}
              >
                {fields?.chequeIssuerSaveCTALabel?.value}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
              onClick={onEdit}
            >
              {fields?.chequeIssuerEditCTALabel?.value || 'Edit'}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
