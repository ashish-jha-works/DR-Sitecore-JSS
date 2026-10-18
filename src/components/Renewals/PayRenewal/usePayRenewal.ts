import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useRenewalsStore } from 'src/store/useRenewalsStore';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import { formatDate, formatToMMDDYYYY, getYearMonthFromString } from 'lib/utils/helper';

import { separatedAmount } from '../PaymentPlan/utils';
import { useDocumentVerification } from './useDocumentVerification';

export const usePayRenewal = () => {
  const pathname = usePathname();
  const { tCode, ProfileType, LeaseEndDate } = useUserStore();
  const { checkDocumentValidation } = useDocumentVerification();
  const { openModal } = useUIStore();
  const preservedInstallmentAdditionalAmount = useRenewalsStore(
    (state) => state.preservedInstallmentAdditionalAmount
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedPaymentPlan = searchParams.get('po');
  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [installmentsPDCDetails, setInstallmentsPDCDetails] = useState<any>([]);
  const [selectedCard, setSelectedCard] = useState<any>();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethodTermsAccepted, setPaymentMethodTermsAccepted] = useState(false);
  const [acknowledgmentOf12MonthFee, setAcknowledgmentOf12MonthFee] = useState(false);
  const [paymentAcknowledgment, setPaymentAcknowledgement] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const [cvv, setCvv] = useState({
    value: '',
    valid: false,
  });
  const [cardRef, setCardRef] = useState<string>('');
  const [paymentRefNo, setPaymentRefNo] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [cardsValidUntilDate, setCardsValidUntilDate] = useState<any>(null);

  const orderRefInstance = useRef<string>('');

  const isFuturePayment = stepperAPIData?.IsFuturePayment;

  const leaseEndDate = new Date(LeaseEndDate as string);
  const isLeaseExpired = leaseEndDate.getTime() < Date.now();

  const leaseEndDateConverted = `${String(leaseEndDate.getMonth() + 1).padStart(
    2,
    '0'
  )}/${leaseEndDate.getFullYear()}`;

  //Modals State
  const [errorModalHeading, setErrorModalHeading] = useState('');
  const [errorModalDesc, setErrorModalDesc] = useState('');

  /* ---------------- API ---------------- */

  const { mutate: fetchPDCDetails, isPending: isLoadingPDCDetails } = useApiMutation<any, any>(
    () => `ContractRenewal/GetPdcDetails/${tCode}`,
    'GET',
    false
  );

  const { mutate: fetchInstallmentPlan, isPending: isLoadingInstallmentPlan } = useApiMutation<
    any,
    any
  >(() => `ContractRenewal/InstallmentPlan/${tCode}`, 'GET', false);

  const { mutate: createPaymentEntry } = useApiMutation<any, any>(
    () =>
      `ContractRenewal/CreatePaymentEntry/${tCode}/${selectedPaymentPlan}/?source=Portal&cardID=${selectedCard?.CardId}`,
    'POST',
    true
  );

  const { mutate: getAccessToken } = useApiMutation<any, any>(
    `/v1/payments/gateway/token`,
    'GET',
    true
  );

  const { mutate: getOrderDetails } = useApiMutation<any, any>(
    (requestData) =>
      requestData?.orderId
        ? `/v1/payments/gateway/${tCode}/order/${requestData.orderId}/${
            isFuturePayment ? '2' : '1'
          }`
        : `/v1/payments/gateway/${tCode}/order/${cardRef}/${isFuturePayment ? '2' : '1'}`,
    'GET',
    true
  );

  const { mutate: proceedPaymentAPI } = useApiMutation<any, any>(
    (variables) => `/v1/payments/gateway/${tCode}/order/${variables.orderId}/pay`,
    'POST',
    true,
    (variables) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { orderId, ...rest } = variables;
      return rest;
    }
  );

  const { mutate: createRenewalReceipt } = useApiMutation<any, any>(
    `/v1/payments/CreateRenewalReceipt`,
    'POST',
    true
  );

  const { mutate: createOrder } = useApiMutation<any, any>(
    `/v1/payments/gateway/${tCode}/order`,
    'POST',
    true
  );

  const { mutate: setDefaultCard } = useApiMutation<any, any>(
    (params) => `/v1/payments/${tCode}/SetAsDefault/${params?.cardId}`,
    'POST',
    false
  );

  /* ---------------- Handlers ---------------- */

  const requestAccessToken = async (
    type: number,
    isNewCard = false,
    token?: string,
    orderId?: string
  ): Promise<string | void> => {
    const handleSuccess = (accessToken: string): any => {
      if (type === 1) {
        return accessToken;
      } else if (type === 2) {
        requestOrderId(accessToken, isNewCard);
      } else if (type === 3) {
        requestOrderDetails(accessToken, 3, orderRefInstance.current);
      } else if (type === 4) {
        requestOrderDetails(accessToken, 3, orderId ?? cardRef);
      }
    };

    if (token) {
      return handleSuccess(token);
    }

    return new Promise((resolve, reject) => {
      getAccessToken(null, {
        onSuccess: (response: any) => {
          if (response.access_token) {
            resolve(handleSuccess(response.access_token));
          } else {
            reject(new Error('No access token'));
          }
        },
        onError: reject,
      });
    });
  };

  const requestOrderId = (token: any, isNewCard = false) => {
    const redirectURL = `${window.location.origin}${pathname}?po=${selectedPaymentPlan}`;
    const firstInstallmentDescription = 'Rent + Ejari fees + Admin fee + Cooling Charges';

    const payload: any = {
      Transaction: {
        action: 'SALE',
        amount: {
          currencyCode: 'AED',
          value: 100,
        },
        merchantAttributes: {
          redirectUrl: redirectURL,
          skip3DS: String(!isNewCard),
          cancelText: 'Cancel',
          cancelUrl: redirectURL,
        },
      },
      TransactionItems: [],
      UserJourneyId: 4,
    };

    // logic for deducting 1st installment incase of non-future payment

    const firstInstallment = installmentsPDCDetails?.[0];

    if (!isFuturePayment && firstInstallment && !isNewCard) {
      payload.TransactionItems.push({
        Name: firstInstallmentDescription,
        Value: Number(firstInstallment.installmentAmount),
        TransactionId: 'C-12346',
        Description: firstInstallmentDescription,
        DueDate: formatToMMDDYYYY(firstInstallment.installmentDate),
        ChargeCode: null,
        InvoiceNumber: null,
      });

      payload.Transaction.amount.value = Number(firstInstallment.installmentAmount) * 100;

      payload.UserJourneyId = '2';
    }

    createOrder(
      {
        ...payload,
        _headers: { token },
      },
      {
        onSuccess: (response: any) => {
          const { PaymentsUrl, Id, Amount } = response || {};

          if (!PaymentsUrl || !Id) {
            openModal('error-modal');
            return;
          }

          if (isNewCard) {
            window.location.href = PaymentsUrl;
            return;
          }

          if (Amount) {
            setPaymentAmount(Amount);
          }

          if (selectedCard.CVV || cvv?.value) {
            requestOrderDetails(token, 2, Id);
          }
        },
        onError: () => {
          openModal('error-modal');
        },
      }
    );
  };

  const requestOrderDetails = (token: string, state: number, orderId: string) => {
    if (state == 2) {
      proceedPayment(orderId, token);
    } else {
      getOrderDetails(
        {
          orderId: orderId,
          _headers: { token: token },
        },
        {
          onSuccess: (response) => {
            if (response != null && response.PaymentStatus) {
              orderRefInstance.current = response.OrderReference;

              if (state == 3) {
                if (response.PaymentStatus == 'CAPTURED') {
                  setPaymentResponse(response);
                } else {
                  if (cardRef) {
                    openModal('add-card-failure-modal');
                  } else {
                    openModal('renewals-payment-failed-modal');
                  }
                }
              }
            } else {
              openModal('error-modal');
            }
          },
          onError: () => {
            openModal('error-modal');
          },
        }
      );
    }
  };

  const proceedPayment = (orderId: string, token: string) => {
    proceedPaymentAPI(
      {
        orderId: orderId,
        CardId: selectedCard.CardId,
        CVV: cvv.value,
        _headers: { token },
      },
      {
        onSuccess: (response) => {
          if (response != null) {
            requestAccessToken(4, false, token, orderId);
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

  const setCardAsDefault = (cardId: string, paymentReferenceNo: any) => {
    setDefaultCard(
      { cardId },
      {
        onSuccess: (response: any) => {
          if (response === null) {
            openModal('error-modal');
          }
        },
        onError: () => {
          openModal('error-modal');
        },
      }
    );
    setPaymentRefNo(paymentReferenceNo);
    if (cardRef) {
      openModal('add-card-success-modal');
    } else {
      openModal('renewals-payment-success-modal');
    }
  };

  const isCardValid = (cardExpiry: string, validUntil: string) => {
    const expiry = getYearMonthFromString(cardExpiry);
    const target = getYearMonthFromString(validUntil);

    return (
      new Date(expiry.inputYear, expiry.inputMonth).valueOf() >
      new Date(target.inputYear, target.inputMonth).valueOf()
    );
  };

  const showCardExpiryError = (validUntil: string) => {
    setErrorModalHeading(
      `This card expires before your lease ${
        Number(selectedPaymentPlan) === 2 ? 'end' : 'start'
      } date!`
    );

    setErrorModalDesc(
      `To pay by card, please add a card with validity until ${validUntil
        .split('-')
        .reverse()
        .join('/')}`
    );

    openModal('renewals-lease-expiry-error-modal');
  };

  const createReceipt = (data: any, amount: string) => {
    createRenewalReceipt(
      {
        PersonCode: tCode,
        Amount: amount,
        OnlineRef: data.OrderReference,
        Notes: 'Instalment + Ejari + Ejari Admin + Admin',
      },
      {
        onSuccess: (response) => {
          if (response) {
            if (!response || response.Response.Status !== 'Success') {
              openModal('renewals-payment-failed-modal');
            }
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

  const createYardiReceipt = (data: any) => {
    if (!stepperAPIData?.ProposalEndDate) return;

    const selectedCardId = data.SavedCard.CardId;
    const orderAmount = Number(data.Amount).toFixed(2);

    const hasMultipleInstallments = installmentsPDCDetails?.length > 1;
    const isDebitPayment = Number(selectedPaymentPlan) === 2;

    // const useLeaseEndDate = hasMultipleInstallments && (!isFuturePayment || isDebitPayment); // Old Logic
    const useLeaseEndDate = hasMultipleInstallments && isDebitPayment;

    // Always validate card
    if (cardRef) {
      const validUntil = useLeaseEndDate
        ? stepperAPIData.ProposalEndDate.slice(0, 7)
        : stepperAPIData.ProposalStartDate.slice(0, 7);

      if (!isCardValid(data.SavedCard.CardExpiry, validUntil)) {
        showCardExpiryError(validUntil);
        return;
      }
    }

    // Set default for all new card addition having multiple installments
    setCardAsDefault(selectedCardId, data.OrderReference);

    if (!isFuturePayment && Number(orderAmount) > 0) {
      createReceipt(data, orderAmount);
    }
  };

  const handleAddNewCard = () => {
    requestAccessToken(2, true);
  };

  const handleSubmitPaymentRequest = async () => {
    const token = await requestAccessToken(1);
    if (isFuturePayment) {
      createPaymentEntry(
        { _headers: { token } },
        {
          onSuccess: (response) => {
            if (
              response?.Response?.Body?.CreateAddPaymentsResponse?.CreateAddPaymentsResult?.Status?.includes(
                'Success'
              )
            ) {
              openModal('renewals-payment-success-modal');
            } else {
              openModal('renewals-payment-failed-modal');
            }
          },
          onError: () => {
            openModal('error-modal');
          },
        }
      );
    } else {
      requestAccessToken(2);
    }
  };

  const handleCancelJourney = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace('/contract-renewal');
    }
  };

  const handlePaymentSuccessContinueClick = async () => {
    if (Number(selectedPaymentPlan) === 4) {
      router.push('/contract-renewal/direct-debit-form');
    } else if (Number(selectedPaymentPlan) === 3) {
      router.push('/contract-renewal/cheque-payment?po=3');
    } else {
      if (tCode && ProfileType) {
        const selectedInstallmentPlan = installmentsPDCDetails.length;
        // Check for documents status, accordingly to redirection & update stepper
        checkDocumentValidation({
          selectedInstallmentPlan,
          selectedPaymentPlan: Number(selectedPaymentPlan),
          paymentRefNo,
        });
      }
    }
  };

  useEffect(() => {
    if (!cardRef) return;

    requestAccessToken(3);
  }, [cardRef]);

  useEffect(() => {
    const refFromUrl =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('ref') || ''
        : '';

    setCardRef(refFromUrl);
  }, []);

  useEffect(() => {
    const noOfInstallment = installmentsPDCDetails?.length;
    if (stepperAPIData && noOfInstallment) {
      // To set the logic to showcase cards based upon the Proposal State & End date as per the selected plan
      if (Number(selectedPaymentPlan) === 2 && stepperAPIData.ProposalEndDate && noOfInstallment) {
        setCardsValidUntilDate(stepperAPIData.ProposalEndDate);
      } else {
        setCardsValidUntilDate(stepperAPIData.ProposalStartDate);
      }
      // For payment success case
      if (paymentResponse && paymentResponse.PaymentStatus === 'CAPTURED') {
        createYardiReceipt(paymentResponse);
      }
    }
  }, [paymentResponse, stepperAPIData, installmentsPDCDetails]);

  useEffect(() => {
    fetchInstallmentPlan(null, {
      onSuccess: (installmentRes: any) => {
        fetchPDCDetails(null, {
          onSuccess: (res: any) => {
            if (res && res?.PdcList?.length) {
              const pdcList = res.PdcList;
              const matchedPlan =
                installmentRes?.InstallmentPlans?.find(
                  (plan: any) => Number(plan?.NoOfInstallment) === pdcList.length
                ) ?? installmentRes?.InstallmentPlans?.[0];

              const proposalDetails =
                matchedPlan?.RenewalProposal?.Res_Renewal_Proposal?.ME_Res_Renewal_Proposal_dtls_v;
              const leaseCharges =
                matchedPlan?.RenewalProposal?.Lease_charges?.ME_Lease_charges_V ?? [];
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

              const installmentDetails = pdcList.map((pdc: any, index: number) => {
                const splitAmount = separatedAmount(pdc?.AmountInWords);
                const [line1, line2] = splitAmount?.split('~;') ?? [];

                // PaymentPlanPay.js First Payment description
                let paymentDesc = index === 0 ? 'Rent + Ejari fees + Admin fee' : 'Rent';
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

              setInstallmentsPDCDetails(installmentDetails);
            } else {
              openModal('error-modal');
            }
          },
          onError: () => openModal('error-modal'),
        });
      },
      onError: () => openModal('error-modal'),
    });
  }, []);

  useEffect(() => {
    if (selectedPaymentPlan === null || selectedPaymentPlan === undefined) {
      router.replace('/contract-renewal/payment-plan');
      return;
    }

    const planNumber = Number(selectedPaymentPlan);

    // 3. Validate that the selected payment plan it's a real number and less than or equal to 4
    const isValidPlan = Number.isFinite(planNumber) && planNumber <= 4;

    if (!isValidPlan) {
      router.replace('/contract-renewal/payment-plan');
    }
  }, [selectedPaymentPlan, router]);

  const isLoading = isLoadingPDCDetails || isLoadingInstallmentPlan || !stepperAPIData;

  return {
    isLoading,
    setStepperAPIData,
    installmentsPDCDetails,
    selectedPaymentPlan,
    selectedCard,
    setSelectedCard,
    termsAccepted,
    setTermsAccepted,
    paymentMethodTermsAccepted,
    setPaymentMethodTermsAccepted,
    acknowledgmentOf12MonthFee,
    setAcknowledgmentOf12MonthFee,
    paymentAcknowledgment,
    setPaymentAcknowledgement,
    cvv,
    setCvv,
    createPaymentEntry,
    isFuturePayment,
    handleAddNewCard,
    handleCancelJourney,
    handleSubmitPaymentRequest,
    paymentRefNo,
    paymentAmount,
    errorModalHeading,
    errorModalDesc,
    preservedInstallmentAdditionalAmount,
    handlePaymentSuccessContinueClick,
    leaseEndDate: leaseEndDateConverted,
    isLeaseExpired,
    openModal,
    router,
    cardsValidUntilDate,
  };
};
