import { Field, ImageField, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import OtpInput from 'components/common/OTPInput';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CustomImage } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';
import RegistrationSuccessModal from '../Register/RegistrationSuccessModal';

interface VerifyOTPFields {
  fields: {
    backgroundImage: ImageField;
    heading: Field<string>;
    subHeading: Field<string>;
    submitCTALabel: Field<string>;
    resendCTALabel: Field<string>;
  };
}

const VerifyOTP = ({ fields }: VerifyOTPFields) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { unauthenticatedUserEmailorPhone } = useUserStore();
  const setUnauthenticatedUser = useUserStore((state) => state.setUnauthenticatedUser);
  const openModal = useUIStore((state) => state.openModal);

  const [currentOtp, setCurrentOtp] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [mobileOTPError, setMobileOTPError] = useState<string | null>(null);

  const otpLength = 4;

  // ---------------- Derived Values ----------------

  const redirectMode = searchParams.get('mode');

  const redirectUrl = useMemo(() => {
    const redirectMap: Record<string, string> = {
      'forgot-password': '/forgot-password',
      register: '/register',
    };

    return redirectMap[redirectMode ?? ''] ?? '/login';
  }, [redirectMode]);

  const resendUrl = useMemo(() => {
    if (!unauthenticatedUserEmailorPhone) return null;

    return `Token/Resend?userName=${unauthenticatedUserEmailorPhone.replaceAll(
      ' ',
      ''
    )}&registrationMode=Phone&tokenType=3`;
  }, [unauthenticatedUserEmailorPhone]);

  // ---------------- API ----------------

  const { mutate: resendOTPRequest } = useApiMutation(resendUrl ?? '', 'PUT', true);

  const { mutate: verifyOTP } = useApiMutation('Token', 'POST', true);

  // ---------------- Helpers ----------------

  const resetOtpState = useCallback(() => {
    setResetKey((prev) => prev + 1);
    setCurrentOtp('');
  }, []);

  // ---------------- Handlers ----------------

  const handleResendOTP = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (!resendUrl) return;

      resendOTPRequest(null, {
        onError: () => {
          openModal('error-modal');
        },
      });
    },
    [resendUrl, resendOTPRequest]
  );

  const handleVerifyOTP = useCallback(() => {
    if (!currentOtp || currentOtp.length !== otpLength) return;

    const requestData = {
      Token: currentOtp,
      RegistrationMode: 'Phone',
      UserName: unauthenticatedUserEmailorPhone,
      Type: '3',
      IsValid: true,
    };

    verifyOTP(requestData, {
      onSuccess: (response: any) => {
        if (response?.Code === 200 && response?.Status === 'Success' && response?.TCode) {
          setUnauthenticatedUser(unauthenticatedUserEmailorPhone as string, response.TCode);

          setMobileOTPError(null);

          if (redirectMode === 'forgot-password') {
            router.push(`/reset-password?userId=${unauthenticatedUserEmailorPhone}&mode=phone`);
          } else {
            openModal('registration-success-modal');
          }

          return;
        }
        resetOtpState();

        setMobileOTPError(response?.Status ? response.Status : 'Error: Invalid OTP');
      },
      onError: () => openModal('error-modal'),
    });
  }, [
    currentOtp,
    otpLength,
    unauthenticatedUserEmailorPhone,
    verifyOTP,
    redirectMode,
    router,
    openModal,
    setUnauthenticatedUser,
    resetOtpState,
  ]);

  useEffect(() => {
    if (!unauthenticatedUserEmailorPhone) {
      router.replace(redirectUrl);
    }
  }, [unauthenticatedUserEmailorPhone, redirectUrl, router]);

  if (!unauthenticatedUserEmailorPhone) return null;

  return (
    <div className="font-filson flex items-center min-h-screen px-4 py-14 md:px-8 md:py-6 relative z-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <CustomImage field={fields?.backgroundImage} className="w-full h-full object-cover" />
      </div>
      <div className="max-w-120 w-full mx-auto p-4 md:p-8 rounded-2xl bg-white-pure/90 backdrop-blur-sm text-center">
        <Text
          tag="h2"
          field={fields?.heading}
          className="text-heading-2 text-center text-navy-500 mb-2 md:mb-3"
        />
        <p className="text-body text-navy-500">
          <Text field={fields?.subHeading} />
        </p>
        <div className="mt-5 md:mt-6">
          <OtpInput
            length={otpLength}
            error={Boolean(mobileOTPError)}
            resetTrigger={resetKey}
            onChange={setCurrentOtp}
          />
          {mobileOTPError && (
            <p className="text-error text-body font-light mt-5 lg:mt-6">{mobileOTPError}</p>
          )}
        </div>
        <div className="btn-wrapper flex flex-col justify-center items-center mt-5 md:mt-6 gap-2 md:gap-3">
          <button
            type="button"
            disabled={currentOtp.length !== otpLength}
            className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
            onClick={handleVerifyOTP}
          >
            {fields?.submitCTALabel?.value}
          </button>
          {fields?.resendCTALabel?.value ? (
            <span className="text-sm text-navy-500">
              Did not receive OTP?{' '}
              <Link href="#">
                <span
                  className="cursor-pointer underline text-sky-700 font-medium"
                  onClick={handleResendOTP}
                >
                  {fields?.resendCTALabel?.value}
                </span>
              </Link>
            </span>
          ) : null}
        </div>
      </div>
      <RegistrationSuccessModal />
    </div>
  );
};

export default VerifyOTP;
