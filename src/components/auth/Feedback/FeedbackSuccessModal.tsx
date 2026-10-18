import Image from 'next/image';
import React from 'react';
import { useUIStore } from 'src/store/useUIStore';

const FeedbackSuccessModal = () => {
  const { activeModal, closeModal } = useUIStore();
  return (
    <div className={`custom-modal ${activeModal === 'feedback-success-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Thank you for your enquiry</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/property-send.svg"
          alt="Feedback success"
          width={294}
          height={210}
        />
        <p className="custom-modal__desc">Thank you for your feedback. We will contact you soon.</p>
        <div className="custom-modal__btn-wrapper">
          <button
            className="btn btn-primary lg:w-fit lg:px-16"
            onClick={() => {
              closeModal();
              window.location.reload();
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSuccessModal;
