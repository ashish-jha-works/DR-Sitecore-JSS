'use client';

import { useEffect, useMemo, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import Link from 'next/link';
import PaymentCard from 'components/payments/PaymentCard/PaymentCard';
import PaymentCardListItem from 'components/payments/PaymentCard/PaymentCardListItem';
import CVVInput from 'components/payments/OutstandingPage/CVVInput';
import { Checkbox } from 'components/common/Checkbox';
import InfoMessage from 'components/InfoMessage';
import InfoIcon from 'assets/icons/InfoIcon';
import PlusIcon from 'assets/icons/Plus';
import HelpIcon from 'assets/icons/HelpIcon';
import ChevronDown from 'assets/icons/ChevronDown';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { CustomRichText } from 'src/common/SitecoreOverrides';
import { formatNumber, getLastDayOfMonthDate, isExpired } from 'lib/utils/helper';
import MoveOutOutstandingPaymentSkeleton from './MoveOutOutstandingPaymentSkeleton';

type Props = {
  tCode: string;
  onPaymentCompleted: () => void;
  fields?: any;
};

type ChargeItem = {
  ChargeCode?: string;
  BalanceDue?: number;
  TransactionId?: string;
  ChargeDescription?: string;
  Duedate?: string;
  InvoiceNumber?: string;
  s_Status?: string;
};

export default function MoveOutOutstandingPayment({
  tCode,
  onPaymentCompleted,
  fields = {},
}: Props) {
  const { openModal } = useUIStore();
  const { LeaseEndDate, ProposalEndDate } = useUserStore();

  const shouldShowError = (cardExpiry: string, leaseEndDate: string, proposalEndDate: string) => {
    const expiry = getLastDayOfMonthDate(cardExpiry);
    const notExpired = !isExpired(cardExpiry);
    const beforeLease = expiry < new Date(leaseEndDate);
    const beforeProposal = expiry < new Date(proposalEndDate);
    return notExpired && (beforeLease || beforeProposal);
  };

  const [totalOutstanding, setTotalOutstanding] = useState<number>(0);
  const [officeAddress, setOfficeAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [transactionItems, setTransactionItems] = useState<any[]>([]);

  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cvv, setCvv] = useState({ value: '', valid: false });
  const [showTooltip, setShowTooltip] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  const { isLoaded: isBranchMapLoaded, loadError: branchMapLoadError } = useLoadScript({
    googleMapsApiKey,
    id: 'moveout-branch-office-map',
  });

  const mapCenter = useMemo(() => {
    if (
      latitude == null ||
      longitude == null ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return null;
    }
    return { lat: latitude, lng: longitude };
  }, [latitude, longitude]);

  const { mutate: fetchOutstanding, isPending: isLoadingOutstanding } = useApiMutation<any, any>(
    () => `/MoveOut/FetchOutstanding/${tCode}`,
    'GET',
    false
  );
  const { mutate: fetchCards, isPending: isLoadingCards } = useApiMutation<any, any>(
    () => `/v1/payments/${tCode}/cards`,
    'GET',
    false
  );
  const { mutate: requestToken, isPending: isTokenLoading } = useApiMutation<any, any>(
    () => '/v1/payments/gateway/token',
    'GET',
    true
  );
  const { mutate: createOrder, isPending: isOrderLoading } = useApiMutation<any, any>(
    () => `/v1/payments/gateway/${tCode}/order`,
    'POST',
    true
  );
  const { mutate: payOrder, isPending: isPaying } = useApiMutation<any, any>(
    (variables: any) => `/v1/payments/gateway/${tCode}/order/${variables.orderId}/pay`,
    'POST',
    true,
    (variables: any) => {
      const { ...body } = variables;
      return body;
    }
  );
  const { mutate: getOrderStatus } = useApiMutation<any, any>(
    (variables: any) => `/v1/payments/gateway/${tCode}/order/${variables.orderId}/1`,
    'GET',
    true
  );
  const { mutate: createReceipt } = useApiMutation<any, any>(
    () => '/v1/payments/CreateReceiptYardi',
    'POST',
    true
  );

  useEffect(() => {
    if (!tCode) return;

    setIsInitialLoading(true);
    let remaining = 2;
    const markLoaded = () => {
      remaining -= 1;
      if (remaining <= 0) {
        setIsInitialLoading(false);
      }
    };

    fetchOutstanding(null, {
      onSuccess: (response) => {
        const amount = Number(response?.TotalOutstanding || 0);
        setTotalOutstanding(amount);
        setOfficeAddress(response?.OfficeAddress || '');
        setLatitude(response?.Lattitude ? Number(response.Lattitude) : null);
        setLongitude(response?.Longitude ? Number(response.Longitude) : null);

        const allItems: ChargeItem[] = response?.ChargeDetails?.ME_ChargeDetails_V || [];
        const openItems = allItems.filter((item) => item?.s_Status?.toLowerCase?.() === 'open');
        const mapped = openItems.map((item) => ({
          Name: item.ChargeCode,
          ChargeCode: item.ChargeCode,
          Value: item.BalanceDue,
          TransactionId: item.TransactionId,
          Description: item.ChargeDescription,
          DueDate: item.Duedate,
          InvoiceNumber: item.InvoiceNumber,
        }));
        setTransactionItems(mapped);
        markLoaded();
      },
      onError: () => {
        openModal('error-modal');
        markLoaded();
      },
    });

    fetchCards(null, {
      onSuccess: (response) => {
        const validCards = Array.isArray(response) ? response : [];
        setCards(validCards);
        const primary = validCards.find((card: any) => card?.IsSelected) || validCards[0] || null;
        setSelectedCard(primary);
        markLoaded();
      },
      onError: () => {
        openModal('error-modal');
        markLoaded();
      },
    });
  }, [tCode, fetchOutstanding, fetchCards, openModal]);

  const isProcessing = isTokenLoading || isOrderLoading || isPaying;
  const canConfirmPay = !!selectedCard?.CardId && cvv.valid && termsAccepted && !isProcessing;

  const handleConfirmAndPay = () => {
    if (!selectedCard?.CardId || !cvv.valid || !termsAccepted) return;

    requestToken(null, {
      onSuccess: (tokenResponse) => {
        const token = tokenResponse?.access_token;
        if (!token) {
          openModal('error-modal');
          return;
        }

        const redirectURL =
          typeof window !== 'undefined' ? `${window.location.origin}/move-out` : '';
        const orderPayload = {
          TransactionItems: transactionItems,
          UserJourneyId: '3',
          Transaction: {
            action: 'SALE',
            amount: { currencyCode: 'AED', value: (totalOutstanding * 100).toFixed(0) },
            merchantAttributes: {
              redirectUrl: redirectURL,
              skip3DS: true,
              cancelText: 'Cancel',
              cancelUrl: redirectURL,
            },
          },
          _headers: { token },
        };

        createOrder(orderPayload, {
          onSuccess: (orderResponse) => {
            if (!orderResponse?.Id) {
              openModal('error-modal');
              return;
            }

            payOrder(
              {
                orderId: orderResponse.Id,
                CardId: selectedCard.CardId,
                CVV: cvv.value,
                _headers: { token },
              },
              {
                onSuccess: () => {
                  getOrderStatus(
                    { orderId: orderResponse.Id, _headers: { token } },
                    {
                      onSuccess: (statusResponse) => {
                        if (statusResponse?.PaymentStatus !== 'CAPTURED') {
                          openModal('error-modal');
                          return;
                        }

                        const receiptPayload: any = {
                          CPcreateReceipts: { CPcreateReceipt: [] },
                        };
                        (statusResponse.TransactionItems || []).forEach((item: any) => {
                          receiptPayload.CPcreateReceipts.CPcreateReceipt.push({
                            Invoice_Number: item.InvoiceNumber,
                            tcode: tCode,
                            chargecode: item.ChargeCode,
                            amount: item.Value,
                            Online_RefID: statusResponse.OrderReference,
                            WO_Number: '',
                            Notes: item.Description,
                            bank_code: '',
                          });
                        });

                        createReceipt(receiptPayload, {
                          onSuccess: () => onPaymentCompleted(),
                          onError: () => openModal('error-modal'),
                        });
                      },
                      onError: () => openModal('error-modal'),
                    }
                  );
                },
                onError: () => openModal('error-modal'),
              }
            );
          },
          onError: () => openModal('error-modal'),
        });
      },
      onError: () => openModal('error-modal'),
    });
  };

  return (
    <>
      {isInitialLoading ? (
        <MoveOutOutstandingPaymentSkeleton />
      ) : (
        <>
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
            <div>
              <div className="flex gap-4 items-center">
                <span className="shrink-0 [&_svg]:size-8">
                  <CustomRichText field={fields?.titleIcon} />
                </span>
                <Text
                  tag="h3"
                  field={fields?.outstandingTitle}
                  className="text-[16px] leading-6 md:text-[20px] md:leading-6 font-normal"
                />
              </div>

              <Text
                tag="p"
                field={fields?.outstandingDescription}
                className="text-[14px] leading-5 md:text-[16px] md:leading-6 text-navy-500 mt-4"
              />
            </div>

            <div className="flex flex-col gap-5 md:gap-0">
              <div className="flex justify-between items-start gap-4 md:py-3 border-b border-lilac-100">
                <Text
                  tag="span"
                  field={fields?.costBreakdownLabel || { value: 'Cost breakdown' }}
                  className="text-body font-bold text-navy-500"
                />
                <span className="text-body font-bold text-navy-500 tabular-nums shrink-0">
                  AED {formatNumber(totalOutstanding)}
                </span>
              </div>
              {transactionItems.length > 0 ? (
                <>
                  {transactionItems.map((item: any, idx: number) => (
                    <div
                      key={`${item.ChargeCode ?? item.Name}-${idx}`}
                      className="flex justify-between items-start gap-4 md:py-3 border-b border-lilac-100"
                    >
                      <span className="text-body font-light text-navy-500">{item.Description}</span>
                      <span className="text-body font-light text-navy-500 tabular-nums shrink-0">
                        AED {formatNumber(Number(item.Value) || 0)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-start gap-4 md:py-3">
                    <Text
                      tag="span"
                      field={fields?.outstandingTotalLabel}
                      className="text-body font-bold text-navy-500"
                    />
                    <span className="text-body font-bold text-navy-500 tabular-nums shrink-0">
                      AED {formatNumber(totalOutstanding)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-start gap-4 md:py-3">
                  <Text
                    tag="span"
                    field={fields?.outstandingTotalLabel}
                    className="text-body font-bold text-navy-500"
                  />
                  <span className="text-body font-bold text-navy-500 tabular-nums shrink-0">
                    AED {formatNumber(totalOutstanding)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={isBranchOpen}
                onClick={() => setIsBranchOpen((prev) => !prev)}
              >
                <Text
                  tag="h4"
                  field={fields?.branchDetailsLabel || { value: 'Branch details' }}
                  className="text-[16px] md:text-[20px] leading-6 md:leading-7 font-normal text-navy-500"
                />
                <span
                  className={`inline-flex text-lilac-500 transition-transform duration-300 ${
                    isBranchOpen ? 'rotate-180' : ''
                  }`}
                >
                  <ChevronDown width={20} height={20} />
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isBranchOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pt-4 md:pt-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-12 md:items-center">
                      {googleMapsApiKey && mapCenter ? (
                        branchMapLoadError ? (
                          <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-lilac-100 text-body-sm text-navy-400 md:h-64 md:min-h-[256px]">
                            Map unavailable
                          </div>
                        ) : !isBranchMapLoaded ? (
                          <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-lilac-100 text-body-sm text-navy-400 md:h-64 md:min-h-[256px]">
                            Loading map…
                          </div>
                        ) : (
                          <div className="h-48 w-full overflow-hidden rounded-lg border border-lilac-100 md:h-64 md:min-h-[256px]">
                            <GoogleMap
                              center={mapCenter}
                              zoom={15}
                              mapContainerStyle={{ width: '100%', height: '100%' }}
                              options={{
                                fullscreenControl: true,
                                streetViewControl: true,
                                mapTypeControl: true,
                                zoomControl: true,
                              }}
                            >
                              <Marker position={mapCenter} />
                            </GoogleMap>
                          </div>
                        )
                      ) : (
                        <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-lilac-100 text-body-sm text-navy-400 md:h-64 md:min-h-[256px]">
                          Map unavailable
                        </div>
                      )}
                      <div className="flex flex-col justify-center gap-2 md:gap-8">
                        <div className="flex gap-4 items-center">
                          <span className="shrink-0 flex items-center justify-center [&_svg]:size-8">
                            <CustomRichText field={fields?.branchLocationIcon} />
                          </span>
                          <p className="min-w-0 text-navy-500 whitespace-pre-line">
                            {officeAddress}
                          </p>
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="shrink-0 flex items-center justify-center [&_svg]:size-8">
                            <CustomRichText field={fields?.branchPhoneIcon} />
                          </span>
                          <Text
                            tag="p"
                            field={{
                              value: String(fields?.branchPhoneMessage?.value ?? '')
                                .replace(/\s+/g, ' ')
                                .trim(),
                            }}
                            className="min-w-0 m-0 text-navy-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-lilac-300 pt-5">
                <InfoMessage IconComponent={InfoIcon} status="normal">
                  <Text
                    tag="p"
                    field={fields?.outstandingInfoMessage}
                    className="text-[16px] leading-[24px]"
                  />
                </InfoMessage>
              </div>
            </div>
          </div>
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
            <Text
              tag="h3"
              field={fields?.selectPaymentCardLabel}
              className="text-heading-3 font-normal"
            />
            {!isLoadingCards && cards.length === 0 ? (
              <Text
                tag="p"
                field={fields?.noSavedCardDescription}
                className="text-body font-light"
              />
            ) : (
              <>
                <ul className="hidden flex-wrap gap-4 md:flex">
                  {cards.map((card: any, index: number) => (
                    <li key={card?.CardId ?? index}>
                      <PaymentCard
                        cardData={card}
                        isPrimary={card?.IsSelected}
                        cardHolderNameEnabled={true}
                        onClick={() => setSelectedCard(card)}
                        isCardSelected={selectedCard?.CardId === card?.CardId}
                      />
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col gap-4 md:hidden">
                  {cards.map((card: any, index: number) => (
                    <li key={card?.CardId ?? index} className="text-navy-500">
                      <PaymentCardListItem
                        card={card}
                        isBgPrimary={false}
                        isDisabled={
                          isExpired(card.ExpiryDate) ||
                          shouldShowError(
                            card.ExpiryDate,
                            LeaseEndDate ?? '',
                            ProposalEndDate ?? ''
                          )
                        }
                        value={card}
                        onChange={setSelectedCard}
                        checked={selectedCard?.CardId === card.CardId}
                        primaryCardErrorEnabled={shouldShowError(
                          card.ExpiryDate,
                          LeaseEndDate ?? '',
                          ProposalEndDate ?? ''
                        )}
                      />
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="form-group">
              <Text
                tag="label"
                field={fields?.cvvLabel}
                className="text-body font-normal block mb-2 text-navy-500"
              />
              <div className="relative flex items-center gap-2">
                <CVVInput
                  cardScheme={selectedCard?.Scheme}
                  disabled={!selectedCard}
                  value={cvv.value}
                  onChange={(val, isValid) => setCvv({ value: val, valid: isValid })}
                />
                <button
                  className="text-lilac-500 relative cursor-pointer"
                  onClick={(e) => e.preventDefault()}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <HelpIcon />
                  <div
                    className={`w-62.5 text-body-sm font-light py-1.5 px-3 absolute bottom-full left-1/2 -translate-x-1/2 transform -translate-y-1 rounded-sm text-navy-500 bg-white-pure z-100 ${
                      showTooltip
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                    } shadow-[0px_1px_8px_0px_rgba(0,0,0,0.1)] transition-default before:content-[''] before:w-3 before:h-3 before:bg-white-pure before:absolute before:end-1/2 before:bottom-0 before:translate-x-1/2 before:translate-y-[50%] before:rotate-45`}
                  >
                    {fields?.cvvHelpText?.value}
                  </div>
                </button>
              </div>
            </div>

            <Link href="/payment/manage-cards" className="btn btn-secondary md:max-w-68.75">
              <PlusIcon />
              {fields?.addNewCardText?.value}
            </Link>
            <InfoMessage IconComponent={InfoIcon} status="warning">
              <Text
                tag="p"
                field={fields?.addCardInfoMessage}
                className="text-[16px] leading-[24px]"
              />
            </InfoMessage>
            <div className="flex items-center gap-4 cursor-pointer">
              <Checkbox
                id="moveout-terms-and-conditions"
                name="moveout-terms-and-conditions"
                value="moveout-terms-and-conditions"
                checked={termsAccepted}
                onChange={setTermsAccepted}
              >
                <p className="text-[16px] leading-[24px] font-light">
                  {fields?.termsPrefixText?.value}{' '}
                  <Link
                    className="text-sky-700 underline"
                    href="/terms-and-conditions"
                    target="_blank"
                  >
                    {fields?.termsLinkText?.value}
                  </Link>
                  .
                </p>
              </Checkbox>
            </div>
          </div>
          <div className="btn-wrapper flex flex-col lg:flex-row justify-end gap-5 md:gap-6">
            <button
              type="button"
              className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 ${
                !canConfirmPay ? 'disabled' : ''
              }`}
              disabled={!canConfirmPay || isLoadingOutstanding || isLoadingCards}
              onClick={handleConfirmAndPay}
            >
              {fields?.confirmAndPayText?.value}
            </button>
          </div>
        </>
      )}
    </>
  );
}
