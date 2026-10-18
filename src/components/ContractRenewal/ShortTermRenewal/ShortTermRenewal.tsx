'use client';

import { JSX } from 'react';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import ClockIcon from 'assets/icons/ClockIcon';
import CalendarIcon from 'assets/icons/CalendarIcon';
import CircleTickIcon from 'assets/icons/CircleTickIcon';
import InfoIcon from 'assets/icons/InfoIcon';
import InfoMessage from 'components/InfoMessage';
import { CustomModal } from 'components/modals/CustomModal';
import { Radio } from 'components/common/Radio';
import CostBreakdown from 'components/Renewals/ReviewContract/CostBreakdown/CostBreakdown';
import OutstandingPaymentModal from 'components/Renewals/ReviewContract/OutstandingPaymentModal';
import PaymentSchedule from 'components/Renewals/PaymentPlan/PaymentSchedule/PaymentSchedule';
import { useParkingStorage } from 'components/ProfileDetails/useParkingStorage';
import { useUserStore } from 'src/store/useUserStore';

import RadioSelectionSection from '../shared/RadioSelectionSection';
import RenewalStepper from 'components/Renewals/Stepper/RenewalsStepper';
import { useShortTermRenewal } from './useShortTermRenewal';

function formatPeriodLabel(value: string, singular: string, plural: string) {
  return Number(value) === 1 ? `1 ${singular}` : `${value} ${plural}`;
}

export default function ShortTermRenewal({ fields = {} }: { fields?: any }): JSX.Element {
  const { tCode } = useUserStore();
  const { parkingSpaces, storageSpaces } = useParkingStorage(tCode);
  const {
    view,
    extensionPeriod,
    installmentPlan,
    isConfirmDisabled,
    showInfoMessage,
    isSixMonthExtension,
    hasLeasePeriod,
    showSuccessModal,
    isRequestSubmitted,
    hasCheckedStepper,
    submittedLeasePeriod,
    submittedInstallments,
    stepperAPIData,
    renewalProposalData,
    installmentDetails,
    paymentOptions,
    selectedPaymentPlan,
    setSelectedPaymentPlan,
    lockedInstallments,
    outstandingAmount,
    renewalSpecialsType,
    renewalChargeType,
    invoiceFrequencyInstallment,
    isProceedDisabled,
    isLoadingProposal,
    setExtensionPeriod,
    setInstallmentPlan,
    handleCancel,
    handleConfirm,
    handleSuccessModalClose,
    handleProceed,
    handleOutstandingPayLater,
    handleOutstandingProceed,
    isPaymentOptionDisabled,
  } = useShortTermRenewal();

  if (!hasCheckedStepper && !isRequestSubmitted) {
    return <section className="ShortTermRenewal bg-silver-chalice-50 min-h-75" />;
  }

  const extensionPeriodOptions = [
    { value: '1', label: fields?.monthOption1?.value ?? '1 month' },
    { value: '2', label: fields?.monthOption2?.value ?? '2 months' },
    { value: '3', label: fields?.monthOption3?.value ?? '3 months' },
    { value: '4', label: fields?.monthOption4?.value ?? '4 months' },
    { value: '5', label: fields?.monthOption5?.value ?? '5 months' },
    { value: '6', label: fields?.monthOption6?.value ?? '6 months' },
  ];

  const installmentPlanOptions = [
    {
      value: '1',
      label: fields?.installmentOption1?.value ?? '1 installment',
      disabled: !hasLeasePeriod,
    },
    {
      value: '2',
      label: fields?.installmentOption2?.value ?? '2 installments',
      disabled: !hasLeasePeriod || !isSixMonthExtension,
    },
  ];

  const leasePeriodDisplay = formatPeriodLabel(submittedLeasePeriod, 'month', 'months');
  const installmentDisplay = formatPeriodLabel(submittedInstallments, 'instalment', 'instalments');
  const paymentPlanTitle =
    Number(lockedInstallments) === 1
      ? `Payment Plan (${lockedInstallments} Installment)`
      : `Payment Plan (${lockedInstallments} Installments)`;

  return (
    <section className="ShortTermRenewal bg-silver-chalice-50">
      {view === 'proposal' ? <RenewalStepper /> : null}
      <div className="container-sm py-8 md:py-10 flex flex-col gap-5 md:gap-6">
        {view === 'proposal' ? (
          <>
            <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h2 className="text-base md:text-heading-3 font-medium text-navy-500">
                  {paymentPlanTitle}
                </h2>
                <p className="text-body text-navy-500">
                  <span className="font-medium">
                    {fields?.leasePeriodLabel?.value ?? 'Lease period:'}{' '}
                  </span>
                  <span className="font-light">{leasePeriodDisplay}</span>
                </p>
              </div>

              <CostBreakdown
                renewalProposalData={renewalProposalData}
                renewalSpecialsType={renewalSpecialsType}
                renewalChargeType={renewalChargeType}
                invoiceFrequencyInstallment={invoiceFrequencyInstallment}
                parkingSpaces={parkingSpaces}
                storageSpaces={storageSpaces}
              />
            </div>

            <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
              <h2 className="text-base md:text-heading-3 font-medium text-navy-500">
                {fields?.paymentOptionsTitle?.value ?? 'Select payment option'}
              </h2>

              <div className="flex flex-col md:grid md:grid-cols-3 md:gap-3 gap-3">
                {paymentOptions.map((option) => {
                  const isSelected = Number(selectedPaymentPlan) === Number(option.Key);
                  const disabled = isPaymentOptionDisabled(option.Key);
                  return (
                    <Radio
                      key={option.Key}
                      id={`ShortTerm-Payment-${option.Key}`}
                      name="ShortTerm Payment Plan"
                      value={option.Key}
                      label={option.Value}
                      checked={isSelected}
                      onChange={(value: string | number) => setSelectedPaymentPlan(Number(value))}
                      disabled={disabled}
                      className={`w-full border rounded-lg p-3 md:p-4 flex-row-reverse justify-between items-start ${
                        disabled
                          ? 'bg-silver-chalice-300! border-0 opacity-100 cursor-not-allowed!'
                          : ''
                      } ${
                        isSelected
                          ? 'bg-lilac-100 border-lilac-400'
                          : 'bg-white-pure border-lilac-300'
                      }`}
                      inputClassName={`size-4! min-w-4! ${
                        disabled ? 'appearance-none border rounded-full' : ''
                      }`}
                    />
                  );
                })}
              </div>

              {selectedPaymentPlan ? (
                <PaymentSchedule
                  installmentsDetails={installmentDetails}
                  selectedPaymentPlan={selectedPaymentPlan}
                />
              ) : null}
            </div>

            <div className="btn-wrapper flex flex-col md:flex-row justify-end gap-4 md:gap-6">
              <button
                type="button"
                className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15"
                onClick={handleCancel}
              >
                {fields?.cancelButtonText?.value ?? 'CANCEL'}
              </button>
              <button
                type="button"
                className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 ${
                  isProceedDisabled ? 'disabled' : ''
                }`}
                disabled={isProceedDisabled}
                onClick={handleProceed}
              >
                {fields?.proceedButtonText?.value ?? 'PROCEED'}
              </button>
            </div>
          </>
        ) : view === 'waiting' || isRequestSubmitted ? (
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-4 md:gap-6">
            <div className="flex gap-3 md:gap-4 items-center">
              <ClockIcon className="size-7 md:size-8 text-lilac-500 shrink-0" />
              <Text
                tag="h2"
                field={
                  fields?.submittedRequestTitle ?? {
                    value: 'Lease extension request for',
                  }
                }
                className="text-base md:text-heading-3 font-normal text-navy-500"
              />
            </div>

            <div className="flex flex-col gap-2 text-body text-navy-500">
              <p>
                <span className="font-medium">
                  {fields?.leasePeriodLabel?.value ?? 'Lease period:'}
                </span>{' '}
                <span className="font-light">{leasePeriodDisplay}</span>
              </p>
              <p>
                <span className="font-medium">
                  {fields?.installmentPlanLabel?.value ?? 'Payment instalment plan:'}
                </span>{' '}
                <span className="font-light">{installmentDisplay}</span>
              </p>
            </div>

            <InfoMessage IconComponent={CircleTickIcon} status="success">
              <Text
                tag="p"
                field={
                  fields?.submittedSuccessMessage ??
                  fields?.successModalDescription ?? {
                    value:
                      'Your lease extension request has been submitted. You shall be notified once your proposal is ready.',
                  }
                }
                className="text-body font-light"
              />
            </InfoMessage>

            {isLoadingProposal ? (
              <p className="text-body font-light text-navy-400">Checking proposal status...</p>
            ) : null}
          </div>
        ) : (
          <>
            <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-4 md:gap-6">
              <RadioSelectionSection
                icon={<ClockIcon className="size-7 md:size-8 text-lilac-500 shrink-0" />}
                title={fields?.extensionPeriodTitle}
                name="extensionPeriod"
                options={extensionPeriodOptions}
                selectedValue={extensionPeriod}
                onSelect={setExtensionPeriod}
                gridClassName="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-4"
              />

              <RadioSelectionSection
                icon={<CalendarIcon className="size-7 md:size-8 text-lilac-500 shrink-0" />}
                title={fields?.installmentPlanTitle}
                name="installmentPlan"
                options={installmentPlanOptions}
                selectedValue={installmentPlan}
                onSelect={setInstallmentPlan}
                gridClassName="flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-4"
              />

              {showInfoMessage && (
                <InfoMessage IconComponent={InfoIcon} status="normal" className="!border-lilac-400">
                  <p className="text-body font-light">{fields?.infoMessage?.value}</p>
                </InfoMessage>
              )}
            </div>

            <div className="btn-wrapper flex flex-col md:flex-row justify-end gap-4 md:gap-6">
              <button
                type="button"
                className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15"
                onClick={handleCancel}
              >
                {fields?.cancelButtonText?.value}
              </button>
              <button
                type="button"
                className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 ${
                  isConfirmDisabled ? 'disabled' : ''
                }`}
                disabled={isConfirmDisabled}
                onClick={handleConfirm}
              >
                {fields?.confirmButtonText?.value}
              </button>
            </div>
          </>
        )}
      </div>

      <CustomModal
        showModal={showSuccessModal}
        setShowModal={(isOpen) => {
          if (!isOpen) handleSuccessModalClose();
        }}
        modalType="success"
        imagePath="/assets/svg/property-send.svg"
        heading={fields?.successModalHeading?.value}
        description={fields?.successModalDescription?.value}
        primaryBtnLabel={fields?.successModalButtonText?.value}
        handlePrimaryBtnClick={handleSuccessModalClose}
      />

      <OutstandingPaymentModal
        outstandingAmount={outstandingAmount}
        outstandingThresholdAmount={Number(stepperAPIData?.OutstandingThresholdAmount) || 1000}
        onPayLater={handleOutstandingPayLater}
        onProceed={handleOutstandingProceed}
        onPayNow={() => {
          window.location.href = '/payment';
        }}
      />
    </section>
  );
}
