import { Field, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';

import CircleCrossIcon from 'assets/icons/CircleCrossIcon';
import CircleInfoIcon from 'assets/icons/CircleInfoIcon';
import InfoIcon from 'assets/icons/InfoIcon';
import PlusIcon from 'assets/icons/Plus';
import { isExpired } from 'lib/utils/helper';

import PaymentCardListItem from '../PaymentCard/PaymentCardListItem';
import ManageCardsSkeleton from './ManageCardsSkeleton';
import {
  AddCardFailureModal,
  AddCardSuccessModal,
  CardReplaceModal,
  DeleteCardModal,
  DeleteSuccessModal,
} from './modals';
import { useManageCards } from './useManageCards';

interface ManageCardsFields {
  fields: {
    heading: Field<string>;
    description: Field<string>;
    noSavedCardDescription: Field<string>;
    infoMessage: Field<string>;
    primaryCardDeleteMessage: Field<string>;
  };
}

export default function ManageCards({ fields }: ManageCardsFields): JSX.Element {
  const {
    cardsLoaded,
    cards,
    primaryCard,
    leaseEndData,
    proposalEndData,
    selectedCard,
    selectedDeleteCard,
    showPrimaryCardDeleteWarning,
    isCardReplaced,
    isLoadingCards,

    setSelectedCard,

    shouldShowError,
    handleDeleteCard,
    handleConfirmDelete,
    handleAddNewCard,
    handleSaveChanges,
  } = useManageCards();

  return (
    <div className="manage-cards">
      <div className="money-cards-block">
        <div className="container-sm mb-8 lg:mb-10">
          <div className="rounded-lg border border-lilac-300 bg-white-pure shadow-sm my-8 lg:my-10 lg:mx-auto p-4 lg:p-8">
            <Text
              tag="h2"
              field={fields?.heading}
              className="text-4 lg:text-heading-3 text-navy-500 mb-2 lg:mb-3"
            />

            {cards?.length ? (
              <Text tag="p" field={fields?.description} className="text-body font-light" />
            ) : (
              <Text
                tag="p"
                field={fields?.noSavedCardDescription}
                className="text-body font-light"
              />
            )}

            {cardsLoaded && cards?.length == 0 ? (
              <Image
                src={'/assets/svg/new-card-add.svg'}
                alt=""
                width={296}
                height={212}
                className="max-w-75 w-full block mx-auto"
              />
            ) : (
              <div className="info-message-warning my-5 lg:my-6">
                <CircleInfoIcon />
                <Text field={fields?.infoMessage}></Text>
              </div>
            )}

            {/* {showPrimaryCardDeleteWarning && (
                            <p className="info-message-error my-5 lg:my-6">
                                <CircleCrossIcon className="w-full lg:!w-11" />
                                Primary card could not be removed.
                            </p>
                        )} */}

            {isLoadingCards ? (
              <ManageCardsSkeleton />
            ) : (
              <div>
                {cards?.length ? (
                  <>
                    <ul className="flex flex-col gap-4 md:gap-5 mt-5 md:mt-6 ">
                      {showPrimaryCardDeleteWarning && (
                        <li className="manage-cards-list-item">
                          <p className="info-message-error">
                            <CircleCrossIcon className="w-full lg:w-11!" />
                            Primary card could not be removed. You must select a new primary card to
                            delete this one.
                          </p>
                        </li>
                      )}
                      {cards.map((card: any) => (
                        <li
                          key={card.CardId}
                          className={`manage-cards-list-item ${card?.IsSelected ? '-order-1' : ''}`}
                        >
                          <PaymentCardListItem
                            card={card}
                            isDeleteEnable
                            isBgPrimary={true}
                            isDisabled={
                              isExpired(card.ExpiryDate) ||
                              shouldShowError(card.ExpiryDate, leaseEndData, proposalEndData)
                            }
                            value={card}
                            onChange={setSelectedCard}
                            checked={selectedCard?.CardId === card.CardId}
                            primaryCardErrorEnabled={shouldShowError(
                              card.ExpiryDate,
                              leaseEndData,
                              proposalEndData
                            )}
                            handleDeleteClick={() => handleDeleteCard(card)}
                          />
                        </li>
                      ))}
                    </ul>
                    <button
                      className="flex gap-2 items-center mt-7.5 lg:mt-8 text-body-sm uppercase cursor-pointer"
                      onClick={handleAddNewCard}
                    >
                      <PlusIcon />
                      ADD A NEW CARD
                    </button>
                  </>
                ) : (
                  <div>
                    <button
                      className="btn btn-secondary lg:w-fit lg:px-12.5 flex gap-2 items-center mt-7.5 lg:mt-8 text-body-sm uppercase cursor-pointer"
                      onClick={handleAddNewCard}
                    >
                      <PlusIcon /> ADD A NEW CARD
                    </button>
                    <p className="info-message-warning mt-5 lg:mt-6">
                      <CircleInfoIcon className="w-full lg:!w-11" />
                      Your selected primary card will be set as the default payment option for both
                      existing rent payments (if any) as well as future payments.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="info-message-normal my-5 lg:my-6">
            <InfoIcon className="w-full lg:!w-11" />
            Adding a new card will redirect you to the payment gateway page. A refundable amount of
            AED 1.00 will be deducted when you add a new card.
          </p>
          <div className="container-sm btn-wrapper px-0 mt-5 lg:mt-6 flex flex-col lg:flex-row justify-end gap-5 lg:gap-6">
            <Link
              href="/payment"
              className={`btn btn-secondary w-full lg:max-w-68.75 h-11 lg:h-15`}
            >
              Back
            </Link>
            <a
              className={`btn btn-primary w-full lg:max-w-68.75 h-11 lg:h-15 ${
                !selectedCard?.CardId || selectedCard?.CardId === primaryCard?.CardId
                  ? 'disabled'
                  : ''
              }`}
              onClick={handleSaveChanges}
            >
              Save Changes
            </a>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteCardModal
        handleConfirmDelete={handleConfirmDelete}
        selectedDeleteCard={selectedDeleteCard}
      />

      <DeleteSuccessModal selectedDeleteCard={selectedDeleteCard} />

      <AddCardSuccessModal />

      <AddCardFailureModal handleRetryAddCard={handleAddNewCard} />

      <CardReplaceModal isCardReplaced={isCardReplaced} />
    </div>
  );
}
