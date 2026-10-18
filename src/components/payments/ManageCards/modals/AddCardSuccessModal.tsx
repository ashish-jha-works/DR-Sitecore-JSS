import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

export const AddCardSuccessModal = ({ handleCloseClick }: { handleCloseClick?: () => void }) => {
  const { activeModal, closeModal } = useUIStore();

  const handleClose = () => {
    handleCloseClick?.();
    closeModal();
  };

  return (
    <div className={`custom-modal ${activeModal === 'add-card-success-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Card added successfully</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/card-add-success.svg"
          alt="Card add success"
          width={294}
          height={210}
        />
        <p className="custom-modal__desc">Your new payment card has been added to your account.</p>
        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-primary lg:w-fit lg:px-16" onClick={handleClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
