import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import CircleInfoIcon from 'assets/icons/CircleInfoIcon';
import HelpIcon from 'assets/icons/HelpIcon';
import PlusIcon from 'assets/icons/Plus';
import { Checkbox } from 'components/common/Checkbox';
import InfoMessage from 'components/InfoMessage';
import CVVInput from 'components/payments/OutstandingPage/CVVInput';
import PaymentCard from 'components/payments/PaymentCard/PaymentCard';
import PaymentCardListItem from 'components/payments/PaymentCard/PaymentCardListItem';

import PaymentWithCardSkeleton from './PaymentWithCardSkeleton';
import { usePaymentWithCard } from './usePaymentWithCard';
import { formatNumber } from 'lib/utils/helper';

const PaymentWithCard = ({
  fields,
  cardsValidUntilDate,
  isLoading,
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
  isFuturePayment,
  handleAddNewCard,
  selectedInstallments,
  preservedInstallmentAdditionalAmount,
}: any) => {
  const {
    cards,
    isCardsLoading,
    isExpired,
    shouldShowError,
    leaseEndData,
    proposalEndData,
    showTooltip,
    setShowTooltip,
  } = usePaymentWithCard(setSelectedCard, cardsValidUntilDate);

  return (
    <div className="container-sm bg-white-pure border border-lilac-300 rounded-xl p-4 lg:p-8 flex flex-col gap-5 md:gap-6">
      <Text
        tag="h2"
        field={fields?.selectPaymentCardLabel}
        className="text-4 lg:text-heading-3 text-navy-500"
      />
      {isCardsLoading || isLoading ? (
        <PaymentWithCardSkeleton />
      ) : (
        <div className="flex flex-col gap-5 lg:gap-6">
          {cards?.length ? (
            <div className="flex flex-col gap-5 lg:gap-6">
              <ul className="hidden md:flex flex-wrap gap-4">
                {cards?.map((card: any, index: number) => (
                  <li key={index} className="outstanding-payments__card-list-item">
                    <PaymentCard
                      cardData={card}
                      isPrimary={card?.IsSelected}
                      cardHolderNameEnabled={true}
                      onClick={() => {
                        setSelectedCard(card);
                      }}
                      isCardSelected={selectedCard && selectedCard.CardId === card.CardId}
                    />
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-4 md:hidden">
                {cards?.map((card: any, index: any) => (
                  <li key={index} className="text-navy-500">
                    <PaymentCardListItem
                      card={card}
                      isBgPrimary={false}
                      isDisabled={
                        isExpired(card.ExpiryDate) ||
                        shouldShowError(card.ExpiryDate, leaseEndData, proposalEndData)
                      }
                      value={card}
                      onChange={setSelectedCard}
                      checked={selectedCard && selectedCard.CardId === card.CardId}
                      primaryCardErrorEnabled={shouldShowError(
                        card.ExpiryDate,
                        leaseEndData,
                        proposalEndData
                      )}
                    />
                  </li>
                ))}
              </ul>
              {!isFuturePayment ? (
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
              ) : null}
            </div>
          ) : (
            <div>
              <Text
                tag="p"
                field={fields?.noSavedCardDescription}
                className="text-body font-light"
              />
              <Image
                src={'/assets/svg/new-card-add.svg'}
                alt=""
                width={0}
                height={0}
                className="max-w-75 w-full block mx-auto"
              />
            </div>
          )}
          <div className="flex flex-col gap-5 lg:gap-6">
            <div className="flex flex-col md:flex-row gap-5 md:gap-8">
              <div
                className="btn btn-secondary md:max-w-68.75 h-11 lg:h-15"
                onClick={handleAddNewCard}
              >
                <PlusIcon />
                {fields?.addNewCardText?.value}
              </div>
            </div>
            <InfoMessage IconComponent={CircleInfoIcon} status="warning">
              <Text tag="p" field={fields?.addCardInfoMessage} className="text-body" />
            </InfoMessage>
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="flex items-center gap-4 cursor-pointer">
                <Checkbox
                  id="renewals-tnc"
                  name="renewals-tnc"
                  value="renewals-tnc"
                  checked={termsAccepted}
                  onChange={setTermsAccepted}
                >
                  <p className="text-body font-light">
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
              <div className="flex items-center gap-4 cursor-pointer">
                <Checkbox
                  id="renewals-payment-tnc"
                  name="renewals-payment-tnc"
                  value="renewals-payment-tnc"
                  checked={paymentMethodTermsAccepted}
                  onChange={setPaymentMethodTermsAccepted}
                >
                  <p className="text-body font-light">
                    {fields?.termsPrefixText?.value}{' '}
                    <Link
                      className="text-sky-700 underline"
                      href="/terms-and-conditions"
                      target="_blank"
                    >
                      {fields?.paymentTermsLinkText?.value}
                    </Link>
                    .
                  </p>
                </Checkbox>
              </div>
              {selectedInstallments === 12 ? (
                <div className="flex gap-4 cursor-pointer">
                  <Checkbox
                    id="renewals-12-months-additional-fee-acknowledgement"
                    name="renewals-12-months-additional-fee-acknowledgement"
                    value="renewals-12-months-additional-fee-acknowledgement"
                    checked={acknowledgmentOf12MonthFee}
                    onChange={setAcknowledgmentOf12MonthFee}
                  >
                    <p className="text-body font-light">
                      Selecting the 12 months instalments payment plan incurs an additional fee of
                      AED {formatNumber(preservedInstallmentAdditionalAmount)}, payable in twelve
                      (12) monthly instalments together with the rent, as shown in the Payment
                      Schedule below.​
                    </p>
                  </Checkbox>
                </div>
              ) : null}
              <div className="flex gap-4 cursor-pointer">
                <Checkbox
                  id="payment-acknowledgement"
                  name="payment-acknowledgement"
                  value="payment-acknowledgement"
                  checked={paymentAcknowledgment}
                  onChange={setPaymentAcknowledgement}
                >
                  <p className="text-body font-light">
                    {fields?.installmentPlanAcknowledgementText?.value}.
                  </p>
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentWithCard;
