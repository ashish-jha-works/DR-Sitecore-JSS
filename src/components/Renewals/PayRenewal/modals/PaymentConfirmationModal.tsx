import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

import CircleInfoIcon from 'assets/icons/CircleInfoIcon';
import { PAYMENT_METHOD_MAPPING } from 'components/DocumentsPage/constants';
import InfoMessage from 'components/InfoMessage';

interface Props {
  handleConfirmPayment: () => void;
  installmentsCount?: number;
  paymentMethod: number;
  isLeaseExpired?: boolean;
}

export const PaymentConfirmationModal = ({
  handleConfirmPayment,
  installmentsCount = 12,
  paymentMethod = 1,
  isLeaseExpired = false,
}: Props) => {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div
      className={`custom-modal PaymentConfirmationModal ${
        activeModal === 'renewals-payment-confirmation-modal' ? 'show' : ''
      }`}
    >
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Confirm Your Payment Schedule</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/confirm-action.svg"
          alt="Card Add Failure"
          width={294}
          height={210}
        />
        <div className="flex flex-col custom-modal__desc gap-6">
          <div>
            <p className="text-[12px] lg:text-body">
              <span className="font-medium">Instalments Plan:</span> {installmentsCount} payments
            </p>
            <p className="text-[12px] lg:text-body">
              <span className="font-medium">Payment Method:</span>{' '}
              {PAYMENT_METHOD_MAPPING[paymentMethod]}
            </p>
          </div>
          <p className="text-[12px] lg:text-body">
            You&apos;re about to confirm the payment schedule for your contract renewal. Once you
            proceed, your payment schedule will be confirmed and cannot be edited.
          </p>
        </div>
        {isLeaseExpired ? (
          <InfoMessage IconComponent={CircleInfoIcon} status="warning" className="mb-5">
            <p className="text-body text-left">
              As your lease has already expired, your first payment will be deducted immediately or
              at the time of submitting the payment.
            </p>
          </InfoMessage>
        ) : null}
        <div className="custom-modal__btn-wrapper">
          <button
            className="btn btn-secondary px-0 w-full lg:w-68.75 h-11 lg:h-15 uppercase"
            onClick={closeModal}
          >
            GO BACK AND REVIEW
          </button>
          <button
            className="btn btn-primary w-full lg:w-68.75 h-11 lg:h-15"
            onClick={() => {
              closeModal();
              handleConfirmPayment();
            }}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};
