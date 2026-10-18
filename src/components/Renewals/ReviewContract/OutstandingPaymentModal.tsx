'use client';
import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  outstandingAmount: number;
  outstandingThresholdAmount: number;
  onPayLater?: () => void;
  onProceed?: () => void;
  onPayNow?: () => void;
}

export default function OutstandingPaymentModal({
  outstandingAmount,
  outstandingThresholdAmount,
  onPayLater,
  onProceed,
  onPayNow,
}: Props) {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div className={`custom-modal ${activeModal === 'outstanding-payment-modal' && 'show'}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Outstanding payment</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/clock.svg"
          alt="Outstanding Payment"
          width={294}
          height={210}
        />
        <p className="text-body font-light py-5 lg:py-6">
          Please clear your outstanding payment of a AED {outstandingAmount.toFixed(2)} to proceed
          with your contract renewal.
        </p>
        <div className="custom-modal__btn-wrapper">
          {outstandingAmount > outstandingThresholdAmount ? (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  closeModal();
                }}
              >
                CANCEL
              </button>
              <button
                className="btn btn-primary w-full h-11 md:h-15 uppercase"
                onClick={() => {
                  closeModal();
                  onPayNow?.();
                }}
              >
                Pay Now
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-secondary w-full h-11 md:h-15 uppercase"
                onClick={() => {
                  closeModal();
                  onPayLater?.();
                }}
              >
                Pay Later
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  closeModal();
                  onProceed?.();
                }}
              >
                Proceed
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
