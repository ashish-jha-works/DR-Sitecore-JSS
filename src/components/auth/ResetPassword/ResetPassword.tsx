'use client';

import { useState, useRef, useEffect } from 'react';
import { CustomImage, Text } from 'src/common/SitecoreOverrides';
import { Input } from 'components/common/Input';
import { validatePassword } from 'lib/utils/helper';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUIStore } from 'src/store/useUIStore';
import ResetPasswordSuccessModal from './ResetPasswordSuccessModal';
import InfoMessage from 'components/InfoMessage';
import CircleCrossIcon from 'assets/icons/CircleCrossIcon';
import ReCAPTCHA from 'react-google-recaptcha';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function ResetPassword({ fields }: any) {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const { tCode, unauthenticatedUserEmailorPhone } = useUserStore();
  const setUnauthenticatedUser = useUserStore((state) => state.setUnauthenticatedUser);
  const openModal = useUIStore((state) => state.openModal);
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string>();
  const [apiError, setApiError] = useState<string>('');
  const [profileId, setProfileId] = useState<string | null>(tCode);

  const mode = searchParams.get('mode');
  const isPhoneMode = mode === 'phone';

  const userName = isPhoneMode
    ? searchParams.get('userId') || unauthenticatedUserEmailorPhone
    : searchParams.get('username') || unauthenticatedUserEmailorPhone;

  const token = searchParams.get('tokenvalue');
  const registrationMode = 'Email';
  const tokenType = searchParams.get('type') || '3';

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (tCode) setProfileId(tCode);
  }, [tCode]);

  // ---------------- API ----------------

  const { mutate: updatePassword } = useApiMutation('/Profile/UpdatePassword', 'PUT', true);

  // Validate User Email API (test file uses ValidateToken)
  const { mutate: validateUserEmail } = useApiMutation<any, any>(
    (requestData) =>
      `/Token/ValidateToken?token=${requestData.token}&registrationMode=${requestData.registrationMode}&userName=${requestData.userName}&tokenType=${requestData.tokenType}`,
    'PUT',
    true
  );

  // Handle captcha change
  const handleCaptchaChange = async (captchaToken: string | null) => {
    if (!captchaToken || !token || !tokenType) return;

    validateUserEmail(
      {
        token,
        registrationMode,
        userName,
        tokenType,
        captchaToken,
      },
      {
        onSuccess: (res) => {
          if (res.Code !== 200 || !res.Status?.includes('Success') || !res.TCode) {
            openModal('error-modal');
            router.replace('/login');
            return;
          }

          setProfileId(res.TCode);
          setUnauthenticatedUser(userName || undefined, res.TCode);
        },
        onError: () => {
          openModal('error-modal');
          router.replace('/login');
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const passwordResult = validatePassword(password);

    setPasswordError(passwordResult.message);

    if (!passwordResult.isValid || password !== confirmPassword) {
      return;
    }

    const requestData = {
      UserName: userName,
      NewPassword: password,
      ProfileId: profileId,
      Token: token,
      Source: 'Portal',
    };

    updatePassword(requestData, {
      onSuccess: (response: any) => {
        if (response && response.Code === 200 && response.Status === 'Success') {
          openModal('reset-password-success');
          setApiError('');
        }
      },
      onError: () => {
        recaptchaRef.current?.reset();
        setApiError('Password not updated. Please try again.');
      },
    });
  };

  useEffect(() => {
    if (!userName) {
      router.push('/login');
    }
  }, [userName, router]);

  useEffect(() => {
    if (!isPhoneMode && !token) {
      router.push('/login');
    }
  }, [token, router, isPhoneMode]);

  useEffect(() => {
    if (isPhoneMode || !token) return;
    window.dispatchEvent(new CustomEvent('toggle-global-loader', { detail: true }));
    recaptchaRef.current?.execute();
  }, [token, isPhoneMode]);

  if (!userName) {
    return null;
  }

  /* DISABLE SUBMIT BUTTON */
  const isFormDisabled = !password || !confirmPassword || password !== confirmPassword;

  return (
    <div className="font-filson flex items-center min-h-screen px-4 py-14 md:px-8 md:py-6 relative z-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <CustomImage field={fields.backgroundImage} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-120 w-full mx-auto p-4 md:p-8 rounded-2xl bg-white-pure/90 backdrop-blur-sm">
        <Text
          tag="h2"
          field={fields.heading}
          className="text-heading-3 md:text-heading-2 text-center text-navy-500 mb-6"
        />

        {apiError && (
          <InfoMessage IconComponent={CircleCrossIcon} status="error" className="my-5 md:my-6">
            <p className="text-body">{apiError}</p>
          </InfoMessage>
        )}
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="form-group">
          <Input
            type="password"
            label={fields.passwordLabel.value}
            helperText={fields.passwordHelper.value}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(undefined);
            }}
            error={passwordError}
          />

          <Input
            type="password"
            label={fields.confirmPasswordLabel.value}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="btn btn-primary mt-4 w-full uppercase"
            disabled={isFormDisabled}
          >
            {fields?.submitCTALabel?.value}
          </button>
        </form>
      </div>
      {isPhoneMode ? null : (
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={handleCaptchaChange}
        />
      )}
      <ResetPasswordSuccessModal />
    </div>
  );
}
