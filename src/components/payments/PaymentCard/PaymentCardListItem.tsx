import DeleteBinIcon from 'assets/icons/DeleteBinIcon';
import MastercardIcon from 'assets/icons/MastercardIcon';
import { getCardExpiry, isExpired } from 'lib/utils/helper';
import React from 'react';
import { Card } from '../PaymentsPage/payment.types';
import { PAYMENT_CARDS } from 'lib/common/constants/common';
import VisaIcon from 'assets/icons/VisaIcon';
import AmexIcon from 'assets/icons/AmexIcon';
import { Radio } from 'components/common/Radio';

interface PaymentCardListItemProps {
  card: Card;
  isDeleteEnable?: boolean;
  handleDeleteClick?: () => void;
  isDisabled?: boolean;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  primaryCardErrorEnabled?: boolean;
  isBgPrimary?: boolean;
}

const cardIcons = {
  [PAYMENT_CARDS.MASTERCARD]: <MastercardIcon className="w-9 h-6 lg:w-15 lg:h-10" />,
  [PAYMENT_CARDS.VISA]: <VisaIcon className="w-9 h-6 lg:w-15 lg:h-10" />,
  [PAYMENT_CARDS.AMEX]: <AmexIcon className="w-9 h-6 lg:w-15 lg:h-10" />,
};

const PaymentCardListItem = ({
  card,
  isDeleteEnable = false,
  isDisabled = false,
  handleDeleteClick,
  value,
  onChange,
  checked,
  isBgPrimary,
  primaryCardErrorEnabled = false,
}: PaymentCardListItemProps) => {
  const isPrimary = card?.IsSelected;

  return (
    <div
      className={`card-details-wrapper flex justify-between p-2 lg:px-5 lg:py-3 border-b ${
        isPrimary && isBgPrimary ? 'bg-navy-500 rounded-xl' : 'border-lilac-300'
      } ${isDisabled ? 'disable opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
    >
      <div className="left-section flex gap-3 lg:gap-6 items-center">
        <div className="form-group">
          <Radio
            name="card"
            id={card.CardId}
            value={value}
            onChange={() => onChange?.(value)}
            checked={checked}
            version="2"
            className={isPrimary && isBgPrimary ? 'dark' : ''}
          />
        </div>
        <div className="card-logo">
          {card?.Scheme ? (
            cardIcons[card.Scheme]
          ) : (
            <MastercardIcon className="w-9 h-6 lg:w-15 lg:h-10" />
          )}
        </div>
        <div
          className={`card-details ${
            isPrimary && isBgPrimary ? 'text-white-pure' : 'text-navy-500'
          }`}
        >
          <div>
            <p className="text-xs lg:text-body font-medium">
              {card?.MaskedCardNumber || 'XXXX********XXXX'}
            </p>
            <p className="text-body font-light">{card?.CardHolderName}</p>
            <p
              className={`text-body font-light ${
                isExpired(card?.ExpiryDate) ? 'text-danger-500' : ''
              }`}
            >
              {card?.ExpiryDate ? (isExpired(card?.ExpiryDate) ? 'Expired' : 'Expires') : 'Expires'}{' '}
              {card?.ExpiryDate ? getCardExpiry(card.ExpiryDate) : 'XX/XXXX'}
            </p>
            {primaryCardErrorEnabled ? (
              <p className="text-danger-500">
                You cannot select this as your primary card, as it expires before your tenancy ends.
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className={`btn-wrapper flex flex-col gap-4 items-end  ${
          isDeleteEnable ? 'justify-end' : ''
        }`}
      >
        {isPrimary ? (
          <span className={`text-body-sm ${isBgPrimary ? 'text-white-pure' : 'text-navy-500'}`}>
            PRIMARY
          </span>
        ) : null}
        {isDeleteEnable ? (
          <span onClick={handleDeleteClick}>
            <DeleteBinIcon className="text-lilac-500 cursor-pointer" />
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentCardListItem;
