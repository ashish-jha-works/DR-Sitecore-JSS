import React from 'react';
import { ChequePaymentPageProps } from './ChequePaymentPage.types';
import RenewalStepper from 'components/Renewals/Stepper/RenewalsStepper';
import { useChequePayment } from './useChequePayment';
import { Text } from 'src/common/SitecoreOverrides';
import { Radio } from 'components/common/Radio';
import InfoMessage from 'components/InfoMessage';
import CircleInfoIcon from 'assets/icons/CircleInfoIcon';
import ChequeDetails from './ChequeDetails';
import ChequeIssuerDetails from './ChequeIssuerDetails';
import ChequePaymentPageSkeleton from './ChequePaymentPageSkeleton';

const ChequePaymentPage = ({ fields }: ChequePaymentPageProps) => {
  const {
    setStepperAPIData,
    isLoading,
    handleCancelJourney,
    handleSubmitChequeDetails,
    chequeFromThirdPartyOptions,
    isChequeFromThirdParty,
    setIsChequeFromThirdParty,
    isSameBankForAllCheque,
    setIsSameBankForAllCheque,
    bankList,
    chequeIssuerOptions,
    chequeIssuerType,
    setChequeIssuerType,

    // Cheque details
    chequeInstallments,
    setChequeNumber,
    setBankName,
    saveChequeInstallment,
    editChequeInstallment,
    cancelChequeInstallment,

    // Cheque issuer details
    individualValues,
    companyValues,
    savedIndividualValues,
    savedCompanyValues,
    issuerDetailsStatus,
    updateIndividualField,
    updateCompanyField,
    updateIndividualDateField,
    updateCompanyDateField,
    saveIssuerDetails,
    editIssuerDetails,
    cancelIssuerDetails,

    isSubmitEnabled,
  } = useChequePayment();

  return (
    <>
      <RenewalStepper setStepperAPIData={setStepperAPIData} />
      {isLoading ? (
        <ChequePaymentPageSkeleton />
      ) : (
        <div className="container-sm py-8 md:py-10 flex flex-col gap-5 md:gap-6">
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
            <div className="flex flex-col gap-2 lg:gap-3">
              <div className="flex items-center gap-4">
                <Text tag="h1" field={fields?.heading} className="text-[16px] md:text-[20px]" />
              </div>
            </div>
            {fields?.warningInfoText?.value ? (
              <InfoMessage IconComponent={CircleInfoIcon} status="warning">
                <p className="text-body text-left">{fields.warningInfoText.value}</p>
              </InfoMessage>
            ) : null}
            <div className="form-group flex flex-col gap-4 !text-start">
              <Text
                tag="p"
                field={fields?.chequeIssuedByThirdPartyOptionsLabel}
                className="text-body font-light"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-2 md:gap-x-5 md:gap-y-4">
                {chequeFromThirdPartyOptions.map(({ label, value }) => {
                  const isSelected = isChequeFromThirdParty === value;

                  return (
                    <Radio
                      key={value}
                      id={`cheque-from-third-party-${value.toLowerCase()}`}
                      name="cheque-from-third-party"
                      value={value}
                      label={label}
                      checked={isSelected}
                      onChange={setIsChequeFromThirdParty}
                      className={`w-full border rounded-lg p-3 md:p-4 flex-row-reverse justify-between items-center mb-0! ${
                        isSelected
                          ? 'bg-lilac-100 border-lilac-400'
                          : 'bg-white-pure border-lilac-300'
                      }`}
                      inputClassName="size-4!"
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {isChequeFromThirdParty === 'Yes' ? (
            <ChequeIssuerDetails
              fields={fields}
              chequeIssuerOptions={chequeIssuerOptions}
              chequeIssuerType={chequeIssuerType}
              setChequeIssuerType={setChequeIssuerType}
              individualValues={individualValues}
              companyValues={companyValues}
              savedIndividualValues={savedIndividualValues}
              savedCompanyValues={savedCompanyValues}
              status={issuerDetailsStatus}
              onChangeIndividualField={updateIndividualField}
              onChangeCompanyField={updateCompanyField}
              onChangeIndividualDateField={updateIndividualDateField}
              onChangeCompanyDateField={updateCompanyDateField}
              onSave={saveIssuerDetails}
              onCancel={cancelIssuerDetails}
              onEdit={editIssuerDetails}
            />
          ) : null}

          {isChequeFromThirdParty ? (
            <ChequeDetails
              fields={fields}
              isSameBankForAllCheque={isSameBankForAllCheque}
              setIsSameBankForAllCheque={setIsSameBankForAllCheque}
              bankList={bankList}
              installments={chequeInstallments}
              onChangeChequeNumber={setChequeNumber}
              onChangeBankName={setBankName}
              onSaveInstallment={saveChequeInstallment}
              onCancelInstallment={cancelChequeInstallment}
              onEditInstallment={editChequeInstallment}
            />
          ) : null}

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
              onClick={handleSubmitChequeDetails}
              disabled={isLoading || !isSubmitEnabled}
            >
              {fields?.submitCTALabel?.value}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChequePaymentPage;
