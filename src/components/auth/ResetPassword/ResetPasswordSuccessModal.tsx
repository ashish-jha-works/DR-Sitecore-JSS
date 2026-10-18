import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useUIStore } from 'src/store/useUIStore';

const ResetPasswordSuccessModal = () => {
  const { activeModal, closeModal } = useUIStore();

  const router = useRouter();
  return (
    <div className={`custom-modal ${activeModal === 'reset-password-success' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Password reset successfully</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/reset-password-success.svg"
          alt="Reset password success"
          width={294}
          height={210}
        />
        <p className="custom-modal__desc">
          You have successfully created a new password. Please log in.
        </p>
        <div className="custom-modal__btn-wrapper">
          <button
            className="btn btn-primary lg:w-fit lg:px-16"
            onClick={() => {
              closeModal();
              router.push('/login');
            }}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordSuccessModal;
