'use client';

import { ReactNode } from 'react';

import DocumentIcon from 'assets/icons/DocumentIcon';
import PhoneIcon from 'assets/icons/PhoneIcon';
import { CustomRichText } from 'src/common/SitecoreOverrides';

import RenewalStepper from '../Stepper/RenewalsStepper';
import ViewPDCModal from '../PaymentPlan/PaymentSchedule/ViewPDCModal';
import DigitalAgreementPanel from './DigitalAgreementPanel';
import PhysicalSchedulePanel from './PhysicalSchedulePanel';
import SignOptionCard from './SignOptionCard';
import SignatureSkeleton from './SignatureSkeleton';
import { SIGN_METHOD } from './renewalSignContractConstants';
import type { RenewalSignContractProps } from './renewalSignContract.types';
import { getFieldValue, toSitecoreField } from './renewalSignContract.utils';
import { useSignContract } from './useSignContract';

const PlaceholderIcon = ({ children }: { children: ReactNode }) => (
  <div className="text-lilac-500">{children}</div>
);

export default function RenewalSignContract({ fields = {} }: RenewalSignContractProps) {
  const {
    isLoading,
    view,
    signMethod,
    setSignMethod,
    physicalOption,
    setPhysicalOption,
    termsAccepted,
    setTermsAccepted,
    isConfirmDisabled,
    isProceedDisabled,
    physicalScheduleDocuments,
    selectedPaymentPlan,
    installmentsPDCDetails,
    selectedPdcInstallmentIndex,
    downloadContract,
    downloadDirectDebitForm,
    downloadThirdPartyLetter,
    downloadDirectDebitSideLetter,
    handleViewPdc,
    handleConfirmMethod,
    handleProceedPhysicalSchedule,
  } = useSignContract();

  const renderIcon = (field: any, fallback: ReactNode) => {
    const value = getFieldValue(field);
    if (value) return <CustomRichText field={toSitecoreField(field)} />;
    return <PlaceholderIcon>{fallback}</PlaceholderIcon>;
  };

  if (isLoading) {
    return (
      <section className="RenewalSignContract contract-renewal">
        <RenewalStepper />
        <SignatureSkeleton />
      </section>
    );
  }

  return (
    <section className="RenewalSignContract contract-renewal">
      <RenewalStepper />

      <div className="relative lg:static container-sm py-8 md:py-10 flex flex-col gap-5 md:gap-6">
        {view === 'method' ? (
          <>
            <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col">
              <h1 className="text-body md:text-heading-3 font-normal text-navy-500 mb-4 md:mb-6">
                {getFieldValue(
                  fields?.signMethodTitle,
                  'How would you like to sign your contract?'
                )}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full md:w-max">
                <SignOptionCard
                  id="sign-method-digital"
                  name="sign-method"
                  value={SIGN_METHOD.DIGITAL}
                  selected={signMethod === SIGN_METHOD.DIGITAL}
                  onSelect={(value) => setSignMethod(value as typeof signMethod)}
                  icon={renderIcon(
                    fields?.digitalSignIcon,
                    <PhoneIcon className="w-7 h-9 md:w-9 md:h-[55px]" />
                  )}
                  title={getFieldValue(fields?.digitalSignTitle, 'Digital (E-Agreement)')}
                  description={getFieldValue(
                    fields?.digitalSignDescription,
                    'Proceed digitally using UAE Pass verification.'
                  )}
                  footnote={getFieldValue(
                    fields?.digitalSignFootnote,
                    'This is not a digitally signed contract. Please ensure you are registered on UAE Pass and have the app installed on your phone.'
                  )}
                />
                <SignOptionCard
                  id="sign-method-physical"
                  name="sign-method"
                  value={SIGN_METHOD.PHYSICAL}
                  selected={signMethod === SIGN_METHOD.PHYSICAL}
                  onSelect={(value) => setSignMethod(value as typeof signMethod)}
                  icon={renderIcon(
                    fields?.physicalSignIcon,
                    <DocumentIcon className="w-7 h-9 md:w-9 md:h-[55px]" />
                  )}
                  title={getFieldValue(fields?.physicalSignTitle, 'Physical (Wet Signature)')}
                  description={getFieldValue(
                    fields?.physicalSignDescription,
                    'Print and sign the physical agreement manually'
                  )}
                  footnote={getFieldValue(
                    fields?.physicalSignFootnote,
                    'Choose collection or delivery in the next step, then arrange for the signed contract to be collected.'
                  )}
                />
              </div>
            </div>

            {signMethod === SIGN_METHOD.DIGITAL ? (
              <DigitalAgreementPanel
                downloadLabel={getFieldValue(
                  fields?.downloadDraftLabel,
                  'Click to download your draft E-agreement copy'
                )}
                downloadCTA={getFieldValue(fields?.downloadCTALabel, 'Download')}
                termsText={getFieldValue(
                  fields?.agreementTermsText,
                  'I confirm that I have read and accepted the agreement terms. My submission serves as my electronic signature, legally binding under the applicable Dubai and UAE laws.'
                )}
                termsAccepted={termsAccepted}
                onTermsChange={setTermsAccepted}
                onDownload={downloadContract}
              />
            ) : null}

            <div className="btn-wrapper flex justify-end">
              <button
                type="button"
                className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase ${
                  isConfirmDisabled ? 'disabled' : ''
                }`}
                disabled={isConfirmDisabled}
                onClick={handleConfirmMethod}
              >
                {getFieldValue(fields?.confirmCTALabel, 'Confirm')}
              </button>
            </div>
          </>
        ) : (
          <>
            <PhysicalSchedulePanel
              title={getFieldValue(
                fields?.physicalScheduleTitle,
                'Schedule delivery or collection of your documents'
              )}
              collectionIcon={renderIcon(
                fields?.collectionIcon,
                <DocumentIcon className="w-7 h-9 md:w-[55px] md:h-[48px]" />
              )}
              collectionTitle={getFieldValue(fields?.collectionTitle, 'Collection from home')}
              collectionDescription={getFieldValue(
                fields?.collectionDescription,
                'Download, print and sign the contract and then request pickup from your home address.'
              )}
              deliveryIcon={renderIcon(
                fields?.deliveryIcon,
                <DocumentIcon className="w-7 h-9 md:w-[55px] md:h-[48px]" />
              )}
              deliveryTitle={getFieldValue(fields?.deliveryTitle, 'Delivery to your home')}
              deliveryDescription={getFieldValue(
                fields?.deliveryDescription,
                'Schedule delivery of the physical copies of your renewal documents to your home address. Upon receipt, sign them and schedule collection from your residence to our offices.'
              )}
              physicalOption={physicalOption}
              onSelectOption={setPhysicalOption}
              documentsReadyTitle={getFieldValue(
                fields?.documentsReadyTitle,
                'Keep these documents ready for collection'
              )}
              documentsReadyDescription={getFieldValue(
                fields?.documentsReadyDescription,
                'Please ensure you have signed physical copies of the documents below for collection.'
              )}
              documentsDeliveredTitle={getFieldValue(
                fields?.documentsDeliveredTitle,
                'These documents will be delivered to you'
              )}
              documentsDeliveredDescription={getFieldValue(
                fields?.documentsDeliveredDescription,
                'Please schedule the delivery of these documents to your home address. Once received, kindly sign them and contact our call center team to arrange collection from your home address.'
              )}
              renewalProposalLabel={getFieldValue(fields?.renewalProposalLabel, 'Renewal proposal')}
              pdcDocumentLabel={getFieldValue(fields?.pdcDocumentLabel, 'Post dated cheques')}
              directDebitFormLabel={getFieldValue(
                fields?.directDebitFormLabel,
                'Direct Debit Form'
              )}
              creditCardSideLetterLabel={getFieldValue(
                fields?.thirdPartyLetterLabel,
                'Side letter for credit card'
              )}
              directDebitSideLetterLabel={getFieldValue(
                fields?.directDebitSideLetterLabel,
                'Side letter for direct debit'
              )}
              viewPdcCTALabel={getFieldValue(fields?.viewPdcCTALabel, 'View PDCs')}
              physicalScheduleDocuments={physicalScheduleDocuments}
              onDownloadProposal={downloadContract}
              onDownloadDirectDebit={downloadDirectDebitForm}
              onDownloadCreditCardSideLetter={downloadThirdPartyLetter}
              onDownloadDirectDebitSideLetter={downloadDirectDebitSideLetter}
              onViewPdc={handleViewPdc}
            />

            <ViewPDCModal
              installmentsDetails={installmentsPDCDetails}
              selectedInstallmentIndex={selectedPdcInstallmentIndex}
              selectedPaymentPlan={selectedPaymentPlan}
            />

            <div className="btn-wrapper flex justify-end">
              <button
                type="button"
                className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase ${
                  isProceedDisabled ? 'disabled' : ''
                }`}
                disabled={isProceedDisabled}
                onClick={handleProceedPhysicalSchedule}
              >
                {getFieldValue(fields?.proceedCTALabel, 'Proceed')}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
