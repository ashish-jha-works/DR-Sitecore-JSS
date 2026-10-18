import React from 'react';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';

import { Radio } from 'components/common/Radio';

import PaymentSchedule from '../PaymentSchedule/PaymentSchedule';

const PaymentOptions = ({
  fields,
  paymentOptions,
  selectedPaymentPlan,
  setSelectedPaymentPlan,
  selectedInstallmentPlan,
  allPaymentTypeInstallmentData,
}: any) => {
  const selectedPaymentInstallmentsDetails = allPaymentTypeInstallmentData?.filter(
    (installmentPlan: any) =>
      installmentPlan?.installmentDetails?.length?.toString() === selectedInstallmentPlan
  )?.[0]?.installmentDetails;
  return (
    <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col gap-5 lg:gap-6">
        <div className="flex items-center gap-4">
          <CustomRichText field={fields?.paymentOptionsHeaderIcon} />
          <Text
            tag="h1"
            field={fields?.paymentOptionsTitle}
            className="text-[16px] md:text-[20px]"
          />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:grid md:grid-cols-4 md:gap-3 -mb-2">
            {paymentOptions.map((option: { Key: number; Value: string }) => {
              const isSelected = selectedPaymentPlan === option.Key;
              const isPaymentPlanDisabled =
                selectedInstallmentPlan === '1' && (option.Key === 3 || option.Key === 4);
              return (
                <Radio
                  key={option.Key}
                  id={`Payment Plan-${option.Key}`}
                  name={'Payment Plan'}
                  value={option.Key}
                  label={option.Value}
                  checked={isSelected}
                  onChange={setSelectedPaymentPlan}
                  className={`w-full border rounded-lg p-3 md:p-4 flex-row-reverse justify-between items-start ${
                    isPaymentPlanDisabled
                      ? 'bg-silver-chalice-300! border-0 opacity-100 cursor-not-allowed!'
                      : ''
                  } ${
                    isSelected ? 'bg-lilac-100 border-lilac-400' : 'bg-white-pure border-lilac-300'
                  }`}
                  inputClassName={`size-4! min-w-4! ${
                    isPaymentPlanDisabled ? 'appearance-none border rounded-full' : ''
                  }`}
                  disabled={isPaymentPlanDisabled}
                />
              );
            })}
          </div>
        </div>
        {selectedPaymentPlan ? (
          <PaymentSchedule
            installmentsDetails={selectedPaymentInstallmentsDetails}
            selectedPaymentPlan={selectedPaymentPlan}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PaymentOptions;
