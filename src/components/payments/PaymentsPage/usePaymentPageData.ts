'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';
import { useUIStore } from 'src/store/useUIStore';
import { PAYMENT_SUMMARY_CATEGORIES } from 'lib/common/constants/common';
import {
  OutstandingPaymentResponse,
  PaymentsSummaryResponse,
  Transaction,
  TransactionResponse,
  UpcomingPaymentsResponse,
} from 'components/payments/PaymentsPage/payment.types';
import { useFileDownload } from './useFileDownload';
import { formatDateTime } from 'lib/utils/helper';

export function usePaymentPageData() {
  const router = useRouter(); // Fixed: Moved inside the hook
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();

  const [returnUrl, setReturnUrl] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [outstandingPayments, setOutstandingPayments] = useState<OutstandingPaymentResponse[]>([]);
  const [totalOutstandingAmount, setTotalOutstandingAmount] = useState<number>(0);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPaymentsResponse[]>([]);
  const [totalUpcomingAmount, setTotalUpcomingAmount] = useState<number>(0);
  const [primaryCard, setPrimaryCard] = useState<any>(null);
  const [leaseTenure, setLeaseTenure] = useState('1');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAll, setShowAll] = useState(false);

  const { downloadFile } = useFileDownload();

  const shouldShowMore = transactions.length > 4;
  const visibleTransactions = showAll ? transactions : transactions.slice(0, 4);

  const leaseTenureOptions = [
    { value: '1', label: 'Current Lease', id: 'current-lease', selected: true, disabled: false },
    { value: '0', label: 'All', id: 'all', selected: false, disabled: false },
  ];

  /* ---------------- API Mutations ---------------- */

  const { mutate: fetchOutstandingPayments, isPending: isLoadingOutstandingPayments } =
    useApiMutation<any, OutstandingPaymentResponse[]>(
      `/v1/payments/dashboard/${tCode}/OutstandingPayments`,
      'GET',
      false
    );

  const { mutate: fetchUpcomingPayments, isPending: isLoadingUpcomingPayments } = useApiMutation<
    any,
    any
  >(`/v1/payments/dashboard/${tCode}/LeasePayments`, 'GET', false);

  const { mutate: fetchPaymentsSummary, isPending: isLoadingPaymentsSummary } = useApiMutation<
    any,
    PaymentsSummaryResponse[]
  >(`/v1/payments/dashboard/${tCode}/PaymentsSummary`, 'GET', false);

  const { mutate: fetchCards } = useApiMutation<any, any>(
    () => `/v1/payments/${tCode}/cards`,
    'GET',
    false
  );

  const { mutate: fetchPaymentHistory, isPending: isLoadingPaymentHistory } = useApiMutation<
    any,
    any
  >(`/v1/payments/${tCode}/yearlytransactions/${leaseTenure}`, 'GET', false);

  const { mutate: getAccessToken } = useApiMutation<any, any>(
    `/v1/payments/gateway/token`,
    'GET',
    true
  );

  const { mutate: getOrderId } = useApiMutation<any, any>(
    `/v1/payments/gateway/${tCode}/order`,
    'POST',
    true,
    undefined,
    { token: accessToken }
  );

  const { mutate: getStatement } = useApiMutation<any, any>(
    `/v1/pdf/${tCode}/Statement/${leaseTenure}`,
    'GET',
    true
  );

  const { mutate: getPaymentReceipt } = useApiMutation<any, any>(
    (requestData) => `/v1/pdf/${tCode}/Receipt/${requestData.receiptNumber}`,
    'GET',
    true
  );

  /* ---------------- Handlers ---------------- */

  const getOrderIdForOutstanding = useCallback(() => {
    const requestBody: any = {
      TransactionItems: outstandingPayments.map((item) => ({
        TransactionId: item.Id,
        Name: item.Title,
        Value: item.Amount,
        Description: item.Info,
        DueDate: formatDateTime(item.Date),
        InvoiceNumber: item.InvoiceNumber,
        ChargeCode: item.ChargeCode,
      })),
      UserJourneyId: '1',
      Transaction: {
        action: 'SALE',
        amount: { currencyCode: 'AED', value: (totalOutstandingAmount * 100).toFixed(0) },
        merchantAttributes: {
          redirectUrl: returnUrl,
          skip3DS: 'false',
          cancelText: 'Cancel',
          cancelUrl: returnUrl + '?rd=1',
        },
      },
    };

    getOrderId(requestBody, {
      onSuccess: (response: any) => {
        if (response?.Id) {
          router.push(`${returnUrl}?orderID=${response.Id}`);
        }
      },
    });
  }, [getOrderId, outstandingPayments, returnUrl, totalOutstandingAmount, router]);

  const requestAccessToken = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setReturnUrl(`${window.location.origin}${e.currentTarget.getAttribute('href')}`);
    getAccessToken(null, {
      onSuccess: (response: any) => {
        if (response.access_token) {
          setAccessToken(response.access_token);
        }
      },
    });
  };

  const handleViewReceipt = (receiptNumber: string) => {
    if (tCode && receiptNumber) {
      getPaymentReceipt(
        { receiptNumber },
        {
          onSuccess: (response) => {
            if (response) downloadFile(response, `ReceiptPayment_${receiptNumber}.pdf`);
            else openModal('error-modal');
          },
          onError: () => openModal('error-modal'),
        }
      );
    }
  };

  const handleDownloadStatement = () => {
    if (tCode) {
      getStatement(null, {
        onSuccess: (response) => {
          if (response)
            downloadFile(
              response,
              `PaymentHistory_${leaseTenure === '1' ? 'CurrentLease' : 'All'}.pdf`
            );
          else openModal('error-modal');
        },
        onError: () => openModal('error-modal'),
      });
    }
  };

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (returnUrl && accessToken) {
      getOrderIdForOutstanding();
    }
  }, [accessToken, returnUrl, getOrderIdForOutstanding]);

  useEffect(() => {
    if (!tCode) return;

    fetchOutstandingPayments(null, {
      onSuccess: (response) => setOutstandingPayments(response ?? []),
      onError: () => openModal('error-modal'),
    });

    fetchPaymentsSummary(null, {
      onSuccess: (response) => {
        const out = response?.find(
          (i) => i.Category === PAYMENT_SUMMARY_CATEGORIES.OUTSTANDING_PAYMENTS
        );
        const up = response?.find(
          (i) => i.Category === PAYMENT_SUMMARY_CATEGORIES.UPCOMING_PAYMENTS
        );
        setTotalOutstandingAmount(out?.Amount ?? 0);
        setTotalUpcomingAmount(up?.Amount ?? 0);
      },
      onError: () => openModal('error-modal'),
    });
  }, [tCode, fetchOutstandingPayments, fetchPaymentsSummary, openModal]);

  useEffect(() => {
    if (tCode) {
      fetchUpcomingPayments(null, {
        // Backend may return 500 when lease payments payload is null.
        onSuccess: (res) => setUpcomingPayments(res ?? []),
        onError: () => setUpcomingPayments([]),
      });

      fetchCards(null, {
        onSuccess: (res) => {
          const primary = res?.find((card: any) => card.IsSelected);
          setPrimaryCard(primary);
        },
      });
    }
  }, [tCode, fetchUpcomingPayments, fetchCards, openModal]);

  useEffect(() => {
    if (tCode) {
      fetchPaymentHistory(null, {
        onSuccess: (res: TransactionResponse) => res && setTransactions(res.Transactions),
        onError: () => openModal('error-modal'),
      });
    }
  }, [tCode, fetchPaymentHistory, leaseTenure, openModal]);

  return {
    requestAccessToken,
    outstandingPayments,
    totalOutstandingAmount,
    isOutstandingPaymentLoading: isLoadingOutstandingPayments || isLoadingPaymentsSummary,
    upcomingPayments,
    totalUpcomingAmount,
    isUpcomingPaymentLoading: isLoadingUpcomingPayments || isLoadingPaymentsSummary,
    cardData: primaryCard,
    leaseTenureOptions,
    leaseTenure,
    setLeaseTenure,
    transactions,
    showAll,
    setShowAll,
    shouldShowMore,
    visibleTransactions,
    isLoadingPaymentHistory,
    handleViewReceipt,
    handleDownloadStatement,
  };
}
