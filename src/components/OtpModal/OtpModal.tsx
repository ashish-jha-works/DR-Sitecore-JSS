import OtpInput from 'components/common/OTPInput';
import { OtpModalProps } from './OtpModal.types';
import { useEffect, useState } from 'react';

export default function OtpModal({
  isOpen,
  otpLength,
  heading,
  subHeading,
  infoText,
  resendLabel,
  cancelLabel,
  confirmLabel,
  error,
  onClose,
  onResend,
  onConfirm,
}: OtpModalProps) {
  const [currentOtp, setCurrentOtp] = useState('');
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setResetKey((prev) => prev + 1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`custom-modal ${isOpen ? 'show' : ''}`}>
      <div className="custom-modal__wrapper p-6 lg:p-8">
        <h3 className="custom-modal__heading mb-2 lg:mb-3">{heading}</h3>
        <p className="custom-modal__desc mb-5 lg:mb-6">{subHeading}</p>

        <div className="mt-6">
          <OtpInput
            length={otpLength}
            error={error}
            resetTrigger={resetKey}
            onChange={setCurrentOtp}
          />
        </div>

        {error && <p className="text-error text-body font-light mt-2">Error: Invalid OTP</p>}

        <p className="mt-5 lg:mt-6 text-center text-body text-navy-500 font-light">
          {infoText}{' '}
          <button
            type="button"
            onClick={onResend}
            className="cursor-pointer underline text-sky-700 uppercase font-medium"
          >
            {resendLabel}
          </button>
        </p>

        <div className="custom-modal__btn-wrapper mt-5 lg:mt-6 gap-3 lg:gap-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary w-full md:w-68.75 px-0 h-11 md:h-15"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={() => onConfirm(currentOtp)}
            disabled={currentOtp.length !== otpLength}
            className="btn btn-primary w-full md:w-68.75 px-0 h-11 md:h-15"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
