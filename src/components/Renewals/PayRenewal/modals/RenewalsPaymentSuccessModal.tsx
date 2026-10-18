import Image from 'next/image';

import { formatAmount } from 'lib/utils/helper';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  paymentRefNo?: number;
  amount?: number;
  isScheduled?: boolean;
  handlePaymentSuccessContinueClick: () => void;
}

export const RenewalsPaymentSuccessModal = ({
  paymentRefNo,
  amount = 0,
  isScheduled = false,
  handlePaymentSuccessContinueClick,
}: Props) => {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div
      className={`custom-modal RenewalsPaymentSuccessModal ${
        activeModal === 'renewals-payment-success-modal' && 'show'
      }`}
    >
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">
          {isScheduled ? 'Payments scheduled' : 'Payment Successful!'}
        </h3>
        <Image
          className="custom-modal__img mb-0"
          src="/assets/svg/payment-success.svg"
          alt="Card Add Failure"
          width={294}
          height={210}
        />
        <div className="flex flex-col custom-modal__desc gap-6">
          {!isScheduled ? (
            <div>
              <p className="text-[12px] lg:text-body">
                <span className="font-medium">Payment ref no:</span> {paymentRefNo}
              </p>
              <p className="text-[12px] lg:text-body">
                <span className="font-medium">Amount paid:</span>
                AED {formatAmount(amount)}
              </p>
            </div>
          ) : null}
          <p className="text-[12px] lg:text-body">
            {isScheduled
              ? 'Your payment method has been successfully updated. Payments will be automatically deducted according to your agreed schedule.'
              : 'Your receipt has been sent to your registered email ID.'}
          </p>
        </div>
        <div className="custom-modal__btn-wrapper">
          <button
            className="btn btn-primary w-full lg:w-68.75 h-11 lg:h-15 uppercase"
            onClick={() => {
              closeModal();
              handlePaymentSuccessContinueClick();
            }}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};
