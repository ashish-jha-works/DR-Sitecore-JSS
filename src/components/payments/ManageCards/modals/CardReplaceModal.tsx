import Image from 'next/image';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  isCardReplaced: boolean;
}

export const CardReplaceModal = ({ isCardReplaced }: Props) => {
  const { activeModal, closeModal } = useUIStore();

  return (
    <div className={`custom-modal ${activeModal === 'card-replaced-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">
          Primary card {isCardReplaced ? 'replaced' : 'selected'}
        </h3>
        <Image
          className="custom-modal__img"
          src="/assets/svg/card-add-success.svg"
          alt="Card Add Success"
          width={294}
          height={210}
        />
        <p className="custom-modal__desc">
          Your primary card has been {isCardReplaced ? 'replaced' : 'selected'} successfully.
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
