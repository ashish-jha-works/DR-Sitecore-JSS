'use client';

import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CustomImage, Text } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';

import InfoMessage from 'components/InfoMessage';
import CircleCrossIcon from 'assets/icons/CircleCrossIcon';
import { useUIStore } from 'src/store/useUIStore';
import CircleTickIcon from 'assets/icons/CircleTickIcon';

interface VerifyEmailFields {
  fields: {
    backgroundImage: ImageField;
    heading: Field<string>;
    subHeading: Field<string>;
    alreadySentHeading: Field<string>;
    alreadyResentHeading: Field<string>;
    description: Field<string>;
    submitCTALabel: Field<string>;
    cancelLabel: Field<string>;
  };
}

export default function VerifyEmail({ fields }: VerifyEmailFields) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const openModal = useUIStore((state) => state.openModal);
  const { unauthenticatedUserEmailorPhone } = useUserStore();
  const [alreadyResent, setAlreadyResent] = useState(false);
  const [resendAPIError, setResendAPIError] = useState<string | null>(null);

  const redirectMode = searchParams.get('mode');

  const cancelRedirectUrl = useMemo(() => {
    const redirectMap: Record<string, string> = {
      'forgot-password': '/forgot-password',
      register: '/register',
    };

    return redirectMap[redirectMode ?? ''] ?? '/login';
  }, [redirectMode]);

  // ---------------- API ----------------

  const resendUrl = useMemo(() => {
    if (!unauthenticatedUserEmailorPhone) return null;

    return `Token/Resend?userName=${unauthenticatedUserEmailorPhone}&registrationMode=Email&tokenType=${
      redirectMode === 'register' ? '1' : '3'
    }`;
  }, [unauthenticatedUserEmailorPhone]);

  const { mutate: resendVerificationLink } = useApiMutation(resendUrl ?? '', 'PUT', true);

  const handleResendVerificationLink = useCallback(() => {
    if (!resendUrl) return;

    resendVerificationLink(null, {
      onSuccess: (response: any) => {
        if (response?.Code === 200) {
          if (response?.Status === 'Success') {
            setAlreadyResent(true);
          } else {
            setResendAPIError(
              response?.Status ? response.Status : 'This user is already verified.'
            );
          }
        } else {
          openModal('error-modal');
        }
      },
      onError: () => {
        openModal('error-modal');
      },
    });
  }, [resendUrl, resendVerificationLink]);

  useEffect(() => {
    if (!unauthenticatedUserEmailorPhone) {
      router.replace(cancelRedirectUrl);
    }
  }, [unauthenticatedUserEmailorPhone, cancelRedirectUrl, router]);

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
          <Text field={fields?.subHeading} />{' '}
          <span className="font-bold">{unauthenticatedUserEmailorPhone}.</span>
        </p>
        <Text
          tag="p"
          field={fields?.description}
          className="text-body my-5 md:my-6 text-center text-navy-500"
        />
        <InfoMessage
          IconComponent={resendAPIError ? CircleCrossIcon : CircleTickIcon}
          status={resendAPIError ? 'error' : 'success'}
        >
          {resendAPIError && <p className="text-body">{resendAPIError}</p>}
          {!resendAPIError && (
            <Text
              tag="p"
              field={alreadyResent ? fields?.alreadyResentHeading : fields?.alreadySentHeading}
              className="text-body text-start"
            />
          )}
        </InfoMessage>

        <div className="flex flex-col gap-4 md:gap-6 items-center pt-3 md:pt-4">
          <button
            type="button"
            className="btn btn-primary w-full uppercase"
            onClick={handleResendVerificationLink}
          >
            {fields?.submitCTALabel?.value}
          </button>
          {fields.cancelLabel?.value && (
            <Link
              className="text-body underline text-sky-700"
              href={cancelRedirectUrl}
              target="_self"
            >
              {fields.cancelLabel.value}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
