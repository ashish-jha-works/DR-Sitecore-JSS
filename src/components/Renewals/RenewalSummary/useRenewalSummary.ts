import { format, parseISO } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import { formatDate, formatNumber } from 'lib/utils/helper';
import { installmentPaymentTypeName } from 'components/Renewals/PaymentPlan/PaymentSchedule/PaymentSchedule';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

export type SummaryInstallment = {
  number: number;
  methodLabel: string;
  dateLabel: string;
  cardEnding?: string;
  amountLabel: string;
};

function parseApiDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed =
    value.includes('T') || /^\d{4}-\d{2}-\d{2}/.test(value) ? parseISO(value) : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatLeasePeriodDate(value?: string | null): string {
  const date = parseApiDate(value);
  return date ? format(date, 'd MMMM yyyy') : '';
}

function getMethodLabel(
  paymentType: string,
  labels: { card: string; cheque: string; directDebit: string }
) {
  if (paymentType === 'Card') return labels.card;
  if (paymentType === 'Direct Debit') return labels.directDebit;
  return labels.cheque;
}

export function useRenewalSummary(labels: {
  card: string;
  cheque: string;
  directDebit: string;
  cardEnding: string;
}) {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();
  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [pdcList, setPdcList] = useState<any[]>([]);
  const [cardLastFour, setCardLastFour] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  const { mutate: fetchStepper, isPending: isLoadingStepper } = useApiMutation<any, any>(
    () => `/ContractRenewal/Stepper/${tCode}`,
    'GET',
    true
  );

  const { mutate: fetchPdcDetails, isPending: isLoadingPdc } = useApiMutation<any, any>(
    () => `ContractRenewal/GetPdcDetails/${tCode}`,
    'GET',
    true
  );

  const { mutate: fetchCards } = useApiMutation<any, any>(
    `/v1/payments/${tCode}/cards`,
    'GET',
    false
  );

  useEffect(() => {
    if (!tCode) return;

    let pending = 2;
    const settle = () => {
      pending -= 1;
      if (pending <= 0) setHasLoaded(true);
    };

    fetchStepper(null, {
      onSuccess: (response) => {
        if (response && response !== 'null') setStepperAPIData(response);
        settle();
      },
      onError: () => {
        openModal('error-modal');
        settle();
      },
    });

    fetchPdcDetails(null, {
      onSuccess: (response) => {
        if (response?.PdcList?.length) setPdcList(response.PdcList);
        settle();
      },
      onError: () => {
        openModal('error-modal');
        settle();
      },
    });
  }, [fetchPdcDetails, fetchStepper, openModal, tCode]);

  const selectedPaymentPlan = Number(stepperAPIData?.SelectedPaymentOption?.Key);
  const usesCard =
    selectedPaymentPlan === 2 || selectedPaymentPlan === 3 || selectedPaymentPlan === 4;

  useEffect(() => {
    if (!tCode || !usesCard) return;

    fetchCards(null, {
      onSuccess: (response) => {
        if (!Array.isArray(response)) return;
        const selectedCard = response.find((card: any) => card?.IsSelected) || response[0];
        const masked = selectedCard?.MaskedCardNumber || '';
        if (masked) setCardLastFour(String(masked).slice(-4));
      },
    });
  }, [fetchCards, tCode, usesCard]);

  const documentsReceivedDateLabel = useMemo(() => {
    const receivedDate =
      stepperAPIData?.PickUpReceivedByDubaiAMDate || stepperAPIData?.PickUpMadeDate;
    return receivedDate ? formatDate(receivedDate) : '';
  }, [stepperAPIData?.PickUpMadeDate, stepperAPIData?.PickUpReceivedByDubaiAMDate]);

  const leasePeriodLabel = useMemo(() => {
    const start = formatLeasePeriodDate(stepperAPIData?.ProposalStartDate);
    const end = formatLeasePeriodDate(stepperAPIData?.ProposalEndDate);
    if (!start && !end) return '';
    if (start && end) return `${start} - ${end}`;
    return start || end;
  }, [stepperAPIData?.ProposalEndDate, stepperAPIData?.ProposalStartDate]);

  const installmentCount = pdcList.length || Number(stepperAPIData?.NoOfInstallments) || 0;

  const totalPaymentAmount = useMemo(() => {
    if (stepperAPIData?.TotalPayableAmount) {
      return Number(stepperAPIData.TotalPayableAmount);
    }
    return pdcList.reduce((sum, item) => sum + Number(item?.InstallmentAmount || 0), 0);
  }, [pdcList, stepperAPIData?.TotalPayableAmount]);

  const installments: SummaryInstallment[] = useMemo(
    () =>
      pdcList.map((pdc, index) => {
        const paymentType = installmentPaymentTypeName(index, selectedPaymentPlan);
        const methodLabel = getMethodLabel(paymentType, labels);
        const showCardEnding = paymentType === 'Card' && Boolean(cardLastFour);

        return {
          number: index + 1,
          methodLabel,
          dateLabel:
            pdc.InstallementDate || pdc.InstallmentDate
              ? formatDate(pdc.InstallementDate || pdc.InstallmentDate)
              : '',
          cardEnding: showCardEnding ? `${labels.cardEnding} ${cardLastFour}` : undefined,
          amountLabel: `AED ${formatNumber(pdc.InstallmentAmount)}`,
        };
      }),
    [cardLastFour, labels, pdcList, selectedPaymentPlan]
  );

  const isLoading = isLoadingStepper || isLoadingPdc || !hasLoaded;

  const isPhysicalSigning = Boolean(stepperAPIData?.Schedule_Type);

  return {
    isLoading,
    isPhysicalSigning,
    documentsReceivedDateLabel,
    leasePeriodLabel,
    installmentCount,
    totalPaymentLabel: totalPaymentAmount ? `AED ${formatNumber(totalPaymentAmount)}` : '',
    installments,
  };
}
