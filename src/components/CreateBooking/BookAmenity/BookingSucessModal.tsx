import Image from 'next/image';
import React from 'react';
import { useUIStore } from 'src/store/useUIStore';

const BookingSuccessModal = () => {
  const { activeModal, closeModal } = useUIStore();
  return (
    <div className={`custom-modal ${activeModal === 'booking-success-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Booking successful</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/registration-successful.svg"
          alt="Success"
          width={294}
          height={210}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <p className="custom-modal__desc">
          Your booking is confirmed. A confirmation email has been sent to your inbox.
        </p>
        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-primary lg:w-fit lg:px-16" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
