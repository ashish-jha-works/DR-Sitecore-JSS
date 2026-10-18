import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  validDateLimit: string;
  errorModalHeading: string;
  errorModalDesc: string;
  handleCloseClick?: () => void;
}

export const LeaseExpiryErrorModal = ({
  validDateLimit,
  errorModalHeading,
  errorModalDesc,
  handleCloseClick,
}: Props) => {
  const { activeModal, closeModal } = useUIStore();

  const handleClose = () => {
    handleCloseClick?.();
    closeModal();
  };

  return (
    <div
      className={`custom-modal LeaseExpiryErrorModal ${
        activeModal === 'renewals-lease-expiry-error-modal' ? 'show' : ''
      }`}
    >
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">
          {errorModalHeading ? errorModalHeading : 'This card expires before your lease end date!'}
        </h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/card-not-allowed.svg"
          alt="Card Add Failure"
          width={294}
          height={210}
        />
        <p className="custom-modal__desc">
          {errorModalDesc
            ? errorModalDesc
            : `To pay by card, please add a card with validity until ${validDateLimit}.`}
        </p>
        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-primary w-full lg:w-68.75 h-11 lg:h-15" onClick={handleClose}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};
