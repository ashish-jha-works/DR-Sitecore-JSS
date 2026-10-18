'use client';
import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

export default function LogoutModal() {
  const { activeModal, closeModal } = useUIStore();
  const logout = useUserStore((state) => state.logout);

  return (
    <div className={`custom-modal ${activeModal === 'logout-modal' && 'show'}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Are you sure you want to log out?</h3>
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
              logout();
            }}
          >
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
}
