import { useParkingStorage } from 'components/ProfileDetails/useParkingStorage';
import React from 'react';
import { useUserStore } from 'src/store/useUserStore';

import RenewalStepper from '../Stepper/RenewalsStepper';
import InstallmentPlan from './InstallmentPlan/InstallmentPlan';
import PaymentOptions from './PaymentOptions/PaymentOptions';
import PaymentPlanSkeleton from './PaymentPlanSkeleton';
import type { PaymentPlanFields } from './paymentPlan.types';
import { usePaymentPlan } from './usePaymentPlan';

interface PaymentPlanProps {
  fields: PaymentPlanFields;
}

const PaymentPlan: React.FC<PaymentPlanProps> = ({ fields }) => {
  const { tCode } = useUserStore();
  const { parkingSpaces, storageSpaces } = useParkingStorage(tCode);
  const {
    setStepperAPIData,
    isLoading,
    defaultSelectedInstallmentPlan,
    selectedInstallmentPlan,
    setSelectedInstallmentPlan,
    selectedInstallmentPlanData,
    selectedPaymentPlan,
    setSelectedPaymentPlan,
    paymentOptions,
    renewalSpecialsType,
    renewalChargeType,
    invoiceFrequencyInstallment,
    allPaymentTypeInstallmentData,
    isSubmitDisabled,
    handleCancelJourney,
    handleSubmitContractRenewal,
  } = usePaymentPlan();

  return (
    <div className="contract-renewal">
      <RenewalStepper setStepperAPIData={setStepperAPIData} />
      {isLoading ? (
        <PaymentPlanSkeleton />
      ) : (
        <div className="relative lg:static container-sm py-8 md:py-10 flex flex-col gap-5 md:gap-6">
          <InstallmentPlan
            fields={fields}
            defaultSelectedInstallmentPlan={defaultSelectedInstallmentPlan}
            selectedInstallmentPlan={selectedInstallmentPlan}
            setSelectedInstallmentPlan={setSelectedInstallmentPlan}
            renewalProposalData={selectedInstallmentPlanData?.RenewalProposal}
            renewalSpecialsType={renewalSpecialsType}
            renewalChargeType={renewalChargeType}
            invoiceFrequencyInstallment={invoiceFrequencyInstallment}
            parkingSpaces={parkingSpaces}
            storageSpaces={storageSpaces}
          />
          <PaymentOptions
            fields={fields}
            paymentOptions={paymentOptions}
            selectedPaymentPlan={selectedPaymentPlan}
            setSelectedPaymentPlan={setSelectedPaymentPlan}
            selectedInstallmentPlan={selectedInstallmentPlan}
            allPaymentTypeInstallmentData={allPaymentTypeInstallmentData}
          />
          <div className="btn-wrapper flex flex-col gap-4 items-end justify-end md:flex-row md:gap-6 mt-2">
            <button
              className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15 uppercase"
              onClick={handleCancelJourney}
            >
              {fields?.cancelCTALabel?.value}
            </button>
            <button
              className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase ${
                isSubmitDisabled ? 'disabled' : ''
              }`}
              onClick={handleSubmitContractRenewal}
            >
              {fields?.submitCTALabel?.value}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPlan;
