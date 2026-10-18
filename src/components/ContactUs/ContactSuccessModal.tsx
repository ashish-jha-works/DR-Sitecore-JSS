import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUIStore } from 'src/store/useUIStore';

export default function ContactSuccessModal() {
  const router = useRouter();
  const { activeModal, closeModal } = useUIStore();

  const handleReturnHome = () => {
    closeModal();
    router.push('/dashboard');
  };

  return (
    <div className={`custom-modal ${activeModal === 'contact-success-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">We have successfully received your request</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/registration-successful.svg"
          alt="Success"
          width={294}
          height={210}
        />
        <p className="custom-modal__desc">Our customer representative will get back to you soon.</p>
        <div className="custom-modal__btn-wrapper">
          <button
            type="button"
            className="btn btn-primary lg:w-fit uppercase"
            onClick={handleReturnHome}
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
