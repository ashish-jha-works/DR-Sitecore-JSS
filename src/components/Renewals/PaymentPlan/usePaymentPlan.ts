import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import { formatDate, formatNumber } from 'lib/utils/helper';

import type {
  CardValidityMap,
  InstallmentPlanAPIResponse,
  InstallmentPlanItem,
  InstallmentTypeData,
} from './paymentPlan.types';
import { separatedAmount, summarizeLeaseCharges } from './utils';
import { useRouter } from 'next/navigation';
import {
  FREQUENCY_MAP,
  resolveChargeType,
} from '../ReviewContract/CostBreakdown/useReviewContract';
import { useRenewalsStore } from 'src/store/useRenewalsStore';
import {
  areAllRenewalStepsComplete,
  getResolvedRenewalStep,
  resolveShortTermRenewalRoute,
} from 'components/ContractRenewal/ShortTermRenewal/resolveShortTermRenewalRoute';

export function usePaymentPlan() {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();
  const { setPreservedInstallmentAmount } = useRenewalsStore();
  const router = useRouter();

  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [defaultSelectedInstallmentPlan, setDefaultSelectedInstallmentPlan] = useState('');
  const [selectedInstallmentPlan, setSelectedInstallmentPlan] = useState('');
  const [selectedInstallmentPlanData, setSelectedInstallmentPlanData] =
    useState<InstallmentPlanItem | null>(null);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState('');
  const [paymentOptions, setPaymentOptions] = useState<any>(null);
  const [installmentPlanAPIData, setInstallmentPlanAPIData] = useState<InstallmentPlanAPIResponse>(
    {}
  );
  const [renewalSpecialsType, setRenewalSpecialsType] = useState('');
  const [renewalChargeType, setRenewalChargeType] = useState('');
  const [invoiceFrequencyInstallment, setInvoiceFrequencyInstallment] = useState(0);
  // Currently derived but not consumed by the rendered UI; kept for parity with prior behavior
  const [cardValidityCheckBasedOnInstallment, setCardValidityCheckBasedOnInstallment] =
    useState<CardValidityMap>({});
  const [allPaymentTypeInstallmentData, setAllPaymentTypeInstallmentData] = useState<
    InstallmentTypeData[]
  >([]);

  const { mutate: fetchPaymentPlan, isPending: isLoadingPaymentPlan } = useApiMutation<any, any>(
    () => `ContractRenewal/payments/${tCode}/paymentOptions`,
    'GET',
    false
  );

  const { mutate: fetchInstallmentPlan, isPending: isLoadingInstallmentPlan } = useApiMutation<
    any,
    any
  >(() => `ContractRenewal/InstallmentPlan/${tCode}`, 'GET', false);

  const { mutate: createContractRenewalAPI } = useApiMutation<any, any>(
    () => `ContractRenewal/CreateRenewal`,
    'POST',
    true
  );

  const { mutate: updateStepperAPI } = useApiMutation<any, any>(
    () => `ContractRenewal/TrackContractDetails`,
    'POST',
    true
  );

  // Builds per-installment-plan breakdown rows and a card-validity map from the raw API response
  const buildInstallmentData = useCallback((installmentPlans: InstallmentPlanItem[]) => {
    const installmentsData: InstallmentTypeData[] = [];
    const cardValidityMap: CardValidityMap = {};

    installmentPlans.forEach((plan, planIndex) => {
      cardValidityMap[planIndex] =
        parseInt(plan.NoOfInstallment?.toString(), 10) === 1
          ? true
          : plan.AnyCardValidForSelectedPayment;

      const pdcList = plan?.pdcResponse?.PdcList ?? [];
      const proposalDetails =
        plan.RenewalProposal?.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v;
      const leaseCharges = plan.RenewalProposal?.Lease_charges?.ME_Lease_charges_V ?? [];
      const hasCooling = proposalDetails?.Cooling != null;
      const hasParkingRent =
        proposalDetails?.Parking != null && Number(proposalDetails?.Parking) !== 0;
      const hasStorageRent =
        proposalDetails?.Storage != null && Number(proposalDetails?.Storage) !== 0;
      const hasParkingAdminFees = leaseCharges.some(
        (charge: any) => charge.Charge_Code === 'Parkadmn'
      );
      const hasStorageAdminFees = leaseCharges.some(
        (charge: any) => charge.Charge_Code === 'Storadmn'
      );

      const installmentDetails = pdcList.map((pdc, index) => {
        const splitAmount = separatedAmount(pdc?.AmountInWords);
        const [line1, line2] = splitAmount?.split('~;') ?? [];

        // First installment covers rent + fees, subsequent ones cover rent only
        let paymentDesc =
          index === 0 ? 'Rent + Admin Fees + Ejari Fees + Ejari Admin Fees' : 'Rent';
        if (index === 0) {
          if (hasStorageRent) paymentDesc += ' + Storage Rent';
          if (hasStorageAdminFees) paymentDesc += ' + Storage Admin Fees';
          if (hasParkingRent) paymentDesc += ' + Parking Rent';
          if (hasParkingAdminFees) paymentDesc += ' + Parking Admin Fees';
        }
        if (hasCooling) paymentDesc += ' + Cooling Charges';

        return {
          installmentDate: formatDate(pdc.InstallementDate),
          installmentNumber: index + 1,
          installmentAmount: pdc.InstallmentAmount,
          installmentAmountInWords1: line1,
          installmentAmountInWords2: line2,
          recieptName: pdc.RecieptName,
          pdcList,
          paymentDesc,
        };
      });

      installmentsData.push({ installmentDetails });
    });

    return { installmentsData, cardValidityMap };
  }, []);

  // Short-term renewals never use payment-plan — redirect to the correct step
  useEffect(() => {
    if (!stepperAPIData?.IsShortTermRenewal) return;

    const resolvedStep = getResolvedRenewalStep(stepperAPIData);
    const allStepsComplete = areAllRenewalStepsComplete(stepperAPIData);
    const shortTermRoute = resolveShortTermRenewalRoute(
      stepperAPIData,
      resolvedStep,
      allStepsComplete
    );

    if (shortTermRoute && shortTermRoute !== '/contract-renewal/payment-plan') {
      router.replace(shortTermRoute);
    }
  }, [router, stepperAPIData]);

  // Fetch payment options and installment plans once on mount
  useEffect(() => {
    fetchPaymentPlan(null, {
      onSuccess: (res: any) => {
        if (res?.length) setPaymentOptions(res);
      },
      onError: () => openModal('error-modal'),
    });

    fetchInstallmentPlan(null, {
      onSuccess: (res: InstallmentPlanAPIResponse) => {
        if (!res) return;

        setInstallmentPlanAPIData(res);
        const { SelectedInstallmentPlan, InstallmentPlans } = res;

        if (SelectedInstallmentPlan) {
          setDefaultSelectedInstallmentPlan(SelectedInstallmentPlan.toString());
          setSelectedInstallmentPlan(SelectedInstallmentPlan.toString());
        }

        if (InstallmentPlans?.length) {
          const { installmentsData, cardValidityMap } = buildInstallmentData(InstallmentPlans);
          setAllPaymentTypeInstallmentData(installmentsData);
          setCardValidityCheckBasedOnInstallment(cardValidityMap);
        }
      },
      onError: () => openModal('error-modal'),
    });
    // Intentionally run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync the fully selected installment plan whenever the selection changes
  useEffect(() => {
    if (!selectedInstallmentPlan) return;

    const match = installmentPlanAPIData?.InstallmentPlans?.find(
      (plan) => plan.NoOfInstallment?.toString() === selectedInstallmentPlan
    );
    if (match) setSelectedInstallmentPlanData(match);
  }, [selectedInstallmentPlan, installmentPlanAPIData]);

  // Derive charge type, specials type, and invoice frequency from the selected proposal
  useEffect(() => {
    const renewalProposalData = selectedInstallmentPlanData?.RenewalProposal;
    if (!renewalProposalData) return;

    const frequency =
      renewalProposalData.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v?.INVOICE_FREQUENCY ??
      '';
    const specials =
      renewalProposalData.RES_Renewal_Specials?.ME_RES_Renewal_Specials_V ??
      ({} as { CHARGE_AMOUNT?: number; SPECIAL_TYPE?: string });

    const installments = FREQUENCY_MAP[frequency.toLowerCase()] ?? 1;
    setInvoiceFrequencyInstallment(installments);
    setRenewalChargeType(resolveChargeType(specials.CHARGE_AMOUNT as any, installments));
    setRenewalSpecialsType(specials.SPECIAL_TYPE ?? '');
  }, [selectedInstallmentPlanData]);

  const handleSubmitContractRenewal = useCallback(() => {
    const pdcList = selectedInstallmentPlanData?.pdcResponse?.PdcList ?? [];
    const isSelectedInstallmentSameAsDefault =
      installmentPlanAPIData?.SelectedInstallmentPlan === parseInt(selectedInstallmentPlan, 10);

    const requestData = {
      TenantCode: tCode,
      Proposal_ID: isSelectedInstallmentSameAsDefault
        ? installmentPlanAPIData?.InstallmentPlans?.[0]?.RenewalProposal?.Res_Renewal_Proposal
            ?.ME_Res_Renewal_Proposal_dtls_v?.PROPOSAL_ID
        : 0,
      Invoice_Frequency: Object.keys(FREQUENCY_MAP).find(
        (key) => FREQUENCY_MAP[key] === selectedInstallmentPlanData?.NoOfInstallment
      ),
      IsValid: true,
      Request_Source: 'Portal',
    };

    createContractRenewalAPI(requestData, {
      onSuccess: (response: any) => {
        if (!response) return;

        const leaseCharges =
          selectedInstallmentPlanData?.RenewalProposal?.Lease_charges?.ME_Lease_charges_V ?? [];
        const { ejariFees, adminFee } = summarizeLeaseCharges(leaseCharges);

        const stepperReqData = {
          ProfileId: tCode,
          TotalPayableAmount: formatNumber(
            selectedInstallmentPlanData?.RenewalProposal?.TotalPayableAmount
          ),
          NoOfInstallments: parseInt(selectedInstallmentPlan, 10),
          UserState: 1,
          LeasePeriodInMonths: installmentPlanAPIData?.SelectedInstallmentPlan?.toString(),
          ProposalStartDate: pdcList[0]?.InstallementDate?.split('T')?.[0],
          ProposalEndDate: pdcList[pdcList.length - 1]?.InstallementDate?.split('T')?.[0],
          EjariFees: ejariFees,
          AdminFees: adminFee,
        };

        updateStepperAPI(stepperReqData, {
          onSuccess: (res: any) => {
            if (res?.Code === 200 || res?.Status === 'Success' || (res && res !== 'null')) {
              // Preserve Additional incurring charges for 12 installment case for next step
              if (
                parseInt(selectedInstallmentPlan, 10) === 12 &&
                selectedInstallmentPlanData?.RenewalProposal?.RES_Renewal_Specials
                  ?.ME_RES_Renewal_Specials_V.CHARGE_AMOUNT
              ) {
                setPreservedInstallmentAmount(
                  selectedInstallmentPlanData?.RenewalProposal.RES_Renewal_Specials
                    .ME_RES_Renewal_Specials_V.CHARGE_AMOUNT
                );
              }

              router.push(`/contract-renewal/pay-renewal?po=${selectedPaymentPlan}`);
            } else {
              openModal('error-modal');
            }
          },
          onError: () => {
            openModal('error-modal');
          },
        });
      },
      onError: () => openModal('error-modal'),
    });
  }, [
    tCode,
    installmentPlanAPIData,
    selectedInstallmentPlan,
    selectedInstallmentPlanData,
    selectedPaymentPlan,
    createContractRenewalAPI,
    openModal,
    setPreservedInstallmentAmount,
  ]);

  const handleCancelJourney = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace('/contract-renewal');
    }
  };

  // Submit is only enabled once both an installment plan and a payment plan are chosen
  const isSubmitDisabled = useMemo(
    () => !(selectedInstallmentPlan && selectedPaymentPlan),
    [selectedInstallmentPlan, selectedPaymentPlan]
  );

  const isLoading = !stepperAPIData || isLoadingPaymentPlan || isLoadingInstallmentPlan;

  return {
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
    cardValidityCheckBasedOnInstallment,
    allPaymentTypeInstallmentData,
    isSubmitDisabled,
    handleCancelJourney,
    handleSubmitContractRenewal,
  };
}
