'use client';
import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

interface CancelSRSuccessModalProps {
  id: string | null;
}

export default function CancelSRSuccessModal({ id }: CancelSRSuccessModalProps) {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div className={`custom-modal ${activeModal === 'cancel-sr-success-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Cancellation submitted successfully</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/property-send.svg"
          alt="Logout Confirmation"
          width={294}
          height={210}
        />
        <p className="custom-modal__desc">Service Request ID: {id}</p>
        <p className="custom-modal__desc">
          Your cancellation request has been received. The status update might take a few minutes.
        </p>
        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-primary btn-sm" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
