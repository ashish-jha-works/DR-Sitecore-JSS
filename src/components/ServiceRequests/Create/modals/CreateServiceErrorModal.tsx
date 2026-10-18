import Image from 'next/image';
import React from 'react';
import { useUIStore } from 'src/store/useUIStore';

const CreateServiceErrorModal = ({
  serviceRequestId,
  isTypeReschedule,
}: {
  serviceRequestId?: string | null;
  isTypeReschedule?: true;
}) => {
  const { activeModal, closeModal } = useUIStore();
  return (
    <div className={`custom-modal ${activeModal === 'create-service-error-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">
          {isTypeReschedule ? `Reschedule request unsuccessful` : 'We couldn’t book your request'}
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
        <p className="custom-modal__desc">
          {!isTypeReschedule ? (
            <>
              An error occurred while booking your request. Please try again, or contact us at{' '}
              <a href="mailto:customercare@dubairesidential.ae">customercare@dubairesidential.ae</a>{' '}
              if the error persists.
            </>
          ) : (
            <>
              Your service request {serviceRequestId} could not be rescheduled due to some technical
              issue.
              <br />
              Please try again, or contact us at{' '}
              <a href="mailto:customercare@dubairesidential.ae">
                customercare@dubairesidential.ae
              </a>{' '}
              if the problem persists.
            </>
          )}
        </p>

        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-primary lg:w-fit lg:px-16" onClick={closeModal}>
            {isTypeReschedule ? 'Close' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateServiceErrorModal;
