import Image from 'next/image';
import { Card } from '../../PaymentsPage/payment.types';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  handleConfirmDelete: () => void;
  selectedDeleteCard: Card | undefined;
}

export const DeleteCardModal = ({ handleConfirmDelete, selectedDeleteCard }: Props) => {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div
      className={`custom-modal delete-card-modal ${
        activeModal === 'delete-card-modal' ? 'show' : ''
      }`}
    >
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">Confirm card removal</h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/confirm-action.svg"
          alt="Delete option"
          width={296}
          height={212}
        />
        <p className="custom-modal__desc">
          Are you sure that you want to delete your card ending in{' '}
          {selectedDeleteCard?.MaskedCardNumber?.slice(-4)}?
        </p>
        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-secondary" onClick={() => closeModal()}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirmDelete}>
            Remove Card
          </button>
        </div>
      </div>
    </div>
  );
};
