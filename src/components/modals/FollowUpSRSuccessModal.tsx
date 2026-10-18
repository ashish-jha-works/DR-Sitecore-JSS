'use client';
import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

export default function FollowUpSRSuccessModal() {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div className={`custom-modal ${activeModal === 'followUp-sr-success-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Follow-up request submitted</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/property-send.svg"
          alt="Logout Confirmation"
          width={294}
          height={210}
        />
        <p className="custom-modal__desc">
          Your follow-up has been submitted and will be reviewed shortly.
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
