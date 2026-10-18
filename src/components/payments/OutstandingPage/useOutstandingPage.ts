'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';
import { Card } from '../PaymentsPage/payment.types';
import { getLastDayOfMonthDate, isExpired, formatDate, formatNumber } from 'lib/utils/helper';

export const useOutstandingPayment = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orderID = searchParams.get('orderID') || '';
  const cardRef = searchParams.get('ref') || '';

  const { tCode, LeaseEndDate, ProposalEndDate } = useUserStore();
  const { openModal } = useUIStore();
  const setUserData = useUserStore((state) => state.setUserData);

  const [newCard, setNewCard] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [termsAndConditions, setTermsAndConditions] = useState<boolean>(false);
  const orderRefInstance = useRef<string>('');
  const [outstandingDetails, setOutstandingDetails] = useState<any>({});

  const [cards, setCards] = useState<any[]>([]);
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<any>();
  const [primaryCard, setPrimaryCard] = useState<Card>();
  const [leaseEndData, setLeaseEndDate] = useState('');
  const [proposalEndData, setProposalEndDate] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [cvv, setCvv] = useState({
    value: '',
    valid: false,
  });

  /* ---------------- API ---------------- */

  const { mutate: loadcards } = useApiMutation<any, any>(
    `/v1/payments/${tCode}/cards`,
    'GET',
    false
  );

  const { mutate: mutateProfileData } = useApiMutation<any, any>(
    () => `/v1/Tenant/${tCode}/Notifications/ProfileLiteApps`,
    'GET',
    false
  );

  const { mutate: getAccessToken } = useApiMutation<any, any>(
    `/v1/payments/gateway/token`,
    'GET',
    true
  );

  const { mutate: getOrderDetails } = useApiMutation<any, any>(
    (requestData) => `/v1/payments/gateway/${tCode}/order/${requestData.orderId}/1`,
    'GET',
    true
  );

  const { mutate: proceedPaymentAPI } = useApiMutation<any, any>(
    (variables) => `/v1/payments/gateway/${tCode}/order/${variables.orderId}/pay`,
    'POST',
    true,
    (variables) => {
      const { ...rest } = variables;
      return rest;
    }
  );

  const { mutate: createReceipt } = useApiMutation<any, any>(
    `/v1/payments/CreateReceiptYardi`,
    'POST',
    true
  );

  const { mutate: getOrderId } = useApiMutation<any, any>(
    `/v1/payments/gateway/${tCode}/order`,
    'POST',
    true
  );

  /* ---------------- Handlers ---------------- */

  const getCardExpiry = (date: any) => {
    if (date === null || date === undefined || date === '') {
      return 'XX/XXXX';
    }
    const [year, month] = date.split('-');
    return `${month}/${year}`;
  };

  const handleBack = () => {
    setStep(1);
    setNewCard(false);
    setCvv({ value: '', valid: false });
    setTermsAndConditions(false);
  };

  const requestAccessToken = (type: number) => {
    getAccessToken(null, {
      onSuccess: (response: any) => {
        if (response.access_token) {
          if (type == 1) {
            requestOrderDetails(response.access_token, 1, orderID);
          } else if (type == 2) {
            requestOrderId(response.access_token);
          } else if (type == 3) {
            requestOrderDetails(response.access_token, 3, orderRefInstance.current);
          } else if (type == 4) {
            requestOrderDetails(response.access_token, 3, cardRef);
          }
        }
      },
    });
  };

  const requestOrderId = (token: any) => {
    const redirectURL = `${window.location.origin}${pathname}`;
    const requestBody = {
      TransactionItems: outstandingDetails.TransactionItems,
      UserJourneyId: '1',
      Transaction: {
        action: 'SALE',
        amount: { currencyCode: 'AED', value: (outstandingDetails.Amount * 100).toFixed(0) },
        merchantAttributes: {
          redirectUrl: redirectURL,
          skip3DS: true,
          cancelText: 'Cancel',
          cancelUrl: redirectURL + '?rd=1',
        },
      },
    };
    getOrderId(
      {
        ...requestBody,
        _headers: { token: token },
      },
      {
        onSuccess: (response: any) => {
          if (response?.Id) {
            requestOrderDetails(token, 2, response.Id);
          }
        },
      }
    );
  };

  const requestOrderDetails = (token: string, state: number, orderId: string) => {
    getOrderDetails(
      {
        orderId: orderId,
        _headers: { token: token },
      },
      {
        onSuccess: (response) => {
          if (response != null && response.PaymentStatus) {
            setOutstandingDetails(response);
            orderRefInstance.current = response.OrderReference;

            if (state == 1) {
            } else if (state == 2) {
              proceedPayment(orderId, token);
            } else if (state == 3) {
              if (response.PaymentStatus == 'CAPTURED') {
                createYardiReceipt(response);
              } else {
                openModal('payment-failed-modal');
              }
            }
          } else if (state == 3) {
            openModal('payment-failed-modal');
          } else {
            openModal('error-modal');
          }
        },
        onError: () => {
          openModal('error-modal');
        },
      }
    );
  };

  const proceedPayment = (orderId: string, token: string) => {
    proceedPaymentAPI(
      {
        orderId: orderId,
        CardId: selectedCard.CardId,
        CVV: cvv.value,
        _headers: { token: token },
      },
      {
        onSuccess: (response) => {
          if (response != null) {
            requestAccessToken(3);
          }
        },
      }
    );
  };

  const createYardiReceipt = (data: any) => {
    const requestData: any = {
      CPcreateReceipts: {
        CPcreateReceipt: [],
      },
    };

    data.TransactionItems.forEach((item: any) => {
      const receipt = {
        Invoice_Number: item.InvoiceNumber,
        tcode: tCode,
        chargecode: item.ChargeCode,
        amount: item.Value,
        Online_RefID: data.OrderReference,
        WO_Number: '',
        Notes: item.Description,
        bank_code: '',
      };
      requestData.CPcreateReceipts.CPcreateReceipt.push(receipt);
    });

    createReceipt(requestData, {
      onSuccess: () => {
        openModal('payment-success-modal');
      },
    });
  };

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (tCode) {
      loadcards(null, {
        onSuccess: (response) => {
          if (response != null) {
            setCards(
              response
                .filter((card: any) => !isExpired(card.ExpiryDate))
                .sort((a: any, b: any) => {
                  if (a.IsSelected === b.IsSelected) return 0;
                  return a.IsSelected ? -1 : 1;
                })
            );
            setIsCardsLoading(false);
            const _primaryCard = response.find((card: any) => card.IsSelected === true);

            if (_primaryCard) {
              setPrimaryCard(_primaryCard);
              setSelectedCard(_primaryCard);
            }
          }
        },
      });
    }
  }, [tCode, loadcards]);

  useEffect(() => {
    if (LeaseEndDate || ProposalEndDate) {
      if (LeaseEndDate) setLeaseEndDate(LeaseEndDate);
      if (ProposalEndDate) setProposalEndDate(ProposalEndDate);
    } else if (tCode) {
      mutateProfileData(null, {
        onSuccess: (response) => {
          setUserData({
            LeaseEndDate: response?.LeaseEndDate,
            ProposalEndDate: response?.ProposalEndDate,
          });
        },
      });
    }
  }, [LeaseEndDate, ProposalEndDate, tCode, mutateProfileData]);

  const shouldShowError = (cardExpiry: string, leaseEndDate: string, proposalEndDate: string) => {
    const expiry = getLastDayOfMonthDate(cardExpiry);
    const notExpired = !isExpired(cardExpiry);
    const beforeLease = expiry < new Date(leaseEndDate);
    const beforeProposal = expiry < new Date(proposalEndDate);

    return notExpired && (beforeLease || beforeProposal);
  };

  useEffect(() => {
    if (cardRef) {
      setNewCard(true);
      requestAccessToken(4);
    } else {
      requestAccessToken(1);
    }
  }, [cardRef, orderID]);

  return {
    tCode,
    leaseEndData,
    proposalEndData,
    outstandingDetails,

    cards,
    setCards,

    isCardsLoading,
    setIsCardsLoading,

    selectedCard,
    setSelectedCard,

    primaryCard,
    setPrimaryCard,

    shouldShowError,

    showTooltip,
    setShowTooltip,

    cvv,
    setCvv,

    newCard,
    setNewCard,

    step,
    setStep,

    termsAndConditions,
    setTermsAndConditions,

    getCardExpiry,
    handleBack,
    formatDate,
    formatNumber,
    requestAccessToken,
  };
};
