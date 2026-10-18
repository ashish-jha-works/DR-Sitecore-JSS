'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import ReCAPTCHA from 'react-google-recaptcha';
import { CustomImage } from 'src/common/SitecoreOverrides';
import RegistrationSuccessModal from '../Register/RegistrationSuccessModal';
import { useRouter } from 'next/router';
import { ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import RegistrationFailedModal from '../Register/RegistrationFailedModal';

interface VerifyUserProps {
  fields: {
    backgroundImage: ImageField;
  };
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function VerifyUser({ fields }: VerifyUserProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('tokenvalue');
  const tokenType = searchParams.get('type') || 'Email';
  const { openModal } = useUIStore();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // API mutation hook
  const { mutate: validateUserEmail } = useApiMutation<any, any>(
    (requestData) =>
      `/Token/Activate?token=${requestData.token}&registrationMode=${requestData.registrationMode}`,
    'POST',
    true
  );

  // Handle captcha change
  const handleCaptchaChange = async (captchaToken: string | null) => {
    if (!captchaToken || !token || !tokenType) return;

    validateUserEmail(
      {
        token,
        registrationMode: tokenType,
        captchaToken,
      },
      {
        onSuccess: (res) => {
          if (res.Code === 200 && res.Status.includes('Success')) {
            openModal('registration-success-modal');
          } else {
            recaptchaRef.current?.reset();
            openModal('registration-failed-modal');
          }
        },
        onError: () => {
          recaptchaRef.current?.reset();
          openModal('registration-failed-modal');
        },
      }
    );
  };

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  // Trigger loader and recaptcha on mount
  useEffect(() => {
    if (!token) return;
    window.dispatchEvent(new CustomEvent('toggle-global-loader', { detail: true }));
    recaptchaRef.current?.execute();
  }, [token]);

  // Early return if no token (prevents rendering)
  if (!token) return null;

  return (
    <div className="font-filson flex items-center min-h-screen px-4 py-14 md:px-8 md:py-6 relative z-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <CustomImage field={fields.backgroundImage} className="w-full h-full object-cover" />
      </div>
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={RECAPTCHA_SITE_KEY}
        onChange={handleCaptchaChange}
      />
      <RegistrationSuccessModal />
      <RegistrationFailedModal />
    </div>
  );
}
