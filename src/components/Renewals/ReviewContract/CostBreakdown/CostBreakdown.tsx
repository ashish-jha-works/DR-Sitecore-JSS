import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from 'next/link';
import React from 'react';

import { formatDate, formatNumber } from 'lib/utils/helper';

const CostBreakdown = ({
  renewalProposalData,
  renewalSpecialsType,
  renewalChargeType,
  invoiceFrequencyInstallment,
  acknowledgementText = '',
  showProposedLeaseTerm = false,
  containerClassName = '',
  viewRERAIndex = false,
  parkingSpaces = [],
  storageSpaces = [],
}: any) => {
  const proposalDetails = renewalProposalData?.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v;
  const parkingCharges = proposalDetails?.Parking;
  const storageCharges = proposalDetails?.Storage;
  const showParkingRent = parkingCharges != null && Number(parkingCharges) !== 0;
  const showStorageRent = storageCharges != null && Number(storageCharges) !== 0;

  return (
    <div className={`${containerClassName} cost-breakdown flex flex-col gap-6`}>
      {showProposedLeaseTerm ? (
        <p className="text-body font-medium mb-3 lg:mb-5">
          Proposed Lease Term:{' '}
          <span className="font-light">
            {renewalProposalData?.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v
              ?.PROPOSAL_START_DATE &&
              formatDate(
                renewalProposalData?.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v
                  ?.PROPOSAL_START_DATE
              )}{' '}
            -{' '}
            {renewalProposalData?.Res_Renewal_Proposal.ME_Res_Renewal_Proposal_dtls_v
              ?.PROPOSAL_END_DATE &&
              formatDate(
                renewalProposalData?.Res_Renewal_Proposal.ME_Res_Renewal_Proposal_dtls_v
                  ?.PROPOSAL_END_DATE
              )}
          </span>
        </p>
      ) : null}

      <p className="text-body font-medium">Cost breakdown</p>
      <div className="cost-breakdown-section flex flex-col gap-1 lg:gap-2">
        <div className="border-b border-solid border-lilac-200 flex justify-between py-3">
          <div className="text-[16px] font-light">
            Rent
            {viewRERAIndex ? (
              <Link
                href="https://dubailand.gov.ae/en/eservices/rental-index/rental-index/"
                className="block uppercase underline text-body-xs text-sky-700 font-medium cursor-pointer"
              >
                View Rera Index
              </Link>
            ) : null}
          </div>
          <div className="text-body font-light">
            AED{' '}
            {formatNumber(
              renewalProposalData?.Res_Renewal_Proposal.ME_Res_Renewal_Proposal_dtls_v.RENEWAL_RENT
            )}
          </div>
        </div>
        {renewalSpecialsType &&
        renewalSpecialsType !== null &&
        renewalProposalData.RES_Renewal_Specials.ME_RES_Renewal_Specials_V.CHARGE_AMOUNT != 0 ? (
          <div className="border-b border-solid border-lilac-200 flex justify-between py-3">
            <div
              className={`text-[16px] max-w-40 lg:max-w-full ${
                renewalChargeType?.toUpperCase() === 'DISCOUNT'
                  ? 'font-light'
                  : 'font-medium text-lilac-hover'
              }`}
            >
              {renewalChargeType} on {invoiceFrequencyInstallment}{' '}
              {invoiceFrequencyInstallment > 1 ? 'instalments' : 'instalment'}{' '}
              <p
                className={`${
                  renewalChargeType?.toUpperCase() === 'DISCOUNT' ? 'text-navy-400' : ''
                }`}
              >
                {Number(
                  renewalProposalData.RES_Renewal_Specials.ME_RES_Renewal_Specials_V?.PERCENTAGE
                ) > 0
                  ? `(${renewalProposalData.RES_Renewal_Specials.ME_RES_Renewal_Specials_V?.PERCENTAGE}% on
                        lease amount)`
                  : null}
              </p>
            </div>
            <div className="text-body font-light">
              AED{' '}
              {formatNumber(
                renewalProposalData.RES_Renewal_Specials.ME_RES_Renewal_Specials_V.CHARGE_AMOUNT
              )}
            </div>
          </div>
        ) : null}
        {renewalProposalData?.Lease_charges?.ME_Lease_charges_V?.map(
          (leaseCharge: any, index: number) => {
            const isEjariAdminFee =
              leaseCharge?.Charge_Description === 'Ejari Administration Fees' ||
              leaseCharge?.Charge_Description === 'Ejari Admin Fees' ||
              leaseCharge?.Charge_Description === 'Admin Fees';
            return (
              <div
                className="border-b border-solid border-lilac-200 flex justify-between py-3"
                key={index}
              >
                <div className="text-[16px] font-light">
                  {leaseCharge?.Charge_Description}
                  {isEjariAdminFee ? (
                    <p className="text-body text-navy-400">
                      {leaseCharge?.Charge_Description === 'Admin Fees'
                        ? leaseCharge?.Amount === '0' || leaseCharge?.Amount === '0.00'
                          ? `AED ${renewalProposalData.AdminFeesWithoutVAT} Waived off`
                          : `Inclusive of ${renewalProposalData?.VAT || '5'}% VAT`
                        : `Inclusive of ${renewalProposalData?.VAT || '5'}% VAT`}
                    </p>
                  ) : null}
                  {leaseCharge?.Charge_Description?.toUpperCase()?.includes('DISCOUNT') &&
                  leaseCharge?.ExpiryDate ? (
                    <p className="text-body text-navy-400">
                      Expires on {formatDate(leaseCharge?.ExpiryDate)}
                    </p>
                  ) : null}
                </div>
                <div className="text-body font-light">
                  {Number(leaseCharge?.Amount) < 0
                    ? `- AED ${formatNumber(Math.abs(leaseCharge?.Amount))}`
                    : `AED ${leaseCharge?.Amount}`}
                </div>
              </div>
            );
          }
        )}
        {showParkingRent ? (
          <div className="border-b border-solid border-lilac-200 flex justify-between py-3">
            <div className="text-[16px] font-light">
              Parking rent
              {parkingSpaces?.map((code: string) => (
                <p key={code} className="text-body text-navy-400 mb-0">
                  {code}
                </p>
              ))}
            </div>
            <div className="text-body font-light">AED {formatNumber(parkingCharges)}</div>
          </div>
        ) : null}
        {showStorageRent ? (
          <div className="border-b border-solid border-lilac-200 flex justify-between py-3">
            <div className="text-[16px] font-light">
              Storage rent
              {storageSpaces?.map((code: string) => (
                <p key={code} className="text-body text-navy-400 mb-0">
                  {code}
                </p>
              ))}
            </div>
            <div className="text-body font-light">AED {formatNumber(storageCharges)}</div>
          </div>
        ) : null}
        {/* Cooling Charges */}
        {renewalProposalData?.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v?.Cooling !==
          null &&
        renewalProposalData?.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v?.Cooling != 0 ? (
          <div className="border-b border-solid border-lilac-200 flex justify-between py-3">
            <div className="text-[16px] font-light">
              Cooling Charges
              <p className="text-body text-navy-400">Inclusive of 5% VAT</p>
            </div>
            <div className="text-body font-light">
              AED{' '}
              {formatNumber(
                renewalProposalData?.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v?.Cooling
              )}
            </div>
          </div>
        ) : null}
        <div className="total-section flex justify-between py-3 font-bold">
          <div className="text-[16px]">Total payable amount</div>
          <div className="text-body">
            AED {formatNumber(renewalProposalData?.TotalPayableAmount)}
          </div>
        </div>
        {acknowledgementText ? (
          <Text tag="p" field={acknowledgementText} className="text-body-sm font-light" />
        ) : null}
      </div>
    </div>
  );
};

export default CostBreakdown;
