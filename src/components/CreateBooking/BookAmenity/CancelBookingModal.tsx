import Image from 'next/image';
import React from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

const CancelBookingModal = ({ reservationId, setIsBookingCancelled }: any) => {
  const { tCode } = useUserStore();
  const { activeModal, closeModal, openModal } = useUIStore();

  // Fetch timeslots API
  const { mutate: cancelBookingRequest } = useApiMutation<any, any>(
    () => `/Amenities/${tCode}/Cancel?reservationId=${reservationId}`,
    'POST',
    true
  );

  const handleCancelBooking = () => {
    cancelBookingRequest(null, {
      onSuccess: (res) => {
        if (res.Code !== 400) {
          openModal('cancel-booking-success-modal');
          setIsBookingCancelled(true);
        } else {
          openModal('error-modal');
        }
      },
      onError: () => openModal('error-modal'),
    });
  };

  return (
    <div className={`custom-modal ${activeModal === 'cancel-booking-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">
          Are you sure you would like to cancel this booking?
        </h3>
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
        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-secondary lg:w-fit lg:px-16" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn btn-primary lg:w-fit lg:px-16" onClick={handleCancelBooking}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
