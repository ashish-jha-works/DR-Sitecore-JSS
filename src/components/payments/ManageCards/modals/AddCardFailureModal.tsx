import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  handleRetryAddCard: () => void;
  secondaryCTAText?: string;
  handleCloseClick?: () => void;
}

export const AddCardFailureModal = ({
  handleRetryAddCard,
  secondaryCTAText = 'TRY LATER',
  handleCloseClick,
}: Props) => {
  const { activeModal, closeModal } = useUIStore();

  const handleClose = () => {
    handleCloseClick?.();
    closeModal();
  };

  return (
    <div className={`custom-modal ${activeModal === 'add-card-failure-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Card not authorised</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/card-unauthorized.svg"
          alt="Card Add Failure"
          width={294}
          height={210}
        />
        <p className="custom-modal__desc">
          Please try again and if the problem persists, please contact our support team on{' '}
          <a href="tel:8009933">800 9933</a> for assistance.
        </p>
        <div className="custom-modal__btn-wrapper">
          <button
            className="btn btn-secondary px-0 w-full lg:w-68.75 h-11 lg:h-15"
            onClick={handleClose}
          >
            {secondaryCTAText}
          </button>
          <button
            className="btn btn-primary w-full lg:w-68.75 h-11 lg:h-15"
            onClick={handleRetryAddCard}
          >
            TRY NOW
          </button>
        </div>
      </div>
    </div>
  );
};
