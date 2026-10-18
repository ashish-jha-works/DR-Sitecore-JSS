'use client';
import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

export default function DeleteProfileModal() {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div className={`custom-modal ${activeModal === 'delete-profile-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Are you sure you want to delete your account?</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/delete.svg"
          alt="Bin"
          width={294}
          height={210}
        />
        <p className="custom-modal__desc">
          This action cannot be undone and will permanently delete your account and any services and
          sub-accounts linked within the account.
        </p>
        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-secondary" onClick={closeModal}>
            CANCEL
          </button>
          <button className="btn btn-primary">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
