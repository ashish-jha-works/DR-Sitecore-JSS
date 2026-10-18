import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';

import AmexIcon from 'assets/icons/AmexIcon';
import ArrowLeft from 'assets/icons/ArrowLeft';
import HelpIcon from 'assets/icons/HelpIcon';
import InfoIcon from 'assets/icons/InfoIcon';
import MastercardIcon from 'assets/icons/MastercardIcon';
import PlusIcon from 'assets/icons/Plus';
import VisaIcon from 'assets/icons/VisaIcon';
import { Checkbox } from 'components/common/Checkbox';
import InfoMessage from 'components/InfoMessage';
import PaymentFailedModal from 'components/modals/PaymentFailedModal';
import PaymentSuccessModal from 'components/modals/PaymentSuccessModal';
import PaymentCard from 'components/payments/PaymentCard/PaymentCard';
import { PAYMENT_CARDS } from 'lib/common/constants/common';
import { isExpired } from 'lib/utils/helper';

import PaymentCardListItem from '../PaymentCard/PaymentCardListItem';
import CVVInput from './CVVInput';
import { useOutstandingPayment } from './useOutstandingPage';

export default function OutstandingPage(): JSX.Element {
  const cardIcons = {
    [PAYMENT_CARDS.MASTERCARD]: <MastercardIcon width={60} height={39} />,
    [PAYMENT_CARDS.VISA]: <VisaIcon width={60} height={39} />,
    [PAYMENT_CARDS.AMEX]: <AmexIcon width={60} height={39} />,
  };
  const {
    cards,
    isCardsLoading,
    leaseEndData,
    proposalEndData,
    outstandingDetails,
    selectedCard,
    showTooltip,
    cvv,
    newCard,
    step,
    termsAndConditions,

    setCvv,
    setShowTooltip,
    shouldShowError,
    setSelectedCard,
    setNewCard,
    setStep,
    setTermsAndConditions,

    handleBack,
    formatDate,
    formatNumber,
    getCardExpiry,
    requestAccessToken,
  } = useOutstandingPayment();

  return (
    <div className="OutstandingPage">
      <div className="bg-silver-chalice-50 py-10">
        <div className="container-sm">
          {step == 1 && (
            <div>
              <div className="p-4 md:p-8 rounded-lg border border-lilac-500 bg-white-pure">
                <h2 className="text-heading-3 font-normal md:mb-6 mb-5">Select payment card</h2>

                {cards.length == 0 && isCardsLoading ? (
                  <Image
                    src={'/assets/svg/primarycard.svg'}
                    alt=""
                    width={0}
                    height={0}
                    className="max-w-75 w-full block my-0 mx-auto"
                  />
                ) : cards.length == 0 && !isCardsLoading ? (
                  <p className="text-body font-light mb-5 md:mb-6">
                    You currently have no saved cards. Please add a new card to get started. Please
                    note that a primary card is necessary to ensure seamless processing of future
                    rent installments.
                  </p>
                ) : (
                  <div>
                    <ul className="hidden md:flex flex-wrap gap-4 mb-6">
                      {cards?.map((card: any, index: number) => (
                        <li key={index} className="outstanding-payments__card-list-item">
                          <PaymentCard
                            cardData={card}
                            isPrimary={card?.IsSelected}
                            cardHolderNameEnabled={true}
                            onClick={() => {
                              setSelectedCard(card);
                            }}
                            isCardSelected={selectedCard.CardId === card.CardId}
                          />
                        </li>
                      ))}
                    </ul>
                    <ul className="flex flex-col gap-4 mb-5 md:hidden">
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
                            checked={selectedCard.CardId === card.CardId}
                            primaryCardErrorEnabled={shouldShowError(
                              card.ExpiryDate,
                              leaseEndData,
                              proposalEndData
                            )}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="form-group">
                  <label className="text-body font-normal block mb-2 text-navy-500">CVV/CVC</label>
                  <div className="relative flex items-center gap-2">
                    <CVVInput
                      cardScheme={selectedCard?.Scheme}
                      disabled={!selectedCard}
                      value={cvv.value}
                      onChange={(val, isValid) => setCvv({ value: val, valid: isValid })}
                    />
                    <button
                      className="text-lilac-500 relative cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      onMouseEnter={() => {
                        setShowTooltip(true);
                      }}
                      onMouseLeave={() => {
                        setShowTooltip(false);
                      }}
                    >
                      <HelpIcon />
                      <div
                        className={`w-62.5 text-body-sm font-light py-1.5 px-3 absolute bottom-full left-1/2 -translate-x-1/2 transform -translate-y-1 rounded-sm text-navy-500 bg-white-pure z-100 ${
                          showTooltip
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'
                        } shadow-[0px_1px_8px_0px_rgba(0,0,0,0.1)] transition-default before:content-[''] before:w-3 before:h-3 before:bg-white-pure before:absolute before:end-1/2 before:bottom-0 before:translate-x-1/2 before:translate-y-[50%] before:rotate-45`}
                      >
                        3 or 4 digit number on the back of your debit/credit card.
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5 md:gap-8 mt-5 md:mt-6">
                  <button
                    className="btn btn-secondary md:max-w-68.75"
                    onClick={() => {
                      setStep(2);
                      setNewCard(true);
                    }}
                  >
                    <PlusIcon />
                    ADD A NEW CARD
                  </button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-5 md:gap-8 mt-5 md:mt-6">
                <Link href="/payment" className="btn btn-secondary md:max-w-68.75">
                  Back
                </Link>
                <button
                  className={`btn btn-primary md:max-w-68.75 ${
                    !cvv.valid || !selectedCard.CardId ? 'disabled' : ''
                  }`}
                  onClick={() => setStep(2)}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
          {step == 2 && (
            <div className="mt-10 p-4 md:p-8 rounded-lg border border-lilac-500 bg-white-pure">
              <h2 className="text-heading-3 font-normal md:mb-6 mb-5">Review</h2>

              <div className="">
                <button
                  className="flex items-center gap-2 text-navy-500 hover:text-navy-700 mx-auto md:me-0 cursor-pointer"
                  onClick={handleBack}
                >
                  <ArrowLeft width={20} height={20} />
                  Back
                </button>
              </div>

              {!newCard && selectedCard?.CardId && (
                <div className="flex items-center gap-6 md:gap-4 mt-4 md:mt-5 p-2 md:p-4 rounded-xl bg-[linear-gradient(0deg,var(--color-silver-chalice-100)_26.67%,var(--color-silver-chalice-300)_74.17%)]">
                  {selectedCard?.Scheme && <>{cardIcons[selectedCard.Scheme]}</>}

                  <div className="grow">
                    <div>
                      <h4 className="text-body-sm font-medium">{selectedCard.MaskedCardNumber}</h4>
                      <p className="text-body-sm font-light mt-1 uppercase">
                        {selectedCard.CardHolderName}
                      </p>
                      <p className="text-body-sm font-light mt-1 uppercase">
                        Expires {getCardExpiry(selectedCard.ExpiryDate)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <ul className="mt-6">
                {outstandingDetails?.TransactionItems?.map((item: any, index: number) => (
                  <li key={index} className="py-3 border-b border-solid border-lilac-100">
                    <div className="flex justify-between gap-6">
                      <div className="shrink">
                        <p className="text-body font-light text-navy-500">{item.Name}</p>
                        <p className="text-body font-light text-navy-400">
                          {formatDate(item.DueDate)}
                        </p>
                      </div>
                      <div className="shrink">
                        <p className="text-body font-light text-navy-500">
                          AED {formatNumber(item.Value)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
                <li className="py-3 border-b border-solid border-lilac-100">
                  <div className="flex justify-between gap-6">
                    <div className="shrink">
                      <p className="text-body font-bold text-navy-500">Total</p>
                    </div>
                    <div className="shrink">
                      <p className="text-body font-bold text-navy-500">
                        AED {formatNumber(outstandingDetails?.Amount)}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>

              <div className="my-6 flex items-center gap-4 cursor-pointer">
                <Checkbox
                  id="terms-and-conditions"
                  name="terms-and-conditions"
                  value="terms-and-conditions"
                  checked={termsAndConditions}
                  onChange={setTermsAndConditions}
                >
                  <p className="text-body-sm font-light">
                    I have read and agreed to the{' '}
                    <Link
                      className="text-sky-700 underline"
                      href="/terms-and-conditions"
                      target="_blank"
                    >
                      Terms and Conditions
                    </Link>
                    .
                  </p>
                </Checkbox>
              </div>

              <p className="text-body-sm font-light">
                By proceeding with the payment, you acknowledge and accept the associated charges.
              </p>
              {newCard && (
                <InfoMessage IconComponent={InfoIcon} status="warning" className="mt-6">
                  <p className="text-body">
                    Clicking &apos;proceed&apos; will take you to the payment gateway, where you
                    will add a payment card. Once you enter your card details, a payment will be
                    taken.
                  </p>
                </InfoMessage>
              )}
              <div className="mt-6 md:text-end">
                {newCard ? (
                  <a
                    href={outstandingDetails.PaymentsUrl}
                    className={`btn btn-primary md:max-w-68.75 ${
                      !termsAndConditions ? 'disabled' : ''
                    }`}
                  >
                    PROCEED
                  </a>
                ) : (
                  <button
                    className={`btn btn-primary md:max-w-68.75 ${
                      !termsAndConditions ? 'disabled' : ''
                    }`}
                    onClick={() => requestAccessToken(2)}
                  >
                    Confirm and Pay
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <PaymentSuccessModal outstandingDetails={outstandingDetails} newCard={newCard} />
      <PaymentFailedModal newCard={newCard} onRetry={() => requestAccessToken(2)} />
    </div>
  );
}
