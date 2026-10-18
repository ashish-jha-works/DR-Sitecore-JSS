import React from 'react';
import { CustomLink, CustomRichText, Text } from 'src/common/SitecoreOverrides';

import ArrowLeft from 'assets/icons/ArrowLeft';
import InfoIcon from 'assets/icons/InfoIcon';
import InfoMessage from 'components/InfoMessage';
import { AddCardFailureModal, AddCardSuccessModal } from 'components/payments/ManageCards/modals';
import { PAYMENT_CARDS } from 'lib/common/constants/common';

import PaymentSchedule from '../PaymentPlan/PaymentSchedule/PaymentSchedule';
import RenewalStepper from '../Stepper/RenewalsStepper';
import { LeaseExpiryErrorModal } from './modals/LeaseExpiryErrorModal';
import { PaymentConfirmationModal } from './modals/PaymentConfirmationModal';
import { RenewalsPaymentFailedModal } from './modals/RenewalsPaymentFailedModal';
import { RenewalsPaymentSuccessModal } from './modals/RenewalsPaymentSuccessModal';
import PaymentScheduleSkeleton from './PaymentScheduleSkeleton';
import PaymentWithCard from './PaymentWithCard/PaymentWithCard';
import { PayRenewalFields, PayRenewalProps } from './payRenewal.types';
import { usePayRenewal } from './usePayRenewal';

const PayRenewal = ({ fields }: PayRenewalProps) => {
  const {
    isLoading,
    setStepperAPIData,
    installmentsPDCDetails,
    selectedPaymentPlan,
    selectedCard,
    setSelectedCard,
    termsAccepted,
    setTermsAccepted,
    paymentMethodTermsAccepted,
    setPaymentMethodTermsAccepted,
    acknowledgmentOf12MonthFee,
    setAcknowledgmentOf12MonthFee,
    paymentAcknowledgment,
    setPaymentAcknowledgement,
    cvv,
    setCvv,
    isFuturePayment,
    handleAddNewCard,
    handleCancelJourney,
    handleSubmitPaymentRequest,
    preservedInstallmentAdditionalAmount,
    paymentRefNo,
    paymentAmount,
    // Modal Props
    handlePaymentSuccessContinueClick,
    leaseEndDate,
    isLeaseExpired,
    openModal,
    router,
    errorModalHeading,
    errorModalDesc,
    cardsValidUntilDate,
  } = usePayRenewal();

  const handleSubmitClick = () => {
    if (Number(selectedPaymentPlan) === 1) {
      router.push('/contract-renewal/cheque-payment?po=1');
    } else {
      openModal('renewals-payment-confirmation-modal');
    }
  };

  const isSubmitDisabled =
    !selectedCard ||
    !termsAccepted ||
    !paymentMethodTermsAccepted ||
    (installmentsPDCDetails?.length === 12 && !acknowledgmentOf12MonthFee) ||
    !paymentAcknowledgment ||
    (!isFuturePayment &&
      (selectedCard?.Scheme === PAYMENT_CARDS.AMEX ? cvv.value.length < 4 : cvv.value.length < 3));

  const redirectBackURLForPage = `/contract-renewal/pay-renewal?po=${selectedPaymentPlan}`;

  return (
    <>
      <RenewalStepper setStepperAPIData={setStepperAPIData} />
      <div className="pay-renewal-section container-sm space-y-6 my-6 lg:my-10">
        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 lg:p-8 flex flex-col gap-5 md:gap-6">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex gap-3 lg:gap-4 items-center">
              <CustomRichText field={fields?.headerIcon} />
              <Text tag="h1" field={fields?.title} className="text-[16px] md:text-[20px]" />
            </div>
            <BackCTA fields={fields} />
          </div>
          <BackCTA fields={fields} isMobile={true} />
          {isLoading ? (
            <PaymentScheduleSkeleton />
          ) : (
            <div>
              <PaymentSchedule
                installmentsDetails={installmentsPDCDetails}
                selectedPaymentPlan={selectedPaymentPlan}
                showFirstAndFuturePayment={true}
              />
            </div>
          )}
        </div>
        <PaymentWithCard
          fields={fields}
          cardsValidUntilDate={cardsValidUntilDate}
          isLoading={isLoading}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          termsAccepted={termsAccepted}
          setTermsAccepted={setTermsAccepted}
          paymentMethodTermsAccepted={paymentMethodTermsAccepted}
          setPaymentMethodTermsAccepted={setPaymentMethodTermsAccepted}
          acknowledgmentOf12MonthFee={acknowledgmentOf12MonthFee}
          setAcknowledgmentOf12MonthFee={setAcknowledgmentOf12MonthFee}
          paymentAcknowledgment={paymentAcknowledgment}
          setPaymentAcknowledgement={setPaymentAcknowledgement}
          cvv={cvv}
          setCvv={setCvv}
          isFuturePayment={isFuturePayment}
          handleAddNewCard={handleAddNewCard}
          selectedInstallments={installmentsPDCDetails?.length}
          preservedInstallmentAdditionalAmount={preservedInstallmentAdditionalAmount}
        />
        {!isLoading ? (
          <InfoMessage IconComponent={InfoIcon} status="normal">
            <Text tag="p" field={fields?.selectedCardInfoMessage} className="text-body" />
          </InfoMessage>
        ) : null}
        <div className="btn-wrapper flex flex-col lg:flex-row lg:justify-end items-end mt-2 gap-4 md:gap-6">
          <button
            className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15 uppercase"
            onClick={handleCancelJourney}
          >
            {fields?.cancelCTALabel?.value}
          </button>
          <button
            className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
            onClick={handleSubmitClick}
            disabled={isSubmitDisabled}
          >
            {Number(selectedPaymentPlan) === 1 ? 'Proceed' : fields?.submitCTALabel?.value}
          </button>
        </div>

        {/* Modals */}

        <AddCardSuccessModal handleCloseClick={() => router.replace(redirectBackURLForPage)} />

        <AddCardFailureModal
          handleRetryAddCard={handleAddNewCard}
          secondaryCTAText={'CHOOSE EXISTING CARD'}
          handleCloseClick={() => router.replace(redirectBackURLForPage)}
        />

        <LeaseExpiryErrorModal
          validDateLimit={leaseEndDate}
          errorModalHeading={errorModalHeading}
          errorModalDesc={errorModalDesc}
          handleCloseClick={() => router.replace(redirectBackURLForPage)}
        />

        <PaymentConfirmationModal
          handleConfirmPayment={handleSubmitPaymentRequest}
          installmentsCount={installmentsPDCDetails?.length}
          paymentMethod={Number(selectedPaymentPlan)}
          isLeaseExpired={isLeaseExpired}
        />

        <RenewalsPaymentSuccessModal
          paymentRefNo={paymentRefNo || 0}
          amount={paymentAmount}
          isScheduled={isFuturePayment ? true : false}
          handlePaymentSuccessContinueClick={handlePaymentSuccessContinueClick}
        />

        <RenewalsPaymentFailedModal handleRetryPayment={handleSubmitPaymentRequest} />
      </div>
    </>
  );
};

export const BackCTA = ({
  fields,
  isMobile = false,
}: {
  fields: PayRenewalFields;
  isMobile?: boolean;
}) => {
  return (
    <CustomLink
      field={fields?.backCTA}
      className={`${
        isMobile ? 'flex lg:hidden justify-center' : 'hidden lg:flex'
      } text-body-sm font-medium gap-2 lg:gap-3 text-navy-500 uppercase items-center px-4 py-2.5`}
    >
      <ArrowLeft className="size-5 lg:size-6" />
      {fields?.backCTA?.value?.text}
    </CustomLink>
  );
};

export default PayRenewal;
