import { useState, useEffect, useMemo, useRef } from 'react';
import { CustomImage, CustomLink, Text } from 'src/common/SitecoreOverrides';
import { Input } from 'components/common/Input';
import { formatEmailInput, validateEmail } from 'lib/utils/helper';
import { useUserStore } from 'src/store/useUserStore';
import { useApiMutation } from 'src/hooks/useApi';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Login({ fields }: any) {
  const router = useRouter();

  const { IsLoggedIn, ProfileType, ShowUnitSelectionScreen } = useUserStore();
  const setUserData = useUserStore((state) => state.setUserData);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const { mutate, isPending } = useApiMutation<any, any>('/Profile/Verify', 'POST', true);

  const isFormDisabled = useMemo(() => {
    return !email.trim() || !password.trim() || isPending;
  }, [email, password, isPending]);

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailResult = validateEmail(email);

    setEmailError(emailResult.message);

    if (!emailResult.isValid) return;
    recaptchaRef.current?.execute();
  };
  const onCaptchaChange = async (token: string | null) => {
    if (!token) return;

    mutate(
      {
        UserName: email.trim(),
        Password: password,
        Captcha_Token: token,
        Source: 'Portal',
      },
      {
        onSuccess: (response) => {
          setUserData(response);
        },
        onError: (error: any) => {
          recaptchaRef.current?.reset();
          const errorStatus = error?.Status || error?.response?.data?.Status;
          if (
            errorStatus?.includes('Use either your email') ||
            errorStatus?.includes('Are you a new user')
          ) {
            setEmailError(
              errorStatus ||
                'Please use the email registered with Dubai Residential in the correct format (username@mail.com)'
            );
          } else if (errorStatus?.includes('You have entered incorrect')) {
            setPasswordError(
              errorStatus || 'You have entered an incorrect password. Please try again.'
            );
          }
        },
      }
    );
  };

  const redirectUser = () => {
    if ((ProfileType == 6 || ProfileType == 7) && ShowUnitSelectionScreen == true) {
      router.replace('/unit-selection');
    } else if (IsLoggedIn) {
      router.replace('/dashboard');
    }
  };

  // Redirect user if already logged in or after successful login
  useEffect(() => {
    if (IsLoggedIn) {
      redirectUser();
    }
  }, [IsLoggedIn]);

  return (
    <div className="font-filson flex items-center min-h-screen px-4 py-14 md:px-8 md:py-6 relative z-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <CustomImage field={fields?.backgroundImage} className="w-full h-full object-cover" />
      </div>
      <div className="max-w-120 w-full mx-auto p-4 md:p-8 rounded-2xl bg-white-pure/90 backdrop-blur-sm">
        <Text
          tag="h2"
          field={fields?.heading}
          className="text-heading-3 md:text-heading-2 text-center text-navy-500 mb-6"
        />
        <form onSubmit={handleSubmit} noValidate className="form-group">
          <Input
            label={fields?.emailLabel.value}
            helperText={fields?.emailHelper.value}
            value={email}
            onChange={(e) => {
              setEmail(formatEmailInput(e.target.value));
              setEmailError(undefined);
            }}
            error={emailError}
          />
          <Input
            type="password"
            label={fields?.passwordLabel.value}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(undefined);
            }}
            error={passwordError}
          />
          <div className="text-end">
            <CustomLink
              field={fields?.forgotPasswordLink}
              className="text-body font-medium underline text-sky-700 hover:text-sky-600"
            />
          </div>
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={onCaptchaChange}
          />
          <button
            data-analytics-value="sign_in_login"
            type="submit"
            className="btn btn-primary mt-4 w-full uppercase"
            disabled={isFormDisabled}
          >
            {fields?.loginCTALabel?.value}
          </button>
          <div className="mt-5 lg:mt-6 flex flex-col gap-3 text-center">
            {fields?.newAccountLabel?.value && (
              <p>
                {fields?.newAccountLabel.value}{' '}
                <CustomLink field={fields?.registerLink} className="underline text-sky-700" />
              </p>
            )}
            {fields?.unableToLoginLabel?.value && (
              <p>
                {fields?.unableToLoginLabel?.value}{' '}
                <CustomLink field={fields?.unableToLoginLink} className="underline text-sky-700" />
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
