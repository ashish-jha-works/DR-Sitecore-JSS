'use client';

import { ReactNode } from 'react';

import CalendarIcon from 'assets/icons/CalendarIcon';
import CircleErrorIcon from 'assets/icons/CircleErrorIcon';
import DocumentIcon from 'assets/icons/DocumentIcon';
import DownloadIcon from 'assets/icons/DownloadIcon';
import EditIcon from 'assets/icons/EditIcon';
import EmailIcon from 'assets/icons/EmailIcon';
import ViewPDCModal from 'components/Renewals/PaymentPlan/PaymentSchedule/ViewPDCModal';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';

import RenewalStepper from '../Stepper/RenewalsStepper';
import CollectionScheduledSkeleton from './CollectionScheduledSkeleton';
import RescheduleCollectionModal from './RescheduleCollectionModal';
import { useCollectionScheduled } from './useCollectionScheduled';

function DocumentRow({
  label,
  icon,
  actionType,
  actionLabel,
  onAction,
}: {
  label: string;
  icon: ReactNode;
  actionType: 'download' | 'view';
  actionLabel?: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-3 min-w-0">
        {icon}
        <p className="text-body font-light text-navy-500 truncate">{label}</p>
      </div>
      <button
        type="button"
        className="shrink-0 text-lilac-500 cursor-pointer"
        onClick={onAction}
        aria-label={actionType === 'view' ? `View ${label}` : `Download ${label}`}
      >
        {actionType === 'view' ? (
          <span className="text-body-xs uppercase font-medium underline">{actionLabel}</span>
        ) : (
          <DownloadIcon className="size-7" />
        )}
      </button>
    </div>
  );
}

export default function CollectionScheduled({ fields }: any) {
  const {
    isLoading,
    isDelivery,
    addressParts,
    scheduledDateLabel,
    scheduledTimeSlot,
    isRescheduleDisabled,
    physicalScheduleDocuments,
    selectedPaymentPlan,
    installmentsPDCDetails,
    selectedPdcInstallmentIndex,
    downloadContract,
    downloadDirectDebitForm,
    downloadThirdPartyLetter,
    downloadDirectDebitSideLetter,
    handleViewPdc,
    handleReschedule,
    handleCheckRenewalSummary,
    rescheduleSelectedDate,
    rescheduleSelectedSlot,
    setRescheduleSelectedSlot,
    handleSelectRescheduleDate,
    availableDateKeys,
    rescheduleTimeSlots,
    isRescheduleSubmitting,
    handleConfirmReschedule,
    handleCloseRescheduleModal,
  } = useCollectionScheduled();

  if (isLoading) {
    return (
      <section className="CollectionScheduled contract-renewal">
        <RenewalStepper />
        <CollectionScheduledSkeleton />
      </section>
    );
  }

  const titleField = isDelivery ? fields?.deliveryTitle : fields?.collectionTitle;
  const descriptionField = isDelivery ? fields?.deliveryDescription : fields?.collectionDescription;
  const addressLabelField = isDelivery
    ? fields?.deliveryAddressLabel
    : fields?.collectionAddressLabel;
  const dateTimeLabelField = isDelivery
    ? fields?.deliveryDateTimeLabel
    : fields?.collectionDateTimeLabel;
  const reminderTitleField = isDelivery
    ? fields?.deliveryReminderTitle
    : fields?.collectionReminderTitle;
  const reminderDescriptionField = isDelivery
    ? fields?.deliveryReminderDescription
    : fields?.collectionReminderDescription;

  const cityPoLine = [addressParts.city, addressParts.poBox].filter(Boolean).join(', ');

  const documentRows: ReactNode[] = [];
  const appendRow = (row: ReactNode) => {
    if (documentRows.length > 0) {
      documentRows.push(
        <div key={`divider-${documentRows.length}`} className="border-t border-lilac-100 my-4" />
      );
    }
    documentRows.push(row);
  };

  if (physicalScheduleDocuments.showRenewalProposal) {
    appendRow(
      <DocumentRow
        key="renewal-proposal"
        label={fields?.renewalProposalLabel?.value || 'Renewal proposal'}
        icon={<DocumentIcon className="size-7 text-lilac-500" />}
        actionType="download"
        onAction={downloadContract}
      />
    );
  }

  if (physicalScheduleDocuments.showPdcDocument) {
    appendRow(
      <DocumentRow
        key="pdc"
        label={fields?.pdcDocumentLabel?.value || 'Post dated cheques'}
        icon={<DocumentIcon className="size-7 text-lilac-500" />}
        actionType="view"
        actionLabel={fields?.viewPdcCTALabel?.value || 'View PDCs'}
        onAction={handleViewPdc}
      />
    );
  }

  if (physicalScheduleDocuments.showCreditCardSideLetter) {
    appendRow(
      <DocumentRow
        key="credit-card-side-letter"
        label={fields?.creditCardSideLetterLabel?.value || 'Side letter for credit card'}
        icon={<EmailIcon className="size-7 text-lilac-500" />}
        actionType="download"
        onAction={downloadThirdPartyLetter}
      />
    );
  }

  if (physicalScheduleDocuments.showDirectDebitDocument) {
    appendRow(
      <DocumentRow
        key="direct-debit-form"
        label={fields?.directDebitFormLabel?.value || 'Direct Debit Form'}
        icon={<EditIcon className="size-5 text-lilac-500" />}
        actionType="download"
        onAction={downloadDirectDebitForm}
      />
    );
  }

  if (physicalScheduleDocuments.showDirectDebitSideLetter) {
    appendRow(
      <DocumentRow
        key="direct-debit-side-letter"
        label={fields?.directDebitSideLetterLabel?.value || 'Side letter for direct debit'}
        icon={<EmailIcon className="size-7 text-lilac-500" />}
        actionType="download"
        onAction={downloadDirectDebitSideLetter}
      />
    );
  }

  return (
    <section className="CollectionScheduled contract-renewal">
      <RenewalStepper />

      <div className="container-sm py-8 md:py-10 relative lg:static flex flex-col gap-5 md:gap-6">
        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="flex items-center gap-3 md:gap-4">
              <CustomRichText field={fields?.headingIcon} className="shrink-0 [&_svg]:size-8" />
              <Text
                tag="h1"
                field={titleField}
                className="text-body md:text-heading-3 font-normal text-navy-500"
              />
            </div>
            <Text tag="p" field={descriptionField} className="text-body font-light text-navy-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
            <div className="flex flex-col gap-2">
              <Text
                tag="h3"
                field={addressLabelField}
                className="text-body font-medium text-navy-500"
              />
              {addressParts.addressLine1 ? (
                <p className="text-body font-light text-navy-500">{addressParts.addressLine1}</p>
              ) : null}
              {addressParts.addressLine2 ? (
                <p className="text-body font-light text-navy-500">{addressParts.addressLine2}</p>
              ) : null}
              {cityPoLine ? (
                <p className="text-body font-light text-navy-500">{cityPoLine}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Text
                tag="h3"
                field={dateTimeLabelField}
                className="text-body font-medium text-navy-500"
              />
              {scheduledDateLabel ? (
                <p className="text-body font-light text-navy-500">{scheduledDateLabel}</p>
              ) : null}
              {scheduledTimeSlot ? (
                <p className="text-body font-light text-navy-500">{scheduledTimeSlot}</p>
              ) : null}

              <button
                type="button"
                className={`btn btn-secondary w-full md:w-68.75 h-11 md:h-15 uppercase mt-3 inline-flex items-center justify-center gap-2 ${
                  isRescheduleDisabled ? 'disabled' : ''
                }`}
                disabled={isRescheduleDisabled}
                onClick={handleReschedule}
              >
                <CalendarIcon width={20} height={20} />
                {fields?.rescheduleCTALabel?.value || 'RESCHEDULE'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
          <div className="flex items-start gap-3 md:gap-4">
            <CircleErrorIcon className="shrink-0 text-warning-500 size-5 md:size-6" />
            <div className="flex flex-col gap-2">
              <Text
                tag="p"
                field={reminderTitleField}
                className="text-body font-medium text-navy-500"
              />
              <Text
                tag="p"
                field={reminderDescriptionField}
                className="text-body font-light text-navy-500"
              />
            </div>
          </div>

          <div className="flex flex-col">{documentRows}</div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="btn btn-primary w-full md:w-auto min-w-68.75 h-11 md:h-15 uppercase px-8"
            onClick={handleCheckRenewalSummary}
          >
            {fields?.checkRenewalSummaryCTALabel?.value || 'CHECK RENEWAL SUMMARY'}
          </button>
        </div>
      </div>

      <ViewPDCModal
        installmentsDetails={installmentsPDCDetails}
        selectedInstallmentIndex={selectedPdcInstallmentIndex}
        selectedPaymentPlan={selectedPaymentPlan}
      />

      <RescheduleCollectionModal
        fields={fields}
        isDelivery={isDelivery}
        selectedDate={rescheduleSelectedDate}
        selectedSlot={rescheduleSelectedSlot}
        availableDateKeys={availableDateKeys}
        timeSlots={rescheduleTimeSlots}
        isSubmitting={isRescheduleSubmitting}
        onSelectDate={handleSelectRescheduleDate}
        onSelectSlot={setRescheduleSelectedSlot}
        onConfirm={handleConfirmReschedule}
        onClose={handleCloseRescheduleModal}
      />
    </section>
  );
}
