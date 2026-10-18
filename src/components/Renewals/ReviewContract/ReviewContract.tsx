import React, { useEffect, useState } from 'react';
import { CustomLink, CustomRichText, Text } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import ArrowLeft from 'assets/icons/ArrowLeft';
import { formatLeaseDate, formatNumber } from 'lib/utils/helper';

import { useParkingStorage } from 'components/ProfileDetails/useParkingStorage';
import RenewalStepper from '../Stepper/RenewalsStepper';
import CostBreakdown from './CostBreakdown/CostBreakdown';
import { useReviewContract } from './CostBreakdown/useReviewContract';
import OutstandingPaymentModal from './OutstandingPaymentModal';
import { CurrentLeaseSkeleton, RenewalProposalSkeleton } from './ReviewContractSkeleton';

const ReviewContract = ({ fields }: any) => {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();
  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [userProfileDetails, setUserProfileDetails] = useState<any>();
  const {
    outstandingAmount,
    isLoadingRenewalProposal,
    isLoadingShortTermRenewalProposal,
    isLoadingOutstandingAmount,
    renewalProposalData,
    renewalChargeType,
    invoiceFrequencyInstallment,
    renewalSpecialsType,
    handleAcceptProposal,
  } = useReviewContract(stepperAPIData);
  const { parkingSpaces, storageSpaces } = useParkingStorage(tCode);

  const { mutate: getUserProfileDetails, isPending: isLoadingUserProfileDetails } = useApiMutation<
    any,
    any
  >(() => `Yardi/GetDetails?tCode=${tCode}`, 'GET', false);

  useEffect(() => {
    getUserProfileDetails(null, {
      onSuccess: (res) => {
        if (res) {
          setUserProfileDetails(res?.Tenant_Details?.[0]);
        }
      },
      onError: () => openModal('error-modal'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="contract-renewal">
      <RenewalStepper setStepperAPIData={setStepperAPIData} />
      <div className="relative -top-16.5 lg:static container-sm py-8 md:py-10 flex flex-col gap-5 md:gap-6">
        <CustomLink
          field={fields.backCTA}
          className="text-body-sm font-medium flex gap-4 text-navy-500 uppercase items-center"
        >
          <ArrowLeft width={28} height={28} />
          {fields?.backCTA?.value?.text}
        </CustomLink>
        {isLoadingUserProfileDetails ||
        isLoadingRenewalProposal ||
        isLoadingShortTermRenewalProposal ||
        !stepperAPIData ? (
          <CurrentLeaseSkeleton />
        ) : (
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <h1 className="text-[16px] md:text-[20px]">Current lease</h1>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-body font-medium">
                  Lease term:{' '}
                  <span className="font-light">
                    {userProfileDetails?.Lease_Start_Date &&
                      formatLeaseDate(userProfileDetails?.Lease_Start_Date)}{' '}
                    -{' '}
                    {userProfileDetails?.Lease_End_Date &&
                      formatLeaseDate(userProfileDetails?.Lease_End_Date)}{' '}
                  </span>
                </p>
                <p className="text-body font-medium">
                  Rent:{' '}
                  <span className="font-light">
                    AED {formatNumber(userProfileDetails?.Lease_Amount)}
                  </span>
                </p>
                <p className="text-body font-medium">
                  Unit:{' '}
                  <span className="font-light">
                    {`${userProfileDetails?.Tenant_Project_Name},
                      ${userProfileDetails?.Property_Code},
                      ${userProfileDetails?.Unit_Code}`}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
        {isLoadingUserProfileDetails ||
        isLoadingRenewalProposal ||
        isLoadingShortTermRenewalProposal ||
        isLoadingOutstandingAmount ||
        !stepperAPIData ? (
          <RenewalProposalSkeleton />
        ) : (
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <CustomRichText field={fields?.clipBoardIcon} />
                <Text tag="h1" field={fields?.title} className="text-[16px] md:text-[20px]" />
              </div>
              <div className="flex flex-col gap-4">
                <CostBreakdown
                  renewalProposalData={renewalProposalData}
                  renewalSpecialsType={renewalSpecialsType}
                  renewalChargeType={renewalChargeType}
                  invoiceFrequencyInstallment={invoiceFrequencyInstallment}
                  acknowledgementText={fields?.acknowledgementText}
                  showProposedLeaseTerm={true}
                  viewRERAIndex={true}
                  parkingSpaces={parkingSpaces}
                  storageSpaces={storageSpaces}
                />
                <div className="btn-wrapper flex flex-col justify-center items-end mt-2 gap-2 md:gap-3">
                  <button
                    className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
                    onClick={handleAcceptProposal}
                  >
                    {fields?.submitCTALabel?.value}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <OutstandingPaymentModal
        outstandingAmount={outstandingAmount}
        outstandingThresholdAmount={Number(stepperAPIData?.OutstandingThresholdAmount) || 1000}
      />
    </div>
  );
};

export default ReviewContract;
