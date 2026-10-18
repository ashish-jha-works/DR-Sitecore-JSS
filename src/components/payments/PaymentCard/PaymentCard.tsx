import AmexIcon from 'assets/icons/AmexIcon';
import MastercardIcon from 'assets/icons/MastercardIcon';
import VisaIcon from 'assets/icons/VisaIcon';
import { PAYMENT_CARDS } from 'lib/common/constants/common';
import { getCardExpiry, isExpired } from 'lib/utils/helper';
import Image from 'next/image';
import React from 'react';

const PaymentCard = ({
  cardData,
  isPrimary = false,
  cardHolderNameEnabled = false,
  onClick,
  isCardSelected,
}: {
  cardData: any;
  isPrimary?: boolean;
  cardHolderNameEnabled?: boolean;
  onClick: any;
  isCardSelected?: boolean;
}) => {
  const cardIcons = {
    [PAYMENT_CARDS.MASTERCARD]: <MastercardIcon />,
    [PAYMENT_CARDS.VISA]: <VisaIcon />,
    [PAYMENT_CARDS.AMEX]: <AmexIcon />,
  };

  return (
    <div
      className={`card primary overflow-hidden flex flex-col w-50 h-32.5 p-3 rounded-md cursor-pointer z-1 ${
        isCardSelected ? 'outline-4 outline-lilac-400 -outline-offset-4' : ''
      } border border-lilac-400 ${
        isPrimary
          ? 'bg-[linear-gradient(342.35deg,#1a2039_28.01%,#426895_99.83%)] text-white-pure justify-between'
          : 'bg-[linear-gradient(330deg,#E1E0E3_20.55%,#FAF9FB_98.25%)] justify-end'
      } relative`}
      onClick={onClick}
    >
      <Image
        className="card__shine absolute top-0 right-0 w-[80%] h-full object-cover object-bottom-right -z-1"
        src={isPrimary ? '/assets/svg/primary-card-shine.svg' : '/assets/svg/card-shine.svg'}
        width={100}
        height={100}
        alt=""
      />
      {isPrimary ? (
        <h5 className="uppercase text-4 lg:text-heading-3 font-light tracking-[8.75px]">Primary</h5>
      ) : null}
      <div className="card-details-wrapper flex justify-between items-end">
        <span className="text-body-xs flex flex-col gap-1 lg:gap-2">
          {cardHolderNameEnabled && <p>{cardData?.CardHolderName}</p>}
          <p>{cardData?.MaskedCardNumber || 'XXXX********XXXX'}</p>
          <p className="uppercase">
            {cardData?.ExpiryDate
              ? isExpired(cardData?.ExpiryDate)
                ? 'Expired'
                : 'Expires'
              : 'Expires'}{' '}
            {cardData?.ExpiryDate ? getCardExpiry(cardData.ExpiryDate) : 'XX/XXXX'}
          </p>
        </span>
        <span>{cardData?.Scheme ? cardIcons[cardData.Scheme] : <MastercardIcon />}</span>
      </div>
    </div>
  );
};

export default PaymentCard;
