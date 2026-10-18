'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  newCard?: boolean;
  onRetry?: () => void;
}

export default function PaymentFailedModal({ newCard = false, onRetry }: Props) {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div className={`custom-modal ${activeModal === 'payment-failed-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Payment failed</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/card-unauthorized.svg"
          alt="Payment failed"
          width={294}
          height={210}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <p className="custom-modal__desc">
          Please try again and if the problem persists, please contact our support team on{' '}
          <a href="tel:8009933">800 9933</a> for assistance.
        </p>
        {newCard ? (
          <div className="custom-modal__btn-wrapper">
            <Link href="/payment" className="btn btn-primary btn-sm" onClick={closeModal}>
              TRY AGAIN
            </Link>
          </div>
        ) : (
          <div className="custom-modal__btn-wrapper">
            <button className="btn btn-secondary btn-sm" onClick={closeModal}>
              TRY LATER
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                closeModal();
                onRetry?.();
              }}
            >
              TRY NOW
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
