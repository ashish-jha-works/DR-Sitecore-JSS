'use client';
import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

export default function DownloadErrorModal({ title }: { title?: string }) {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div
      className={`custom-modal ${activeModal === 'document-download-error-modal' ? 'show' : ''}`}
    >
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">
          {title
            ? title
            : 'We couldn’t retrieve this information due to a technical issue. Please try again later.'}
        </h3>
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
        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-primary btn-sm" onClick={closeModal}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
