import Image from 'next/image';

interface Props {
  showModal: boolean;
  setShowModal: (flag: boolean) => void;
  heading?: string;
  description?: string;
  imagePath?: string;
  modalType?: string;
  primaryBtnLabel?: string;
  secondaryBtnLabel?: string;
  handlePrimaryBtnClick?: () => void;
  handleSecondaryBtnClick?: () => void;
}

export const CustomModal = ({
  showModal,
  setShowModal,
  modalType = 'success',
  heading = 'Successful',
  description,
  imagePath,
  primaryBtnLabel = 'Submit',
  secondaryBtnLabel,
  handlePrimaryBtnClick,
  handleSecondaryBtnClick,
}: Props) => {
  if (!showModal) return null;

  return (
    <div
      className={`custom-modal ${modalType === 'success' ? 'SuccessModal' : 'ErrorModal'} ${
        showModal ? 'show' : ''
      }`}
    >
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">{heading}</h3>
        <Image
          className="custom-modal__img"
          src={`${
            imagePath
              ? imagePath
              : modalType === 'success'
              ? '/assets/svg/registration-successful.svg'
              : '/assets/svg/error.svg'
          }`}
          alt="Modal Image"
          width={294}
          height={210}
        />
        {description ? <p className="custom-modal__desc">{description}</p> : null}
        <div className="custom-modal__btn-wrapper">
          {secondaryBtnLabel ? (
            <button
              className="btn btn-secondary lg:w-fit px-16"
              onClick={() => {
                handleSecondaryBtnClick?.();
                setShowModal(false);
              }}
            >
              {secondaryBtnLabel}
            </button>
          ) : null}
          {primaryBtnLabel ? (
            <button
              className="btn btn-primary lg:w-fit px-16"
              onClick={() => {
                handlePrimaryBtnClick?.();
                setShowModal(false);
              }}
            >
              {primaryBtnLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
