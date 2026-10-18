'use client';

import { formatDate } from 'lib/utils/helper';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import {
  FREQUENCY_MAP,
  resolveChargeType,
} from 'components/Renewals/ReviewContract/CostBreakdown/useReviewContract';
import { useRenewalDocumentValidation } from 'components/Renewals/UploadDocuments/useRenewalDocumentValidation';
import { getRenewalRouteAfterDocumentTrack } from 'components/Renewals/UploadDocuments/renewalDocumentValidation';
import { separatedAmount, summarizeLeaseCharges } from 'components/Renewals/PaymentPlan/utils';
import type { InstallmentBreakdownRow } from 'components/Renewals/PaymentPlan/paymentPlan.types';

export type ShortTermView = 'form' | 'waiting' | 'proposal';

const SHORT_TERM_PAYMENT_OPTION_LIMIT = 3;

function buildInstallmentDetails(proposalResponse: any): InstallmentBreakdownRow[] {
  const pdcList = proposalResponse?.pdcResponse?.PdcList ?? [];
  const proposalDetails =
    proposalResponse?.RenewalProposal?.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v;
  const leaseCharges = proposalResponse?.RenewalProposal?.Lease_charges?.ME_Lease_charges_V ?? [];
  const hasCooling = proposalDetails?.Cooling != null;
  const hasParkingRent = proposalDetails?.Parking != null && Number(proposalDetails?.Parking) !== 0;
  const hasStorageRent = proposalDetails?.Storage != null && Number(proposalDetails?.Storage) !== 0;
  const hasParkingAdminFees = leaseCharges.some((charge: any) => charge.Charge_Code === 'Parkadmn');
  const hasStorageAdminFees = leaseCharges.some((charge: any) => charge.Charge_Code === 'Storadmn');

  return pdcList.map((pdc: any, index: number) => {
    const splitAmount = separatedAmount(pdc?.AmountInWords);
    const [line1, line2] = splitAmount?.split('~;') ?? [];

    let paymentDesc = index === 0 ? 'Rent + Admin Fees + Ejari Fees + Ejari Admin Fees' : 'Rent';
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
}

export function useShortTermRenewal() {
  const router = useRouter();
  const { tCode } = useUserStore();
  const { openModal, closeModal } = useUIStore();
  const { fetchRenewalDocumentValidation } = useRenewalDocumentValidation();

  const [extensionPeriod, setExtensionPeriod] = useState('');
  const [installmentPlan, setInstallmentPlan] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const [hasCheckedStepper, setHasCheckedStepper] = useState(false);
  const [submittedLeasePeriod, setSubmittedLeasePeriod] = useState('');
  const [submittedInstallments, setSubmittedInstallments] = useState('');
  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [isProposalReady, setIsProposalReady] = useState(false);
  const [renewalProposalData, setRenewalProposalData] = useState<any>(null);
  const [installmentDetails, setInstallmentDetails] = useState<InstallmentBreakdownRow[]>([]);
  const [paymentOptions, setPaymentOptions] = useState<{ Key: number; Value: string }[]>([]);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<number | ''>('');
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [isProceeding, setIsProceeding] = useState(false);
  const [renewalSpecialsType, setRenewalSpecialsType] = useState('');
  const [renewalChargeType, setRenewalChargeType] = useState('');
  const [invoiceFrequencyInstallment, setInvoiceFrequencyInstallment] = useState(0);
  const [invoiceFrequency, setInvoiceFrequency] = useState('');

  const { mutate: submitShortTermRenewal, isPending: isSubmitting } = useApiMutation<any, any>(
    () => '/ContractRenewal/ShortTermContractRenewal',
    'POST',
    true
  );

  const { mutate: trackContractDetails } = useApiMutation<any, any>(
    () => '/ContractRenewal/TrackContractDetails',
    'POST',
    false
  );

  const { mutate: fetchRenewalStepper } = useApiMutation<any, any>(
    () => `/ContractRenewal/Stepper/${tCode}`,
    'GET',
    true
  );

  const { mutate: fetchRenewalStepperSilent } = useApiMutation<any, any>(
    () => `/ContractRenewal/Stepper/${tCode}`,
    'GET',
    false
  );

  const { mutate: fetchShortTermProposal, isPending: isLoadingProposal } = useApiMutation<any, any>(
    () => `/ContractRenewal/ShortTermPaymentPlan/${tCode}`,
    'GET',
    false
  );

  const { mutate: fetchPaymentOptions } = useApiMutation<any, any>(
    () => `ContractRenewal/payments/${tCode}/paymentOptions`,
    'GET',
    false
  );

  const { mutate: fetchOutstanding } = useApiMutation<any, any>(
    () => `v1/payments/dashboard/${tCode}/PaymentsSummary?onlyOutstanding=true`,
    'GET',
    false
  );

  const { mutate: createContractRenewal } = useApiMutation<any, any>(
    () => `ContractRenewal/CreateRenewal`,
    'POST',
    true
  );

  const isSixMonthExtension = extensionPeriod === '6';
  const hasLeasePeriod = Boolean(extensionPeriod);
  const showInfoMessage = Boolean(extensionPeriod && installmentPlan);
  const isConfirmDisabled = !extensionPeriod || !installmentPlan || isSubmitting;

  const lockedInstallments = useMemo(() => {
    const fromStepper = Number(stepperAPIData?.NoOfInstallments);
    if (fromStepper) return String(fromStepper);
    if (submittedInstallments) return submittedInstallments;
    return installmentPlan || '1';
  }, [installmentPlan, stepperAPIData?.NoOfInstallments, submittedInstallments]);

  const view: ShortTermView = useMemo(() => {
    if (isProposalReady && renewalProposalData) return 'proposal';
    if (isRequestSubmitted || stepperAPIData?.IsShortTermRenewal) return 'waiting';
    return 'form';
  }, [
    isProposalReady,
    isRequestSubmitted,
    renewalProposalData,
    stepperAPIData?.IsShortTermRenewal,
  ]);

  const applySubmittedSummary = (months: string | number, installments: string | number) => {
    const leasePeriod = String(months || '');
    const installmentCount = String(installments || '');

    if (!leasePeriod) return;

    setSubmittedLeasePeriod(leasePeriod);
    setSubmittedInstallments(installmentCount || '1');
    setIsRequestSubmitted(true);
  };

  const handleExtensionPeriodChange = (value: string) => {
    setExtensionPeriod(value);
    if (value === '6') {
      setInstallmentPlan('');
    } else {
      setInstallmentPlan('1');
    }
  };

  const trackShortTermSelection = (months: string, installments: string, proposalId: string) => {
    trackContractDetails({
      ProfileId: tCode,
      ProposalId: proposalId,
      LeasePeriodInMonths: Number(months),
      NoOfInstallments: Number(installments),
      UserState: 1,
    });
  };

  const applyProposalResponse = useCallback(
    (response: any) => {
      const proposal = response?.RenewalProposal;
      if (!proposal || !response?.pdcResponse) {
        setIsProposalReady(false);
        setRenewalProposalData(null);
        setInstallmentDetails([]);
        return false;
      }

      setRenewalProposalData(proposal);
      setInstallmentDetails(buildInstallmentDetails(response));
      setIsProposalReady(true);

      const frequency =
        proposal?.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v?.INVOICE_FREQUENCY ?? '';
      const specials = proposal?.RES_Renewal_Specials?.ME_RES_Renewal_Specials_V ?? {};
      const installments =
        FREQUENCY_MAP[String(frequency).toLowerCase()] ?? (Number(lockedInstallments) || 1);

      setInvoiceFrequency(frequency);
      setInvoiceFrequencyInstallment(installments);
      setRenewalChargeType(resolveChargeType(specials.CHARGE_AMOUNT, installments));
      setRenewalSpecialsType(specials.SPECIAL_TYPE ?? '');
      return true;
    },
    [lockedInstallments]
  );

  const loadProposalReadyData = useCallback(
    (stepperResponse?: any) => {
      fetchShortTermProposal(null, {
        onSuccess: (response) => {
          applyProposalResponse(response);
        },
        onError: () => {
          setIsProposalReady(false);
        },
      });

      fetchPaymentOptions(null, {
        onSuccess: (res: any) => {
          if (!Array.isArray(res)) return;
          // Old short-term: only first 3 options (no Direct Debit)
          setPaymentOptions(res.slice(0, SHORT_TERM_PAYMENT_OPTION_LIMIT));
        },
      });

      fetchOutstanding(null, {
        onSuccess: (res) => {
          const outstanding = Array.isArray(res)
            ? res.find((ele: any) => ele.Category === 'Outstanding Payments')
            : null;
          if (outstanding) setOutstandingAmount(Number(outstanding.Amount) || 0);
        },
      });

      if (stepperResponse?.SelectedPaymentOption?.Key) {
        setSelectedPaymentPlan(Number(stepperResponse.SelectedPaymentOption.Key));
      }
    },
    [applyProposalResponse, fetchOutstanding, fetchPaymentOptions, fetchShortTermProposal]
  );

  const handleCancel = () => {
    router.push('/dashboard');
  };

  const handleConfirm = () => {
    if (!tCode || isConfirmDisabled) return;

    const installments = installmentPlan;

    submitShortTermRenewal(
      {
        Tenant_Code: tCode,
        Problem_Description: `Tenant Wish to Extend the Lease ${extensionPeriod} Months Selected Payment Plan ${installments} installment`,
      },
      {
        onSuccess: () => {
          applySubmittedSummary(extensionPeriod, installments);
          setShowSuccessModal(true);

          fetchRenewalStepperSilent(null, {
            onSuccess: (response) => {
              setStepperAPIData(response);
              applySubmittedSummary(
                response?.LeasePeriodInMonths || extensionPeriod,
                response?.NoOfInstallments || installments
              );
              trackShortTermSelection(extensionPeriod, installments, response?.ProposalId ?? '');
              if (response?.IsShortTermRenewal) {
                loadProposalReadyData(response);
              }
            },
            onError: () => {
              trackShortTermSelection(extensionPeriod, installments, '');
            },
          });
        },
        onError: () => {
          openModal('error-modal');
        },
      }
    );
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const isPaymentOptionDisabled = useCallback(
    (optionKey: number) => {
      // 1 installment → PDC + Card only (keys 1, 2)
      if (lockedInstallments === '1') {
        return optionKey === 3 || optionKey === 4;
      }
      // 2 installments → first 3 options; key 4 never shown
      return optionKey === 4;
    },
    [lockedInstallments]
  );

  const isProceedDisabled =
    !selectedPaymentPlan ||
    isPaymentOptionDisabled(Number(selectedPaymentPlan)) ||
    isProceeding ||
    !renewalProposalData;

  const executeShortTermProceed = useCallback(async () => {
    if (!tCode || !renewalProposalData || !selectedPaymentPlan) return;

    setIsProceeding(true);
    closeModal();

    const proposalDetails =
      renewalProposalData?.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v;
    const leaseCharges = renewalProposalData?.Lease_charges?.ME_Lease_charges_V ?? [];
    const { ejariFees, adminFee } = summarizeLeaseCharges(leaseCharges);
    const paymentOptionId = Number(selectedPaymentPlan);
    const isPdc = paymentOptionId === 1;

    try {
      const createPayload = {
        TenantCode: tCode,
        Proposal_ID: stepperAPIData?.ProposalId || proposalDetails?.PROPOSAL_ID || 0,
        Invoice_Frequency: invoiceFrequency,
        IsValid: true,
        Request_Source: 'Portal',
      };

      await new Promise<void>((resolve, reject) => {
        createContractRenewal(createPayload, {
          onSuccess: (res) => {
            if (res && res !== 'null') resolve();
            else reject(new Error('CreateRenewal failed'));
          },
          onError: () => reject(new Error('CreateRenewal error')),
        });
      });

      if (!isPdc) {
        const trackPayload = {
          ProfileId: tCode,
          ProposalId: stepperAPIData?.ProposalId,
          LeasePeriodInMonths: Number(submittedLeasePeriod || stepperAPIData?.LeasePeriodInMonths),
          NoOfInstallments: Number(lockedInstallments),
          TotalPayableAmount: renewalProposalData?.TotalPayableAmount,
          ProposalStartDate: proposalDetails?.PROPOSAL_START_DATE,
          ProposalEndDate: proposalDetails?.PROPOSAL_END_DATE,
          UserState: 1,
          EjariFees: ejariFees,
          AdminFees: adminFee,
          PaymentOptionId: String(paymentOptionId),
        };

        await new Promise<void>((resolve, reject) => {
          trackContractDetails(trackPayload, {
            onSuccess: (res: any) => {
              if (res?.Status === 'Success' || res?.Code === 200 || (res && res !== 'null')) {
                router.replace(`/contract-renewal/pay-renewal?po=${paymentOptionId}`);
                resolve();
              } else {
                reject(new Error('Track failed'));
              }
            },
            onError: () => reject(new Error('Track error')),
          });
        });
        return;
      }

      // PDC → document validation then upload/sign (old trackShortTermContractDetails)
      const validation = await fetchRenewalDocumentValidation();
      const userState = validation.documentsFailed ? 1 : 2;

      await new Promise<void>((resolve, reject) => {
        trackContractDetails(
          {
            ProfileId: tCode,
            ProposalId: stepperAPIData?.ProposalId,
            LeasePeriodInMonths: Number(
              submittedLeasePeriod || stepperAPIData?.LeasePeriodInMonths
            ),
            NoOfInstallments: Number(lockedInstallments),
            TotalPayableAmount: renewalProposalData?.TotalPayableAmount,
            ProposalStartDate: proposalDetails?.PROPOSAL_START_DATE,
            ProposalEndDate: proposalDetails?.PROPOSAL_END_DATE,
            UserState: userState,
            AnyDocFailed: userState === 1,
            PaymentOptionId: String(paymentOptionId),
            EjariFees: ejariFees,
            AdminFees: adminFee,
          },
          {
            onSuccess: (res: any) => {
              if (res?.Status === 'Success' || res?.Code === 200 || (res && res !== 'null')) {
                router.replace(getRenewalRouteAfterDocumentTrack(userState));
                resolve();
              } else {
                reject(new Error('Track failed'));
              }
            },
            onError: () => reject(new Error('Track error')),
          }
        );
      });
    } catch {
      openModal('error-modal');
    } finally {
      setIsProceeding(false);
    }
  }, [
    closeModal,
    createContractRenewal,
    fetchRenewalDocumentValidation,
    invoiceFrequency,
    lockedInstallments,
    openModal,
    renewalProposalData,
    router,
    selectedPaymentPlan,
    stepperAPIData,
    submittedLeasePeriod,
    tCode,
    trackContractDetails,
  ]);

  const handleProceed = useCallback(() => {
    if (isProceedDisabled) return;

    const threshold = Number(stepperAPIData?.OutstandingThresholdAmount) || 1000;

    if (!outstandingAmount) {
      void executeShortTermProceed();
      return;
    }

    // Keep outstanding modal open; Pay Later / Proceed continue when under threshold
    openModal('outstanding-payment-modal');

    if (outstandingAmount < threshold) {
      // Store continue action via modal callbacks handled in UI
    }
  }, [
    executeShortTermProceed,
    isProceedDisabled,
    openModal,
    outstandingAmount,
    stepperAPIData?.OutstandingThresholdAmount,
  ]);

  const handleOutstandingPayLater = useCallback(() => {
    void executeShortTermProceed();
  }, [executeShortTermProceed]);

  const handleOutstandingProceed = useCallback(() => {
    void executeShortTermProceed();
  }, [executeShortTermProceed]);

  useEffect(() => {
    if (!tCode) return;

    fetchRenewalStepper(null, {
      onSuccess: (response) => {
        setStepperAPIData(response);
        if (response?.IsShortTermRenewal) {
          applySubmittedSummary(response?.LeasePeriodInMonths, response?.NoOfInstallments);
          loadProposalReadyData(response);
        }
        setHasCheckedStepper(true);
      },
      onError: () => {
        setHasCheckedStepper(true);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tCode]);

  // Clear invalid payment selection when installment lock changes
  useEffect(() => {
    if (!selectedPaymentPlan) return;
    if (isPaymentOptionDisabled(Number(selectedPaymentPlan))) {
      setSelectedPaymentPlan('');
    }
  }, [isPaymentOptionDisabled, selectedPaymentPlan]);

  return {
    view,
    extensionPeriod,
    installmentPlan,
    isConfirmDisabled,
    showInfoMessage,
    isSixMonthExtension,
    hasLeasePeriod,
    showSuccessModal,
    isSubmitting,
    isRequestSubmitted,
    hasCheckedStepper,
    submittedLeasePeriod,
    submittedInstallments,
    stepperAPIData,
    isProposalReady,
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
    isProceeding,
    isLoadingProposal,
    setExtensionPeriod: handleExtensionPeriodChange,
    setInstallmentPlan,
    handleCancel,
    handleConfirm,
    handleSuccessModalClose,
    handleProceed,
    handleOutstandingPayLater,
    handleOutstandingProceed,
    isPaymentOptionDisabled,
  };
}
