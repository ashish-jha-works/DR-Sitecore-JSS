'use client';
import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  cancelServiceRequest: () => void;
}

export default function CancelSRModal({ cancelServiceRequest }: Props) {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div className={`custom-modal ${activeModal === 'cancel-sr-modal' && 'show'}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Are you sure you want to cancel?</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/confirm-action.svg"
          alt="Logout Confirmation"
          width={294}
          height={210}
        />
        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-secondary" onClick={closeModal}>
            CANCEL
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              closeModal();
              cancelServiceRequest();
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
