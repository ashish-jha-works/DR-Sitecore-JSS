'use client';
import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

export default function ErrorModal() {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div className={`custom-modal ${activeModal === 'error-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Something went wrong!</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/error.svg"
          alt="Error"
          width={294}
          height={210}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <p className="custom-modal__desc">An error occurred while completing the request.</p>
        <p className="custom-modal__desc">
          Please try again, or contact us at{' '}
          <a href="mailto:customercare@dubairesidential.ae">customercare@dubairesidential.ae</a> if
          the problem persists.
        </p>
        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-primary btn-sm" onClick={closeModal}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
