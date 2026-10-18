import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useUIStore } from 'src/store/useUIStore';

const RegistrationFailedModal = () => {
  const { activeModal, closeModal } = useUIStore();

  const router = useRouter();
  return (
    <div className={`custom-modal ${activeModal === 'registration-failed-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Activation token has expired</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/no-maintenance-request.svg"
          alt="Registration success"
          width={294}
          height={210}
        />
        <div className="custom-modal__btn-wrapper">
          <button
            className="btn btn-primary lg:w-fit lg:px-16"
            onClick={() => {
              closeModal();
              router.push('/login');
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFailedModal;
