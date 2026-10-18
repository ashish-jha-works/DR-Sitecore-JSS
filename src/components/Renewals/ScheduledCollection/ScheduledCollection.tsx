'use client';

import { ReactNode } from 'react';

import CircleErrorIcon from 'assets/icons/CircleErrorIcon';
import CircleInfoIcon from 'assets/icons/CircleInfoIcon';
import DocumentIcon from 'assets/icons/DocumentIcon';
import DownloadIcon from 'assets/icons/DownloadIcon';
import EditIcon from 'assets/icons/EditIcon';
import EmailIcon from 'assets/icons/EmailIcon';
import AvailableCalendar from 'components/common/AvailableCalendar';
import { Input } from 'components/common/Input';
import { Radio } from 'components/common/Radio';
import InfoMessage from 'components/InfoMessage';
import ViewPDCModal from 'components/Renewals/PaymentPlan/PaymentSchedule/ViewPDCModal';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';

import RenewalStepper from '../Stepper/RenewalsStepper';
import ScheduledCollectionSkeleton from './ScheduledCollectionSkeleton';
import { useScheduledCollection } from './useScheduledCollection';

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

export default function ScheduledCollection({ fields }: any) {
  const {
    isLoading,
    isDelivery,
    selectedDate,
    selectedSlot,
    setSelectedSlot,
    handleSelectDate,
    availableDateKeys,
    timeSlots,
    addressForm,
    addressErrors,
    isAddressEditing,
    handleEditAddress,
    handleCancelAddress,
    handleSaveAddress,
    updateAddressField,
    handleMobileChange,
    physicalScheduleDocuments,
    selectedPaymentPlan,
    installmentsPDCDetails,
    selectedPdcInstallmentIndex,
    downloadContract,
    downloadDirectDebitForm,
    downloadThirdPartyLetter,
    downloadDirectDebitSideLetter,
    handleViewPdc,
    isScheduleEnabled,
    isSubmitting,
    handleSchedule,
  } = useScheduledCollection();

  if (isLoading) {
    return (
      <section className="ScheduledCollection contract-renewal">
        <RenewalStepper />
        <ScheduledCollectionSkeleton />
      </section>
    );
  }

  const documentsTitleField = isDelivery
    ? fields?.documentsDeliveredTitle
    : fields?.documentsReadyTitle;
  const documentsDescriptionField = isDelivery
    ? fields?.documentsDeliveredDescription
    : fields?.documentsReadyDescription;
  const titleField = isDelivery ? fields?.deliveryTitle : fields?.title;
  const descriptionField = isDelivery ? fields?.deliveryDescription : fields?.description;
  const addressDescriptionField = isDelivery
    ? fields?.deliveryAddressDescription
    : fields?.addressDescription;

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
    <section className="ScheduledCollection contract-renewal">
      <RenewalStepper />

      <div className="container-sm py-8 md:py-10 relative lg:static flex flex-col gap-5 md:gap-6">
        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col">
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

          <InfoMessage IconComponent={CircleInfoIcon} status="warning" className="mt-4 md:mt-3">
            <Text
              tag="p"
              field={fields?.holidayBannerText}
              className="text-body font-light text-navy-500"
            />
          </InfoMessage>

          <div className="grid md:grid-cols-2 gap-0 lg:gap-6 mt-4 md:mt-6">
            <AvailableCalendar
              selectedDate={selectedDate}
              onSelect={handleSelectDate}
              availableDateKeys={availableDateKeys}
            />

            <div className="pb-0 px-0 pt-0 lg:px-4 lg:pb-4 lg:pt-0 flex flex-col justify-center gap-3">
              {!selectedDate ? (
                <Text
                  tag="p"
                  field={fields?.timeslotSelectionMessage}
                  className="text-navy-400 text-body font-light text-center"
                />
              ) : (
                timeSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.label;
                  const isDisabled = slot.disabled;

                  return (
                    <Radio
                      key={slot.label}
                      id={`collection-slot-${slot.label}`}
                      name="collection-time-slot"
                      value={slot.label}
                      label={slot.label}
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => !isDisabled && setSelectedSlot(slot.label)}
                      className={`border flex-row-reverse w-full justify-between rounded-lg p-3 md:p-4 text-left transition text-body mb-0 ${
                        isDisabled
                          ? 'bg-silver-chalice-300 opacity-100 border-0 cursor-not-allowed'
                          : isSelected
                          ? 'bg-lilac-100 border-lilac-400'
                          : 'bg-white-pure border-lilac-300 hover:bg-lilac-50'
                      }`}
                      inputClassName={`h-4! w-4! ${
                        isDisabled ? 'appearance-none border rounded-full' : ''
                      }`}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="flex items-center gap-3 md:gap-4">
              <CustomRichText field={fields?.addressIcon} className="shrink-0 [&_svg]:size-8" />
              <Text
                tag="h2"
                field={fields?.addressTitle}
                className="text-body md:text-heading-3 font-normal text-navy-500"
              />
            </div>
            <Text
              tag="p"
              field={addressDescriptionField}
              className="text-body font-light text-navy-500"
            />
          </div>

          <div className="form-group grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-10">
            <div className="flex flex-col">
              <Input
                label={fields?.addressLine1Label?.value || 'Address line 1*'}
                value={addressForm.addressLine1}
                onChange={updateAddressField('addressLine1')}
                disabled={!isAddressEditing}
                showClearButton={isAddressEditing}
                maxLength={50}
                error={addressErrors.addressLine1}
              />
              <Input
                label={fields?.poBoxLabel?.value || 'PO box*'}
                value={addressForm.poBox}
                onChange={updateAddressField('poBox')}
                disabled={!isAddressEditing}
                showClearButton={isAddressEditing}
                maxLength={10}
                error={addressErrors.poBox}
              />
              <Input
                label={fields?.emirateLabel?.value || 'Emirate*'}
                value={addressForm.emirate}
                disabled
                showClearButton={false}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <Input
                label={fields?.addressLine2Label?.value || 'Address line 2*'}
                value={addressForm.addressLine2}
                onChange={updateAddressField('addressLine2')}
                disabled={!isAddressEditing}
                showClearButton={isAddressEditing}
                maxLength={50}
                error={addressErrors.addressLine2}
              />
              <Input
                label={fields?.mobileNumberLabel?.value || 'Mobile number* (05X XXXXXXX)'}
                value={addressForm.contactNumber}
                onChange={handleMobileChange}
                disabled={!isAddressEditing}
                showClearButton={isAddressEditing}
                error={addressErrors.contactNumber}
              />
            </div>
          </div>

          <div className="flex justify-end">
            {isAddressEditing ? (
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 w-full md:w-auto">
                <button
                  type="button"
                  className="btn btn-secondary uppercase h-11 md:h-15 w-full md:w-68.75"
                  onClick={handleCancelAddress}
                >
                  {fields?.cancelCTALabel?.value || 'CANCEL'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary uppercase h-11 md:h-15 w-full md:w-68.75"
                  onClick={handleSaveAddress}
                >
                  {fields?.saveCTALabel?.value || 'SAVE'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
                onClick={handleEditAddress}
              >
                {fields?.editCTALabel?.value || 'EDIT'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
          <div className="flex items-start gap-3 md:gap-4">
            <CircleErrorIcon className="shrink-0 text-warning-500 size-5 md:size-6" />
            <div className="flex flex-col gap-2">
              <Text
                tag="p"
                field={documentsTitleField}
                className="text-body font-medium text-navy-500"
              />
              <Text
                tag="p"
                field={documentsDescriptionField}
                className="text-body font-light text-navy-500"
              />
            </div>
          </div>

          <div className="flex flex-col">{documentRows}</div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase ${
              !isScheduleEnabled ? 'disabled' : ''
            }`}
            disabled={!isScheduleEnabled}
            onClick={handleSchedule}
          >
            {isSubmitting
              ? fields?.schedulingCTALabel?.value || 'SCHEDULING...'
              : fields?.scheduleCTALabel?.value || 'SCHEDULE'}
          </button>
        </div>
      </div>

      <ViewPDCModal
        installmentsDetails={installmentsPDCDetails}
        selectedInstallmentIndex={selectedPdcInstallmentIndex}
        selectedPaymentPlan={selectedPaymentPlan}
      />
    </section>
  );
}
