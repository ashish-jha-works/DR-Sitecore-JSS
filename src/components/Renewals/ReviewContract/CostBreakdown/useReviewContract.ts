import { summarizeLeaseCharges } from 'components/Renewals/PaymentPlan/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

// Maps invoice frequency string to number of installments per year
export const FREQUENCY_MAP: Record<string, number> = {
  monthly: 12,
  bimonthly: 6,
  quarterly: 4,
  halfyearly: 2,
  'half-yearly': 2,
  annual: 1,
};
const DEFAULT_FREQUENCY = 4;

// Determines if renewal charge is a 'Premium' or 'Discount'
export const resolveChargeType = (chargeAmount: string, frequency: number): string => {
  const isHighFrequency = frequency > 10;
  if (!chargeAmount || chargeAmount === 'null') return isHighFrequency ? 'Premium' : 'Discount';

  const amount = Number(chargeAmount);
  if (amount > 0) return 'Premium';
  if (amount < 0) return 'Discount';
  return isHighFrequency ? 'Premium' : 'Discount'; // amount === 0
};

export const useReviewContract = (stepperAPIData: any) => {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();
  const router = useRouter();

  const [, setIsReadOnly] = useState(false);
  const [modifyProposal] = useState(false);
  const [outstandingAmount, setOutstandingAmount] = useState<number>(0);
  const [renewalProposalData, setRenewalProposalData] = useState<any>();
  const [renewalSpecialsType, setRenewalSpecialsType] = useState<string>('');
  const [renewalChargeType, setRenewalChargeType] = useState<string>('');
  const [invoiceFrequencyInstallment, setInvoiceFrequencyInstallment] = useState<number>(0);

  const onApiError = () => openModal('error-modal');

  const { mutate: getRenewalProposal, isPending: isLoadingRenewalProposal } = useApiMutation<
    any,
    any
  >(() => `/ContractRenewal/RenewalProposal/${tCode}`, 'GET', false);

  const { mutate: getShortTermRenewalProposal, isPending: isLoadingShortTermRenewalProposal } =
    useApiMutation<any, any>(() => `/ContractRenewal/ShortTermPaymentPlan/${tCode}`, 'GET', false);

  const { mutate: getOutstandingAmountAPI, isPending: isLoadingOutstandingAmount } = useApiMutation<
    any,
    any
  >(() => `v1/payments/dashboard/${tCode}/PaymentsSummary?onlyOutstanding=true`, 'GET', false);

  const { mutate: updateStepperAPI } = useApiMutation<any, any>(
    () => `ContractRenewal/TrackContractDetails`,
    'POST',
    true
  );

  const handleAcceptProposal = () => {
    if (outstandingAmount > 0) {
      openModal('outstanding-payment-modal');
    } else {
      // if (!stepperAPIData?.IsShortTermRenewal) {
      const { ejariFees, adminFee } = summarizeLeaseCharges(
        renewalProposalData?.Lease_charges?.ME_Lease_charges_V ?? []
      );

      const stepperReqData = {
        ProfileId: tCode,
        TotalPayableAmount: renewalProposalData?.TotalPayableAmount,
        NoOfInstallments: stepperAPIData?.NoOfInstallments,
        UserState: 1,
        LeasePeriodInMonths:
          renewalProposalData.Res_Renewal_Proposal.ME_Res_Renewal_Proposal_dtls_v.RENEWAL_TERM,
        ProposalId: stepperAPIData?.ProposalId,
        ProposalStartDate:
          renewalProposalData.Res_Renewal_Proposal.ME_Res_Renewal_Proposal_dtls_v
            .PROPOSAL_START_DATE,
        ProposalEndDate:
          renewalProposalData.Res_Renewal_Proposal.ME_Res_Renewal_Proposal_dtls_v.PROPOSAL_END_DATE,
        EjariFees: ejariFees,
        AdminFees: adminFee,
      };

      updateStepperAPI(stepperReqData, {
        onSuccess: (res: any) => {
          if (res?.Code === 200) router.push('/contract-renewal/payment-plan');
        },
        onError: () => openModal('error-modal'),
      });
      // } else {
      //   //TODO: Check with older code for short term case checkTenantContractDocumentsValidation();
      // }
    }
  };

  // Fetch outstanding amount and renewal proposal on stepperAPIData change
  useEffect(() => {
    if (!stepperAPIData) return;

    // Fetch outstanding payments and extract the relevant amount
    getOutstandingAmountAPI(null, {
      onSuccess: (res) => {
        const outstanding = res.find((ele: any) => ele.Category === 'Outstanding Payments');
        if (outstanding) setOutstandingAmount(outstanding.Amount);
      },
      onError: onApiError,
    });

    // Lock UI if contract is already in progress
    const { Schedule_Type, IsDocumentSigned, HasSubmittedDD, SelectedPaymentOption } =
      stepperAPIData;
    if (
      Schedule_Type ||
      IsDocumentSigned ||
      HasSubmittedDD ||
      (SelectedPaymentOption != null && Number(SelectedPaymentOption.Key) !== 1)
    ) {
      setIsReadOnly(true);
    }

    // Choose short-term or standard renewal proposal based on contract type
    if (stepperAPIData.IsShortTermRenewal && !modifyProposal) {
      getShortTermRenewalProposal(null, {
        onSuccess: (res) => {
          if (res?.RenewalProposal) {
            setRenewalProposalData(res.RenewalProposal);
          }
        },
        onError: onApiError,
      });
    } else {
      getRenewalProposal(null, {
        onSuccess: setRenewalProposalData,
        onError: onApiError,
      });
    }
  }, [stepperAPIData]);

  // Derive charge type and specials from renewal proposal data
  useEffect(() => {
    if (!renewalProposalData) return;

    const frequency =
      renewalProposalData.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v?.INVOICE_FREQUENCY ??
      '';
    const specials = renewalProposalData.RES_Renewal_Specials?.ME_RES_Renewal_Specials_V ?? {};

    const installments = FREQUENCY_MAP[frequency.toLowerCase()] ?? DEFAULT_FREQUENCY;
    setInvoiceFrequencyInstallment(installments);
    setRenewalChargeType(resolveChargeType(specials.CHARGE_AMOUNT, installments));
    setRenewalSpecialsType(specials.SPECIAL_TYPE ?? '');
  }, [renewalProposalData]);

  return {
    outstandingAmount,
    renewalProposalData,
    renewalChargeType,
    renewalSpecialsType,
    invoiceFrequencyInstallment,
    isLoadingRenewalProposal,
    isLoadingShortTermRenewalProposal,
    isLoadingOutstandingAmount,
    handleAcceptProposal,
  };
};
