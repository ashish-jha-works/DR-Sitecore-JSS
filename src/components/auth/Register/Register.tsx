import { useState, useRef } from 'react';
import { CustomImage, CustomLink, Text } from 'src/common/SitecoreOverrides';
import { Input } from 'components/common/Input';
import { formatEmailInput, validateEmail, validatePassword } from 'lib/utils/helper';
import { RegisterFields } from './Register.types';
import { useApiMutation } from 'src/hooks/useApi';
import { useRouter } from 'next/router';
import InfoMessage from 'components/InfoMessage';
import CircleCrossIcon from 'assets/icons/CircleCrossIcon';
import { useUserStore } from 'src/store/useUserStore';
import ReCAPTCHA from 'react-google-recaptcha';

const accountExistsErrorMessage =
  'Account with this Mobile Number / Email already exists. Please log in.';

export default function Register({ fields }: RegisterFields) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const setUnauthenticatedUser = useUserStore((state) => state.setUnauthenticatedUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [apiError, setApiError] = useState<string>('');

  const [confirmPasswordError, setConfirmPasswordError] = useState<string>();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // ---------------- API ----------------

  const { mutate: registerUser } = useApiMutation('Registration/RegisterUser', 'POST', true);

  const isValidEmail = () => {
    const result = validateEmail(email);

    if (email != '') {
      setEmailError(result.message);
    } else {
      setEmailError('');
    }

    return result;
  };

  const isValidPassword = (value: string) => {
    const result = validatePassword(value);
    if (value != '') {
      setPasswordError(result.message);
    } else {
      setPasswordError('');
    }

    return result;
  };

  const isValidConfirmPassword = (value: string) => {
    const result = validatePassword(password);
    if (result.isValid && value != '' && value != password) {
      setConfirmPasswordError('Passwords do not match. Please check and try again.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailResult = isValidEmail();
    const passwordResult = isValidPassword(password);

    setPasswordError(passwordResult.message);

    if (!emailResult.isValid || !passwordResult.isValid || password !== confirmPassword) {
      return;
    }
    recaptchaRef.current?.execute();
  };
  const onCaptchaChange = async (token: string | null) => {
    if (!token) return;

    const isPhoneNumber = /^\d(\s?\d)*$/.test(email);

    const requestData = {
      UserName: email,
      Password: password,
      Captcha_Token: '',
      Source: 'Portal',
    };

    registerUser(requestData, {
      onSuccess: (response: any) => {
        if (response.Code === 200) {
          setUnauthenticatedUser(email);
          if (isPhoneNumber) {
            router.push('/verify-otp?mode=register');
          } else {
            router.push('/verify-email?mode=register');
          }
        } else if (response.Code === 403) {
          recaptchaRef.current?.reset();
          if (response.Status === accountExistsErrorMessage) {
            setEmailError(
              `'Account with this Mobile Number / Email already exists. Please log in.'`
            );
          } else {
            setApiError(
              response.Status ||
                'Email/Mobile Number entered is not registered with Dubai Residential. Kindly use the correct details.'
            );
          }
        } else {
          recaptchaRef.current?.reset();
          setApiError('Something went wrong. Please try again!');
        }
      },
      onError: () => {
        recaptchaRef.current?.reset();
      },
    });
  };

  /* DISABLE SUBMIT BUTTON */
  const isFormDisabled = !email || !password || !confirmPassword || password !== confirmPassword;

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
            label={fields.emailLabel.value}
            helperText={fields.emailHelper.value}
            value={email}
            onChange={(e) => {
              setEmail(formatEmailInput(e.target.value));
              setEmailError(undefined);
            }}
            onBlur={() => {
              isValidEmail();
            }}
            error={emailError}
          />

          <Input
            type="password"
            label={fields.passwordLabel.value}
            helperText={fields.passwordHelper.value}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onInput={(e: any) => {
              isValidPassword(e.target.value);
            }}
            onBlur={(e: any) => {
              isValidPassword(e.target.value);
            }}
            error={passwordError}
          />

          <Input
            type="password"
            label={fields.confirmPasswordLabel.value}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            onInput={(e: any) => {
              isValidConfirmPassword(e.target.value);
            }}
            onBlur={(e: any) => {
              isValidConfirmPassword(e.target.value);
            }}
            error={confirmPasswordError}
          />

          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={onCaptchaChange}
          />

          <button
            type="submit"
            className="btn btn-primary mt-4 w-full uppercase"
            disabled={isFormDisabled}
          >
            {fields?.registerCTALabel?.value}
          </button>

          {fields.termsAndConditionLabel?.value && (
            <p className="text-body-xs py-5 lg:py-6 border-b border-navy-500 text-center">
              {fields.termsAndConditionLabel.value}{' '}
              <CustomLink field={fields.termsAndConditionLink} className="underline text-sky-700" />
            </p>
          )}

          <div className="mt-5 lg:mt-6 flex flex-col gap-3 text-center">
            {fields.existingAccountLabel?.value && (
              <p>
                {fields.existingAccountLabel.value}{' '}
                <CustomLink field={fields.loginLink} className="underline text-sky-700" />
              </p>
            )}

            {fields.unableToRegisterLabel?.value && (
              <p>
                {fields.unableToRegisterLabel.value}{' '}
                <CustomLink
                  field={fields.unableToRegisterLink}
                  className="underline text-sky-700"
                />
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
