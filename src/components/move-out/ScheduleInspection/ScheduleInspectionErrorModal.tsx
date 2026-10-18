import Image from 'next/image';
import React from 'react';
import { useUIStore } from 'src/store/useUIStore';

const ScheduleInspectionErrorModal = ({
  title,
  description,
}: {
  title?: string | null;
  description?: string;
}) => {
  const { activeModal, closeModal } = useUIStore();
  return (
    <div
      className={`custom-modal ${
        activeModal === 'move-out-schedule-inspection-error-modal' ||
        activeModal === 'move-out-reschedule-inspection-error-modal'
          ? 'show'
          : ''
      }`}
    >
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">{title}</h3>

        <Image
          className="custom-modal__img"
          src="/assets/svg/confirm-action.svg"
          alt="Error"
          width={294}
          height={210}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <p className="custom-modal__desc">
          {activeModal === 'move-out-reschedule-inspection-error-modal'
            ? description?.replace('schedule', 'reschedule')
            : description}
        </p>

        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-primary lg:w-fit lg:px-16" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInspectionErrorModal;
