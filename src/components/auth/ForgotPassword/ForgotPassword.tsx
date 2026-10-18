import { useRouter } from 'next/router';
import { useState } from 'react';
import { CustomImage, Text } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';

import { Input } from 'components/common/Input';
import { formatEmailInput, validateEmail } from 'lib/utils/helper';

import { ForgotPasswordFields } from './ForgotPassword.types';

export default function ForgotPassword({ fields }: ForgotPasswordFields) {
  const router = useRouter();
  const setUnauthenticatedUser = useUserStore((state) => state.setUnauthenticatedUser);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();

  const isPhoneNumber = /^\d(\s?\d)*$/.test(email);

  // ---------------- API ----------------

  const { mutate: sendForgotPasswordRequest } = useApiMutation(
    (requestData: any) => {
      return `Token/ForgotPasswordMobile?userName=${requestData.newEmailorPhone}&registrationMode=${requestData.registrationMode}&tokenType=${requestData.tokenType}&Captcha_Token=${requestData.captcha}`;
    },
    'PUT',
    true
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailResult = validateEmail(email);

    console.log('Email validation result:', emailResult);

    setEmailError(emailResult.message);

    if (!emailResult.isValid) {
      return;
    }

    const requestData = {
      newEmailorPhone: email,
      registrationMode: 'Email',
      tokenType: '3',
      captcha: '',
    };
    if (isPhoneNumber) {
      requestData.registrationMode = 'Phone';
    }

    sendForgotPasswordRequest(requestData, {
      onSuccess: (response) => {
        if (response) {
          setUnauthenticatedUser(email);
          if (isPhoneNumber) {
            router.push('/verify-otp?mode=forgot-password');
          } else {
            router.push('/verify-email?mode=forgot-password');
          }
        }
      },
      onError: (error) => {
        console.log('Error sending forgot password request', error);
      },
    });
  };

  /* DISABLE SUBMIT BUTTON */
  const isFormDisabled = !email;

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
        <Text
          tag="p"
          field={fields?.description}
          className="text-body mt-2 mb-5 lg:mt-3 lg:mb-6 text-center text-navy-500"
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
          <button
            type="submit"
            className="btn btn-primary mt-4 w-full uppercase"
            disabled={isFormDisabled}
          >
            {fields?.submitCTALabel?.value}
          </button>
        </form>
      </div>
    </div>
  );
}
