import React from 'react';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';

import { Input } from 'components/common/Input';
import Select from 'components/common/Select';
import RenewalStepper from 'components/Renewals/Stepper/RenewalsStepper';
import { formatAmount } from 'lib/utils/helper';

import { DirectDebitPageProps } from './DirectDebitPage.types';
import DirectDebitPageSkeleton from './DirectDebitPageSkeleton';
import { useDirectDebitPage } from './useDirectDebitPage';

const DirectDebitPage = ({ fields }: DirectDebitPageProps) => {
  const {
    beneficiaryName,
    beneficiaryMobileNo,
    beneficiaryEmail,
    bankList,
    selectedBank,
    setSelectedBank,
    iban,
    setIban,
    trObIbanRemainingChars,
    handleTrObIbanChange,
    setStepperAPIData,
    monthlyDeduction,
    isLoading,
    handleCancelJourney,
    handleSubmitDirectDebitDetails,
  } = useDirectDebitPage();
  return (
    <>
      <RenewalStepper setStepperAPIData={setStepperAPIData} />
      <div className="container-sm py-8 md:py-10 flex flex-col gap-5 md:gap-6">
        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-2 lg:gap-3">
            <div className="flex items-center py-1.5 lg:py-3 gap-4">
              <CustomRichText field={fields?.headerIcon} />
              <Text tag="h1" field={fields?.heading} className="text-[16px] md:text-[20px]" />
            </div>
            <div className="font-light text-body">
              <Text tag="p" field={fields?.desc} className="inline" />
            </div>
          </div>
          {isLoading ? (
            <DirectDebitPageSkeleton />
          ) : (
            <div className="form-group !text-start">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-1 md:gap-x-5 md:gap-y-3">
                <Input
                  label="Title of account (beneficiary name)"
                  value={beneficiaryName}
                  disabled={true}
                  containerClassName="mt-0!"
                />
                <Input
                  label="Monthly deduction (AED)"
                  value={'AED ' + formatAmount(monthlyDeduction)}
                  disabled={true}
                  containerClassName="mt-0!"
                />
                <Input
                  label="Email"
                  value={beneficiaryEmail as string}
                  disabled={true}
                  containerClassName="mt-0!"
                />
                <Input
                  label={'Mobile number (05X XXXXXXX)'}
                  value={beneficiaryMobileNo as string}
                  disabled={true}
                  containerClassName="mt-0!"
                />
                <Select
                  label="Bank name"
                  placeholder={'Select...'}
                  options={bankList?.length ? bankList : []}
                  value={selectedBank}
                  onChange={setSelectedBank}
                />
                <Input
                  label="IBAN number"
                  value={iban}
                  onChange={(e) => handleTrObIbanChange(e.target.value)}
                  onClear={() => setIban('')}
                  placeholder="AE"
                  maxLength={23}
                  helperText={
                    trObIbanRemainingChars > 0
                      ? `${trObIbanRemainingChars} ${
                          trObIbanRemainingChars === 1 ? 'character' : 'characters'
                        } remaining`
                      : undefined
                  }
                  containerClassName="lg:mt-0!"
                />
              </div>
            </div>
          )}
        </div>
        <div className="btn-wrapper flex flex-col lg:flex-row lg:justify-end items-end gap-4 md:gap-6">
          <button
            className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15 uppercase"
            disabled={isLoading}
            onClick={handleCancelJourney}
          >
            {fields?.cancelCTALabel?.value}
          </button>
          <button
            className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
            onClick={handleSubmitDirectDebitDetails}
            disabled={!selectedBank || iban?.length !== 23}
          >
            {fields?.submitCTALabel?.value}
          </button>
        </div>
      </div>
    </>
  );
};

export default DirectDebitPage;
