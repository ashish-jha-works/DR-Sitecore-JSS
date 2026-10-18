'use client';
import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  onConfirm: () => void;
}

export default function CancelMoveOutModal({ onConfirm }: Props) {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div className={`custom-modal ${activeModal === 'cancel-moveout-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">
          Are you sure you want to cancel the move-out notice?
        </h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/confirm-action.svg"
          alt="Cancel Move-Out Confirmation"
          width={294}
          height={210}
        />
        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-secondary" onClick={closeModal}>
            NO
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              closeModal();
              onConfirm();
            }}
          >
            YES
          </button>
        </div>
      </div>
    </div>
  );
}
