'use client';
import { formatNumber } from 'lib/utils/helper';
import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from 'src/store/useUIStore';

export default function PaymentSuccessModal({ outstandingDetails, newCard = false }: any) {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div className={`custom-modal ${activeModal === 'payment-success-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Payment complete!</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/payment-success.svg"
          alt="success"
          width={294}
          height={210}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <p className="custom-modal__desc">Payment ref no: {outstandingDetails?.OrderReference}</p>
        <p className="custom-modal__desc">
          Amount paid: AED {formatNumber(outstandingDetails?.Amount)}
        </p>
        {newCard && (
          <p className="custom-modal__desc">
            Your receipt has been sent to your registered email and is also available in your
            payment history.
            <br />
            The payment card has also been stored in your account.
          </p>
        )}
        {!newCard && (
          <p className="custom-modal__desc">
            Your receipt has been sent to your registered email and is also available in your
            payment history.
          </p>
        )}
        <div className="custom-modal__btn-wrapper">
          <Link href={'/payment'} className="btn btn-primary btn-sm" onClick={closeModal}>
            CLOSE
          </Link>
        </div>
      </div>
    </div>
  );
}
