export interface OtpModalProps {
  isOpen: boolean;
  otpLength: number;

  heading: string;
  subHeading: string;
  infoText: string;
  resendLabel: string;
  cancelLabel: string;
  confirmLabel: string;
  error?: boolean;

  onClose: () => void;
  onResend: () => void;
  onConfirm: (otp: string) => void;
}
