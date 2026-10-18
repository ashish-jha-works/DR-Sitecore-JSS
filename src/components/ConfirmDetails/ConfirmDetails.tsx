import { CustomLink, Text } from 'src/common/SitecoreOverrides';
import { Input } from 'components/common/Input';
import { ConfirmDetailsFields } from './ConfirmDetails.types';
import Image from 'next/image';
import InfoMessage from 'components/InfoMessage';
import InfoIcon from 'assets/icons/InfoIcon';
import OtpModal from 'components/OtpModal/OtpModal';
import CircleTickIcon from 'assets/icons/CircleTickIcon';
import { useConfirmDetails } from './useConfirmDetails';

export default function ConfirmDetails({ fields }: ConfirmDetailsFields) {
  const {
    email,
    setEmail,
    emailError,
    setEmailError,
    handleEmailSubmit,
    phoneNumber,
    setPhoneNumber,
    phoneNumberError,
    setPhoneNumberError,
    handlePhoneNumberSubmit,
    formatPhoneInput,
    currentEmail,
    currentPhone,
    emailVerified,
    phoneVerified,
    enableVerifyOTPButton,
    isEmailOtpOpen,
    setIsEmailOtpOpen,
    isPhoneOtpOpen,
    setIsPhoneOtpOpen,
    handleResendEmailOtp,
    handleResendMobileOtp,
    verifyEmailOTP,
    verifyMobileOTP,
    updateContactDetails,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    isCancelBtnDisabled,
    handleCancelBtnClick,
    emailOTPError,
    mobileOTPError,
  } = useConfirmDetails();

  return (
    <section className="h-full my-10">
      <div className="container-sm h-full">
        <div className="h-full border border-solid border-lilac-500 rounded-lg overflow-hidden p-4 lg:p-8">
          <div>
            <h3 className="text-4 lg:text-heading-2 text-left text-navy-500 mb-2 lg:mb-3 flex gap-3 lg:gap-4">
              <Image src="/assets/svg/contact-card.svg" alt="contact card" width={29} height={24} />
              <Text field={fields?.title} />
            </h3>
            <p className="text-body-xs lg:text-body text-left text-navy-500 pb-3 lg:pb-4 font-light border-b border-lilac-300">
              <Text field={fields?.subTitle} />
              <br /> <Text field={fields?.otpRequiredLabel} />
            </p>
          </div>
          <div className="mt-6 lg:mt-8 email-container">
            <h3 className="text-4 lg:text-heading-2 text-left text-navy-500 mb-4 lg:mb-5 flex gap-3 lg:gap-4">
              <Image src="/assets/svg/mail.svg" alt="contact card" width={29} height={24} />
              <Text field={fields?.emailHeadingLabel} />
            </h3>
            <form className="form-group email-form" onSubmit={handleEmailSubmit} noValidate>
              <div className="flex flex-col gap-4 md:gap-5">
                {currentEmail && (
                  <p className="text-body font-light">
                    <Text field={fields?.currentEmailLabel} /> : {currentEmail}
                  </p>
                )}
                <div className="flex flex-col md:flex-row gap-4 md:gap-10">
                  <Input
                    label={fields?.emailLabel?.value}
                    value={email}
                    placeholder="example@domain.com"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(undefined);
                    }}
                    error={emailError}
                    containerClassName={'mt-0!'}
                  />
                  {emailVerified ? (
                    <span className="min-w-56.25 h-12 md:h-13 flex gap-2 items-center justify-center md:justify-start md:mt-6 lg:mt-7 uppercase text-body-sm font-bold">
                      <CircleTickIcon className={'text-success-500'} />
                      <p>{fields?.verifiedLabel?.value}</p>
                    </span>
                  ) : (
                    <button
                      className={`btn btn-primary w-full md:max-w-56.25 h-11 mb-2 md:mt-8 ${
                        !enableVerifyOTPButton ? 'disabled' : ''
                      }`}
                      type="submit"
                    >
                      {fields?.verifyEmailCTALabel?.value || 'VERIFY EMAIL'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="mt-6 lg:mt-8 mobile-container">
            <h3 className="text-4 lg:text-heading-2 text-left text-navy-500 mb-4 lg:mb-5 flex gap-3 lg:gap-4">
              <Image src="/assets/svg/phone.svg" alt="contact card" width={29} height={24} />
              <Text field={fields?.mobileHeadingLabel} />
            </h3>
            <form className="form-group mobile-form" onSubmit={handlePhoneNumberSubmit} noValidate>
              <div className="flex flex-col gap-4 md:gap-5">
                {currentPhone && (
                  <p className="text-body font-light">
                    <Text field={fields?.currentMobileLabel} /> : {currentPhone}
                  </p>
                )}
                <div className="flex flex-col md:flex-row gap-4 md:gap-10">
                  <Input
                    label={fields?.mobileLabel?.value}
                    value={phoneNumber}
                    placeholder="05x xxxxxxx"
                    onChange={(e) => {
                      setPhoneNumber(formatPhoneInput(e.target.value));
                      setPhoneNumberError(undefined);
                    }}
                    error={phoneNumberError}
                    containerClassName={'mt-0!'}
                  />
                  {phoneVerified ? (
                    <span className="min-w-56.25 h-12 md:h-13 flex gap-2 items-center justify-center md:justify-start md:mt-6 lg:mt-7 uppercase text-body-sm font-bold">
                      <CircleTickIcon className={'text-success-500'} />
                      <p>{fields?.verifiedLabel?.value}</p>
                    </span>
                  ) : (
                    <button
                      className={`btn btn-primary w-full md:max-w-56.25 h-11 mb-2 md:mt-8 ${
                        !enableVerifyOTPButton ? 'disabled' : ''
                      }`}
                      type="submit"
                    >
                      {fields?.verifyOTPCTALabel?.value}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
          <InfoMessage IconComponent={InfoIcon} status="normal" className="mt-6 lg:mt-8">
            <Text tag="p" field={fields?.otpInfoMessage} className="text-body font-light" />
          </InfoMessage>
        </div>
      </div>
      <div className="container-sm btn-wrapper mt-5 lg:mt-6 flex flex-col lg:flex-row justify-end gap-5 lg:gap-6">
        <button
          className={`btn btn-secondary w-full lg:max-w-68.75 h-11 lg:h-15 ${
            isCancelBtnDisabled ? 'disabled' : ''
          }`}
          onClick={handleCancelBtnClick}
        >
          {fields?.cancelCTALabel?.value}
        </button>
        <button
          className={`btn btn-primary w-full lg:max-w-68.75 h-11 lg:h-15 ${
            !emailVerified || !phoneVerified ? 'disabled' : ''
          }`}
          onClick={updateContactDetails}
        >
          {fields?.submitCTALabel?.value}
        </button>
      </div>
      <OtpModal
        isOpen={isEmailOtpOpen}
        otpLength={4}
        heading={fields?.confirmEmailModalHeading?.value}
        subHeading={fields?.confirmEmailModalSubHeading?.value}
        infoText={fields?.notReceivedOTPLabel?.value}
        resendLabel={fields?.resendLabel?.value}
        cancelLabel={fields?.cancelCTALabel?.value}
        confirmLabel={fields?.submitCTALabel?.value}
        onClose={() => setIsEmailOtpOpen(false)}
        onResend={handleResendEmailOtp}
        onConfirm={verifyEmailOTP}
        error={emailOTPError}
      />

      <OtpModal
        isOpen={isPhoneOtpOpen}
        otpLength={4}
        heading={fields?.confirmMobileModalHeading?.value}
        subHeading={fields?.confirmMobileModalSubHeading?.value}
        infoText={fields?.notReceivedOTPLabel?.value}
        resendLabel={fields?.resendLabel?.value}
        cancelLabel={fields?.cancelCTALabel?.value}
        confirmLabel={fields?.submitCTALabel?.value}
        onClose={() => setIsPhoneOtpOpen(false)}
        onResend={handleResendMobileOtp}
        onConfirm={verifyMobileOTP}
        error={mobileOTPError}
      />
      <div className={`custom-modal ${isSuccessModalOpen ? 'show' : ''}`}>
        <div className="custom-modal__wrapper">
          <h3 className="custom-modal__heading">{fields.detailsConfirmedModalHeading?.value}</h3>
          <Image
            className="custom-modal__img"
            src="/assets/svg/celebrate.svg"
            alt="Details Confirmation"
            width={294}
            height={210}
          />
          <p className="custom-modal__desc">{fields.detailsConfirmedModalDescription?.value}</p>
          <div className="custom-modal__btn-wrapper">
            <CustomLink
              field={fields?.returnToHomeCTA}
              className="btn btn-primary lg:w-fit lg:px-16"
              onClick={() => setIsSuccessModalOpen(false)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
