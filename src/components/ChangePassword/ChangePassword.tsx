'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import CircleCrossIcon from 'assets/icons/CircleCrossIcon';
import InfoMessage from 'src/components/InfoMessage';
import { Input } from 'src/components/common/Input';
import { validateChangePasswordNewPassword } from 'lib/utils/helper';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';

const SUBPROFILE_REGISTER_STATUS = 'Are you a new user? Please sign up/register.';

export default function ChangePassword({ fields }: any) {
  const router = useRouter();
  const { tCode, ProfileType } = useUserStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState<string>();
  const [confirmError, setConfirmError] = useState<string>();
  const [apiError, setApiError] = useState('');

  const { mutate: changePassword, isPending } = useApiMutation(
    '/MyDocuments/ChangePassword',
    'POST',
    true
  );

  const syncNewPasswordValidation = useCallback((pw: string) => {
    if (!pw) {
      setNewPasswordError(undefined);
      return;
    }
    const r = validateChangePasswordNewPassword(pw);
    setNewPasswordError(r.isValid ? undefined : r.message);
  }, []);

  const syncConfirmMatch = useCallback((nw: string, cf: string) => {
    if (cf && nw !== cf) {
      setConfirmError('Passwords do not match');
    } else {
      setConfirmError(undefined);
    }
  }, []);

  const newPasswordRulesOk = useMemo(
    () => validateChangePasswordNewPassword(newPassword).isValid,
    [newPassword]
  );

  const isSubmitDisabled = useMemo(() => {
    if (!currentPassword || !newPassword || !confirmPassword) return true;
    if (!newPasswordRulesOk) return true;
    if (newPassword !== confirmPassword) return true;
    return false;
  }, [currentPassword, newPassword, confirmPassword, newPasswordRulesOk]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setConfirmError(undefined);

    const pwdCheck = validateChangePasswordNewPassword(newPassword);
    setNewPasswordError(pwdCheck.message);
    if (!pwdCheck.isValid) return;

    if (newPassword !== confirmPassword) {
      setConfirmError('Passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setApiError('Current Password and new Password Cannot be same');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNewPasswordError(undefined);
      setConfirmError(undefined);
      return;
    }

    if (!tCode) {
      setApiError('Unable to update password. Please sign in again.');
      return;
    }

    changePassword(
      {
        tCode,
        OldPassword: currentPassword,
        NewPassword: newPassword,
      },
      {
        onSuccess: (response: any) => {
          if (
            ProfileType === 8 &&
            response?.Code === 403 &&
            response?.Status === SUBPROFILE_REGISTER_STATUS
          ) {
            setApiError(
              'This profile does not exist. Please contact the main tenant for further information.'
            );
            return;
          }

          if (response?.Code === 200) {
            router.push('/profile');
            return;
          }

          if (response?.Code === 403) {
            setApiError('You have entered incorrect current password');
            setNewPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
            setNewPasswordError(undefined);
            setConfirmError(undefined);
            return;
          }

          setApiError(
            typeof response?.Status === 'string'
              ? response.Status
              : typeof response?.Message === 'string'
              ? response.Message
              : 'Password could not be updated. Please try again.'
          );
        },
        onError: () => {
          setApiError('You have entered incorrect current password');
          setNewPassword('');
          setConfirmPassword('');
          setCurrentPassword('');
          setNewPasswordError(undefined);
          setConfirmError(undefined);
        },
      }
    );
  };

  return (
    <section className="bg-silver-chalice-50 pb-12 md:pb-16 pt-6 md:pt-8">
      <div className="flex justify-center px-4 md:px-6">
        <div className="w-full max-w-[480px]">
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8">
            <h2 className="text-heading-2 font-normal text-navy-500 text-start mb-5 md:mb-6">
              {fields?.formTitle?.value}
            </h2>

            {apiError ? (
              <InfoMessage IconComponent={CircleCrossIcon} status="error" className="mb-5 md:mb-6">
                <p className="text-body">{apiError}</p>
              </InfoMessage>
            ) : null}

            <form onSubmit={handleSubmit} noValidate className="form-group !text-start">
              <Input
                type="password"
                label={fields?.currentPasswordLabel?.value}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setApiError('');
                }}
              />

              <div className="mt-3 md:mt-4">
                <Input
                  type="password"
                  label={fields?.newPasswordLabel?.value}
                  value={newPassword}
                  onChange={(e) => {
                    const v = e.target.value;
                    setNewPassword(v);
                    setApiError('');
                    syncNewPasswordValidation(v);
                    syncConfirmMatch(v, confirmPassword);
                  }}
                  error={newPasswordError}
                />
                {!newPasswordError && fields?.newPasswordRulesText?.value ? (
                  <p className="text-body-sm text-navy-500 font-light mt-2">
                    {fields.newPasswordRulesText.value}
                  </p>
                ) : null}
              </div>

              <div className="mt-3 md:mt-4">
                <Input
                  type="password"
                  label={fields?.confirmPasswordLabel?.value}
                  value={confirmPassword}
                  onChange={(e) => {
                    const v = e.target.value;
                    setConfirmPassword(v);
                    syncConfirmMatch(newPassword, v);
                  }}
                  error={confirmError}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary mt-[20px] md:mt-6 w-full uppercase"
                disabled={isSubmitDisabled || isPending}
              >
                {fields?.submitButtonText?.value}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
