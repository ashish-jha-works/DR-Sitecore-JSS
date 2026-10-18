import { useEffect, useState } from 'react';
import { formatPhoneInput, validateEmail } from 'lib/utils/helper';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';
import { useUIStore } from 'src/store/useUIStore';
import { useRouter } from 'next/router';

export const useConfirmDetails = () => {
  const { tCode, Email, Mobile } = useUserStore();
  const { openModal } = useUIStore();
  const setUserData = useUserStore((state) => state.setUserData);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState<string>();

  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPhone, setCurrentPhone] = useState('');

  const [isEmailOtpOpen, setIsEmailOtpOpen] = useState(false);
  const [isPhoneOtpOpen, setIsPhoneOtpOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [enableVerifyOTPButton, setEnableVerifyOTPButton] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCancelBtnDisabled, setIsCancelBtnDisabled] = useState(false);
  const [emailOTPError, setEmailOTPError] = useState(false);
  const [mobileOTPError, setMobileOTPError] = useState(false);
  const router = useRouter();

  /* ---------------- API ---------------- */

  const { mutate: requestOTP } = useApiMutation<any, any>(
    (requestData) =>
      `/Token/Send?profileId=${tCode}&registrationMode=${
        requestData.registrationMode
      }&newEmailorPhone=${encodeURIComponent(requestData.newEmailorPhone)}&tokenType=${
        requestData.tokenType
      }`,
    'POST',
    true
  );

  const { mutate: validateOTPAPI } = useApiMutation<any, any>(
    (requestData) => {
      if (process.env.NODE_ENV === 'development') {
        if (requestData.registrationMode == 'Email') {
          return `/Token/Validate?token=${requestData.token}&registrationMode=${requestData.registrationMode}&profileId=${tCode}`;
        } else {
          return `/Token/Validate?token=${requestData.token}&registrationMode=${requestData.registrationMode}&profileId=${tCode}&newPhoneNumber=${requestData.newPhoneNumber}`;
        }
      } else {
        return `api/occupants/ValidateToken`;
      }
    },
    process.env.NODE_ENV === 'development' ? 'PUT' : 'POST',
    true
  );

  const { mutate: updateContactAPI } = useApiMutation<any, any>(
    () => `/Tenant/${tCode}/Notifications/ContactDetailsConfirmation`,
    'PUT',
    true
  );

  const { mutate: getStatusToDismissContactUpdate } = useApiMutation<any, any>(
    () => `/Tenant/${tCode}/Notifications/ContactDetailsConfirmation`,
    'GET',
    false
  );

  const { mutate: dismissContactUpdateAPI } = useApiMutation<any, any>(
    () => `/Tenant/${tCode}/Notifications/ContactDetailsConfirmation/Dismiss`,
    'PUT',
    true
  );

  const { mutate: mutateProfileData } = useApiMutation<any, any>(
    `/Tenant/${tCode}/Notifications/ProfileLiteApps`,
    'GET',
    false
  );

  /* ---------------- Handlers ---------------- */

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = validateEmail(email, true);
    if (!result.isValid) {
      setEmailError('Invalid email, please try another.');
      return;
    }

    requestOTP(
      { newEmailorPhone: email, registrationMode: 'EmailOTP', tokenType: '10' },
      {
        onSuccess: (res) => {
          if (res?.Code === 200) {
            setIsEmailOtpOpen(true);
          } else {
            openModal('error-modal');
          }
        },
        onError: () => openModal('error-modal'),
      }
    );
  };

  const handlePhoneNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      setPhoneNumberError('Invalid mobile number, please try another.');
      return;
    }

    requestOTP(
      { newEmailorPhone: phoneNumber, registrationMode: 'Phone', tokenType: '4' },
      {
        onSuccess: (res) => {
          if (res?.Code === 200) {
            setIsPhoneOtpOpen(true);
          } else {
            openModal('error-modal');
          }
        },
        onError: () => openModal('error-modal'),
      }
    );
  };

  const handleResendEmailOtp = () =>
    requestOTP(
      { newEmailorPhone: email, registrationMode: 'EmailOTP', tokenType: '10' },
      {
        onSuccess: (res) => {
          if (res?.Code === 200) {
            setIsEmailOtpOpen(true);
          } else {
            openModal('error-modal');
          }
        },
        onError: () => openModal('error-modal'),
      }
    );

  const handleResendMobileOtp = () =>
    requestOTP(
      { newEmailorPhone: phoneNumber, registrationMode: 'Phone', tokenType: '4' },
      {
        onSuccess: (res) => {
          if (res?.Code === 200) {
            setIsPhoneOtpOpen(true);
          } else {
            openModal('error-modal');
          }
        },
        onError: () => openModal('error-modal'),
      }
    );

  const verifyEmailOTP = (otp: string) =>
    validateOTPAPI(
      { token: otp, registrationMode: 'Email', profileId: tCode },
      {
        onSuccess: (res) => {
          if (res.Code === 200) {
            setEmailVerified(true);
            setIsEmailOtpOpen(false);
          } else {
            setEmailOTPError(true);
          }
        },
        onError: () => {
          setEmailOTPError(true);
        },
      }
    );

  const verifyMobileOTP = (otp: string) =>
    validateOTPAPI(
      { token: otp, registrationMode: 'Phone', profileId: tCode },
      {
        onSuccess: (res) => {
          if (res.Code === 200) {
            setPhoneVerified(true);
            setIsPhoneOtpOpen(false);
          } else {
            setMobileOTPError(true);
          }
        },
        onError: () => {
          setMobileOTPError(true);
        },
      }
    );

  const updateContactDetails = () =>
    updateContactAPI(null, {
      onSuccess: () => setIsSuccessModalOpen(true),
      onError: () => openModal('error-modal'),
    });

  const handleCancelBtnClick = () => {
    dismissContactUpdateAPI(null, {
      onSuccess: (response) => {
        if (response.status === 200 && response.data !== null && response.data.Code === 200) {
          router.push('/dashboard');
        }
      },
      onError: () => openModal('error-modal'),
    });
  };

  /* Effects */

  useEffect(() => {
    // Check if we already have this value in global store
    if (Email || Mobile) {
      if (Email) {
        setEmail(Email);
        setCurrentEmail(Email);
      }

      let mobile = Mobile?.trim();
      if (mobile) {
        if (mobile.length === 9) mobile = `0${mobile}`;
        setPhoneNumber(mobile);
        setCurrentPhone(mobile);
        setEnableVerifyOTPButton(true);
      }
    } else {
      if (tCode) {
        mutateProfileData(null, {
          onSuccess: (response) => {
            setUserData({ Email: response?.Email, Mobile: response?.Mobile });
          },
          onError: (error) => {
            console.error('Error loading profile data:', error);
            openModal('error-modal');
          },
        });
      }
    }
  }, [Email, Mobile, tCode, mutateProfileData]);

  useEffect(() => {
    if (tCode) {
      getStatusToDismissContactUpdate(null, {
        onSuccess: (response) => {
          if (!response?.data?.Dismiss) {
            setIsCancelBtnDisabled(true);
          }
        },
        onError: () => openModal('error-modal'),
      });
    }
  }, [tCode, getStatusToDismissContactUpdate]);
  return {
    email,
    emailError,
    phoneNumber,
    phoneNumberError,
    currentEmail,
    currentPhone,
    emailVerified,
    phoneVerified,
    enableVerifyOTPButton,
    isEmailOtpOpen,
    isPhoneOtpOpen,
    isSuccessModalOpen,
    isCancelBtnDisabled,
    emailOTPError,
    mobileOTPError,
    setEmail,
    setEmailError,
    setPhoneNumber,
    setPhoneNumberError,
    setIsEmailOtpOpen,
    setIsPhoneOtpOpen,
    setIsSuccessModalOpen,
    handleEmailSubmit,
    handlePhoneNumberSubmit,
    handleResendEmailOtp,
    handleResendMobileOtp,
    verifyEmailOTP,
    verifyMobileOTP,
    updateContactDetails,
    formatPhoneInput,
    handleCancelBtnClick,
  };
};
