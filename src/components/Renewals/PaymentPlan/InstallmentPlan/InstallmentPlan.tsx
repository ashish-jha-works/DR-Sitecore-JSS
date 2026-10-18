import React from 'react';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';

import CircleInfoIcon from 'assets/icons/CircleInfoIcon';
import { Radio } from 'components/common/Radio';
import InfoMessage from 'components/InfoMessage';
import CostBreakdown from 'components/Renewals/ReviewContract/CostBreakdown/CostBreakdown';

const installmentPlanOptions = [
  { label: '1', value: '1', enabled: true },
  { label: '2', value: '2', enabled: true },
  { label: '4', value: '4', enabled: true },
  { label: '6', value: '6', enabled: true },
  { label: '12', value: '12', enabled: true },
];

const InstallmentPlan = ({
  fields,
  defaultSelectedInstallmentPlan,
  selectedInstallmentPlan,
  setSelectedInstallmentPlan,
  renewalProposalData,
  renewalSpecialsType,
  renewalChargeType,
  invoiceFrequencyInstallment,
  parkingSpaces = [],
  storageSpaces = [],
}: any) => {
  return (
    <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col gap-5 lg:gap-6">
        <div className="flex items-center gap-4">
          <CustomRichText field={fields?.headerIcon} />
          <Text tag="h1" field={fields?.title} className="text-[16px] md:text-[20px]" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {installmentPlanOptions
              ?.filter(
                (installment) => parseInt(installment?.value) <= defaultSelectedInstallmentPlan
              )
              ?.map((option: any) => {
                const isSelected = selectedInstallmentPlan === option.value;

                return (
                  <Radio
                    key={option.value}
                    id={`Installment Plan-${option.value}`}
                    name={'Installment Plan'}
                    value={option.value}
                    label={option.label}
                    checked={isSelected}
                    onChange={setSelectedInstallmentPlan}
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
          {selectedInstallmentPlan === '12' &&
          Number(
            renewalProposalData?.RES_Renewal_Specials?.ME_RES_Renewal_Specials_V?.CHARGE_AMOUNT
          ) > 0 ? (
            <InfoMessage IconComponent={CircleInfoIcon} status="warning">
              <p className="text-body font-light">
                Selecting the 12 months instalments payment plan incurs an additional fee of AED{' '}
                {
                  renewalProposalData?.RES_Renewal_Specials?.ME_RES_Renewal_Specials_V
                    ?.CHARGE_AMOUNT
                }
                , payable in twelve (12) monthly instalments together with the rent.​
              </p>
            </InfoMessage>
          ) : null}
          <CostBreakdown
            renewalProposalData={renewalProposalData}
            renewalSpecialsType={renewalSpecialsType}
            renewalChargeType={renewalChargeType}
            invoiceFrequencyInstallment={invoiceFrequencyInstallment}
            containerClassName={'lg:mt-8'}
            parkingSpaces={parkingSpaces}
            storageSpaces={storageSpaces}
          />
        </div>
      </div>
    </div>
  );
};

export default InstallmentPlan;
