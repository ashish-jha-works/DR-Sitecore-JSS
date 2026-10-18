import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  handleRetryPayment: () => void;
}

export const RenewalsPaymentFailedModal = ({ handleRetryPayment }: Props) => {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div
      className={`custom-modal RenewalsPaymentFailedModal ${
        activeModal === 'renewals-payment-failed-modal' ? 'show' : ''
      }`}
    >
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Payment Failed</h3>
        <Image
          className="custom-modal__img mb-0"
          src="/assets/svg/card-unauthorized.svg"
          alt="Card Add Failure"
          width={294}
          height={210}
        />
        <div className="flex flex-col custom-modal__desc gap-6">
          <p className="text-[12px] lg:text-body">
            Please try again and if the problem persists, please contact our support team on 800
            9933 for assistance.
          </p>
        </div>
        <div className="custom-modal__btn-wrapper">
          <button
            className="btn btn-secondary px-0 w-full lg:w-68.75 h-11 lg:h-15 uppercase"
            onClick={closeModal}
          >
            TRY LATER
          </button>
          <button
            className="btn btn-primary w-full lg:w-68.75 h-11 lg:h-15"
            onClick={handleRetryPayment}
          >
            TRY NOW
          </button>
        </div>
      </div>
    </div>
  );
};
