import ChevronDown from 'assets/icons/ChevronDown';
import OtpModal from 'components/OtpModal/OtpModal';
import { CustomModal } from 'components/modals/CustomModal';
import { Input } from 'src/components/common/Input';
import { useContactDetails } from './useContactDetails';

type ContactDetailsProps = {
  fields: any;
  tCode: string | null;
  onSaved?: () => void;
};

export default function ContactDetails({ fields, tCode, onSaved }: ContactDetailsProps) {
  const {
    form,
    fieldErrors,
    isMobileEditing,
    isEmailEditing,
    isDetailsEditing,
    isMobileOtpOpen,
    mobileOtpError,
    isEmailVerifyModalOpen,
    isSuccessOpen,
    isMobileSuccessOpen,
    emergencyRelationshipOptions,
    isSaving,
    setIsMobileOtpOpen,
    setIsEmailVerifyModalOpen,
    setIsSuccessOpen,
    setIsMobileSuccessOpen,
    updateField,
    handleMobileChange,
    handleAltMobileChange,
    handleLandlineChange,
    handleEmergencyMobileChange,
    handleEmergencyRelationChange,
    setIsMobileEditing,
    setIsEmailEditing,
    setIsDetailsEditing,
    cancelMobileEdit,
    cancelEmailEdit,
    cancelDetailsEdit,
    saveMobile,
    saveEmail,
    saveDetails,
    resendMobileOtp,
    verifyMobileOtp,
  } = useContactDetails({ fields, tCode, onSaved });

  return (
    <div className="form-group">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6">
        <div>
          <Input
            label="Mobile number* (05X XXXXXXX)"
            value={form.Tenant_Mobile}
            onChange={handleMobileChange}
            disabled={!isMobileEditing}
            showClearButton={isMobileEditing}
            error={fieldErrors.Tenant_Mobile}
          />
          {isMobileEditing ? (
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:mt-4">
              <button
                type="button"
                className="btn btn-secondary h-11 uppercase w-full"
                onClick={cancelMobileEdit}
                disabled={isSaving}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="btn btn-primary h-11 uppercase w-full"
                onClick={saveMobile}
                disabled={isSaving}
              >
                SAVE
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-secondary md:btn-sm h-11 uppercase w-full md:mt-4"
              onClick={() => setIsMobileEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
        <div>
          <Input
            label="Email address*"
            value={form.Tenant_Email}
            onChange={updateField('Tenant_Email')}
            disabled={!isEmailEditing}
            showClearButton={isEmailEditing}
            error={fieldErrors.Tenant_Email}
            maxLength={35}
          />
          {isEmailEditing ? (
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:mt-4">
              <button
                type="button"
                className="btn btn-secondary h-11 uppercase w-full"
                onClick={cancelEmailEdit}
                disabled={isSaving}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="btn btn-primary h-11 uppercase w-full"
                onClick={saveEmail}
                disabled={isSaving}
              >
                SAVE
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-secondary md:btn-sm h-11 uppercase w-full md:mt-4"
              onClick={() => setIsEmailEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-t-lilac-300 pt-5 grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6">
        <Input
          label="Alternate mobile number (05X XXXXXXX)"
          value={form.Tenant_Alt_Mob_No}
          onChange={handleAltMobileChange}
          disabled={!isDetailsEditing}
          showClearButton={isDetailsEditing}
          error={fieldErrors.Tenant_Alt_Mob_No}
        />
        <Input
          label="Landline number (0X XXXXXXX)"
          value={form.Tenant_Landline_No}
          onChange={handleLandlineChange}
          disabled={!isDetailsEditing}
          showClearButton={isDetailsEditing}
          error={fieldErrors.Tenant_Landline_No}
        />
        <Input
          label="Emergency contact name*"
          value={form.tenant_emergency_Name}
          onChange={updateField('tenant_emergency_Name')}
          disabled={!isDetailsEditing}
          showClearButton={isDetailsEditing}
          error={fieldErrors.tenant_emergency_Name}
        />
        <div>
          <label
            htmlFor="emergency-contact-relationship"
            className={`block text-body font-light mb-2 ${!isDetailsEditing ? 'text-muted' : ''}`}
          >
            Emergency contact relationship*
          </label>
          <div className="relative mb-2">
            <select
              id="emergency-contact-relationship"
              value={form.tenant_emergency_Relation}
              onChange={handleEmergencyRelationChange}
              disabled={!isDetailsEditing}
              data-filled={form.tenant_emergency_Relation ? 'true' : undefined}
              className="pe-10 font-light text-body text-navy-500"
            >
              <option value="">Select</option>
              {emergencyRelationshipOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lilac-500"
              width={20}
              height={20}
            />
          </div>
          {fieldErrors.tenant_emergency_Relation && (
            <p className="text-error text-body-xs font-light -mt-1 mb-2">
              {fieldErrors.tenant_emergency_Relation}
            </p>
          )}
        </div>
        <Input
          label="Emergency contact number* (05X XXXXXXX)"
          value={form.Tenant_Emergency_No}
          onChange={handleEmergencyMobileChange}
          disabled={!isDetailsEditing}
          showClearButton={isDetailsEditing}
          error={fieldErrors.Tenant_Emergency_No}
        />
        <Input
          label="PO Box*"
          value={form.Tenant_Zip}
          onChange={updateField('Tenant_Zip')}
          disabled={!isDetailsEditing}
          showClearButton={isDetailsEditing}
          error={fieldErrors.Tenant_Zip}
          maxLength={10}
        />
        <Input
          label="Company name"
          value={form.Company_Name}
          onChange={updateField('Company_Name')}
          disabled={!isDetailsEditing}
          showClearButton={isDetailsEditing}
          error={fieldErrors.Company_Name}
          maxLength={40}
        />
        <Input
          label="Company address"
          value={form.Company_Addr}
          onChange={updateField('Company_Addr')}
          disabled={!isDetailsEditing}
          showClearButton={isDetailsEditing}
          error={fieldErrors.Company_Addr}
          maxLength={50}
        />
      </div>

      <div className="mt-4 flex justify-end pb-4 md:pb-8">
        {isDetailsEditing ? (
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 w-full md:w-auto">
            <button
              type="button"
              className="btn btn-secondary uppercase h-[60px] w-full md:w-[275px]"
              onClick={cancelDetailsEdit}
              disabled={isSaving}
            >
              CANCEL
            </button>
            <button
              type="button"
              className="btn btn-primary uppercase h-[60px] w-full md:w-[275px]"
              onClick={saveDetails}
              disabled={isSaving}
            >
              SAVE
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-primary uppercase h-[60px] w-full md:w-[275px]"
            onClick={() => setIsDetailsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>

      <OtpModal
        isOpen={isMobileOtpOpen}
        otpLength={4}
        heading="Enter OTP"
        subHeading="OTP has been sent to your new mobile number for verification."
        infoText="Did not receive OTP?"
        resendLabel="RESEND"
        cancelLabel="CANCEL"
        confirmLabel="SUBMIT"
        error={mobileOtpError}
        onClose={() => setIsMobileOtpOpen(false)}
        onResend={resendMobileOtp}
        onConfirm={verifyMobileOtp}
      />

      <CustomModal
        showModal={isEmailVerifyModalOpen}
        setShowModal={setIsEmailVerifyModalOpen}
        heading="Verify your email"
        description="A verification link has been sent to your new email address. Please click the link to confirm the change. Once verified, all future communication will be sent to your updated email address."
        imagePath="/assets/svg/email.svg"
        primaryBtnLabel="OK"
      />

      <CustomModal
        showModal={isMobileSuccessOpen}
        setShowModal={setIsMobileSuccessOpen}
        heading="Details confirmed"
        description="Your mobile number has been successfully verified and updated."
        imagePath="/assets/svg/registration-successful.svg"
        primaryBtnLabel="CLOSE"
      />

      <CustomModal
        showModal={isSuccessOpen}
        setShowModal={setIsSuccessOpen}
        heading="Success"
        description="You have successfully updated your details."
        imagePath="/assets/svg/registration-successful.svg"
        primaryBtnLabel="OK"
      />
    </div>
  );
}
