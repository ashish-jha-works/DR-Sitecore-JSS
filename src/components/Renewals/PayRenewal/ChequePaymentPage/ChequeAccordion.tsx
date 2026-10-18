import { ChangeEvent, useEffect, useState } from 'react';

import ChevronDown from 'assets/icons/ChevronDown';
import { Input } from 'components/common/Input';
import Select from 'components/common/Select';
import { formatAmount } from 'lib/utils/helper';

const CHEQUE_NUMBER_LENGTH = 6;
const CHEQUE_NUMBER_PATTERN = /^[0-9]{6}$/;

export const getChequeNumberError = (value: string): string | undefined => {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'This field is required';
  if (!/^[0-9]+$/.test(trimmed)) return 'Cheque number must contain only digits';
  if (trimmed.length !== CHEQUE_NUMBER_LENGTH) {
    return `Cheque number must be exactly ${CHEQUE_NUMBER_LENGTH} digits`;
  }
  return undefined;
};

export const isChequeNumberValid = (value: string) =>
  CHEQUE_NUMBER_PATTERN.test((value || '').trim());

export default function ChequeAccordion({
  fields,
  installment,
  defaultOpen = false,
  disableAccordion = false,
  bankList,
  chequeNumber,
  bankName,
  status,
  canSave,
  showCancel,
  isBankDisabled,
  onChangeChequeNumber,
  onChangeBank,
  onSave,
  onCancel,
  onEdit,
}: any) {
  const [open, setOpen] = useState(defaultOpen || disableAccordion);

  const [chequeNumberTouched, setChequeNumberTouched] = useState(false);

  const isSaved = status === 'saved';
  const isExpanded = disableAccordion || open;

  useEffect(() => {
    if (disableAccordion) {
      setOpen(true);
    }
  }, [disableAccordion]);

  useEffect(() => {
    if (isSaved) {
      setChequeNumberTouched(false);
    }
  }, [isSaved]);

  const chequeNumberError = chequeNumberTouched ? getChequeNumberError(chequeNumber) : undefined;

  const handleCancel = () => {
    setChequeNumberTouched(false);
    onCancel();
  };

  return (
    <div
      className={`rounded-lg border border-lilac-300 ${!isExpanded ? 'bg-silver-chalice-50' : ''}`}
    >
      {disableAccordion ? (
        <div className="px-4 lg:px-5 pt-4 lg:pt-5">
          <h3 className="text-[16px] lg:text-heading-3">
            Cheque (Instalment {installment.number})
          </h3>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex w-full items-center justify-between p-4 lg:p-5 text-left ${
            open ? 'lg:pb-3' : ''
          }`}
        >
          <h3 className="text-[16px] lg:text-heading-3 py-4">
            Cheque (Instalment {installment.number})
          </h3>

          <span
            className={`inline-block transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          >
            <ChevronDown className="text-lilac-500" />
          </span>
        </button>
      )}

      {/* Body */}
      <div
        className={`form-group overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-fit' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-5 lg:gap-6 px-4 lg:px-5 mb-4 lg:mb-5 mt-4 lg:mt-5">
          <p className="text-body font-light">
            Cheque date and amount are pre-filled based on your payment plan.
          </p>

          <div className="grid lg:grid-cols-2 gap-y-2 lg:gap-x-6 lg:gap-y-3">
            <Input
              label={fields?.chequeDateLabel?.value}
              value={installment.date}
              disabled={true}
              containerClassName="mt-0!"
              className="-mb-2"
            />
            <Input
              label={fields?.chequeAmountLabel?.value}
              value={'AED ' + formatAmount(installment.amount)}
              disabled={true}
              containerClassName="mt-0!"
              className="-mb-2"
            />
            <Input
              label={fields?.chequeNumberLabel?.value}
              value={chequeNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeChequeNumber(e.target.value)}
              onBlur={() => setChequeNumberTouched(true)}
              disabled={isSaved}
              maxLength={CHEQUE_NUMBER_LENGTH}
              containerClassName="mt-0!"
              className="-mb-2"
              error={chequeNumberError}
            />
            <Select
              label={fields?.bankNameLabel?.value}
              placeholder={'Select...'}
              options={bankList?.length ? bankList : []}
              value={bankName}
              onChange={onChangeBank}
              disabled={isSaved || isBankDisabled}
            />
          </div>

          {/* Footer */}
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
        </div>
      </div>
    </div>
  );
}
