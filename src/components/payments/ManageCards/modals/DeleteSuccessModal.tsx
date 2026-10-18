import Image from 'next/image';
import { Card } from '../../PaymentsPage/payment.types';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  selectedDeleteCard: Card | undefined;
}

export const DeleteSuccessModal = ({ selectedDeleteCard }: Props) => {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div
      className={`custom-modal DeleteCardSuccessModal ${
        activeModal === 'delete-card-success-modal' ? 'show' : ''
      }`}
    >
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Card removed successfully</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/card-removed.svg"
          alt="Delete Card success"
          width={294}
          height={210}
        />
        <p className="custom-modal__desc">
          You have removed your card ending in {selectedDeleteCard?.MaskedCardNumber?.slice(-4)}
        </p>
        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-primary lg:w-fit" onClick={() => closeModal()}>
            Return to MANAGE CARDS
          </button>
        </div>
      </div>
    </div>
  );
};
