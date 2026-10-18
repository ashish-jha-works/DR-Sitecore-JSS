import { ReactNode } from 'react';

import CircleErrorIcon from 'assets/icons/CircleErrorIcon';
import DocumentIcon from 'assets/icons/DocumentIcon';
import DownloadIcon from 'assets/icons/DownloadIcon';
import EditIcon from 'assets/icons/EditIcon';
import EmailIcon from 'assets/icons/EmailIcon';

import SignOptionCard from './SignOptionCard';
import type { PhysicalScheduleDocumentVisibility } from './renewalSignContractDocumentRules';
import type { PhysicalScheduleOption } from './renewalSignContract.types';
import { PHYSICAL_SCHEDULE_OPTION } from './renewalSignContractConstants';

interface PhysicalSchedulePanelProps {
  title: string;
  collectionIcon: ReactNode;
  collectionTitle: string;
  collectionDescription: string;
  deliveryIcon: ReactNode;
  deliveryTitle: string;
  deliveryDescription: string;
  physicalOption: PhysicalScheduleOption;
  onSelectOption: (value: PhysicalScheduleOption) => void;
  documentsReadyTitle: string;
  documentsReadyDescription: string;
  documentsDeliveredTitle: string;
  documentsDeliveredDescription: string;
  renewalProposalLabel: string;
  pdcDocumentLabel: string;
  directDebitFormLabel: string;
  creditCardSideLetterLabel: string;
  directDebitSideLetterLabel: string;
  viewPdcCTALabel: string;
  physicalScheduleDocuments: PhysicalScheduleDocumentVisibility;
  onDownloadProposal: () => void;
  onDownloadDirectDebit: () => void;
  onDownloadCreditCardSideLetter: () => void;
  onDownloadDirectDebitSideLetter: () => void;
  onViewPdc: () => void;
}

export default function PhysicalSchedulePanel({
  title,
  collectionIcon,
  collectionTitle,
  collectionDescription,
  deliveryIcon,
  deliveryTitle,
  deliveryDescription,
  physicalOption,
  onSelectOption,
  documentsReadyTitle,
  documentsReadyDescription,
  documentsDeliveredTitle,
  documentsDeliveredDescription,
  renewalProposalLabel,
  pdcDocumentLabel,
  directDebitFormLabel,
  creditCardSideLetterLabel,
  directDebitSideLetterLabel,
  viewPdcCTALabel,
  physicalScheduleDocuments,
  onDownloadProposal,
  onDownloadDirectDebit,
  onDownloadCreditCardSideLetter,
  onDownloadDirectDebitSideLetter,
  onViewPdc,
}: PhysicalSchedulePanelProps) {
  const isCollectionSelected = physicalOption === PHYSICAL_SCHEDULE_OPTION.COLLECTION;
  const isDeliverySelected = physicalOption === PHYSICAL_SCHEDULE_OPTION.DELIVERY;

  const documentRows = buildDocumentRows({
    physicalScheduleDocuments,
    renewalProposalLabel,
    pdcDocumentLabel,
    directDebitFormLabel,
    creditCardSideLetterLabel,
    directDebitSideLetterLabel,
    viewPdcCTALabel,
    onDownloadProposal,
    onDownloadDirectDebit,
    onDownloadCreditCardSideLetter,
    onDownloadDirectDebitSideLetter,
    onViewPdc,
  });

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col">
        <h2 className="text-body md:text-heading-3 font-normal text-navy-500 mb-4 md:mb-6">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full md:w-max">
          <SignOptionCard
            id="physical-collection"
            name="physical-schedule"
            value={PHYSICAL_SCHEDULE_OPTION.COLLECTION}
            selected={isCollectionSelected}
            onSelect={(value) => onSelectOption(value as PhysicalScheduleOption)}
            icon={collectionIcon}
            iconSize="schedule"
            title={collectionTitle}
            description={collectionDescription}
          />
          <SignOptionCard
            id="physical-delivery"
            name="physical-schedule"
            value={PHYSICAL_SCHEDULE_OPTION.DELIVERY}
            selected={isDeliverySelected}
            onSelect={(value) => onSelectOption(value as PhysicalScheduleOption)}
            icon={deliveryIcon}
            iconSize="schedule"
            title={deliveryTitle}
            description={deliveryDescription}
          />
        </div>
      </div>

      {isCollectionSelected ? (
        <ScheduleDocumentsSection
          title={documentsReadyTitle}
          description={documentsReadyDescription}
        >
          {documentRows}
        </ScheduleDocumentsSection>
      ) : null}

      {isDeliverySelected ? (
        <ScheduleDocumentsSection
          title={documentsDeliveredTitle}
          description={documentsDeliveredDescription}
        >
          {documentRows}
        </ScheduleDocumentsSection>
      ) : null}
    </div>
  );
}

function buildDocumentRows({
  physicalScheduleDocuments,
  renewalProposalLabel,
  pdcDocumentLabel,
  directDebitFormLabel,
  creditCardSideLetterLabel,
  directDebitSideLetterLabel,
  viewPdcCTALabel,
  onDownloadProposal,
  onDownloadDirectDebit,
  onDownloadCreditCardSideLetter,
  onDownloadDirectDebitSideLetter,
  onViewPdc,
}: {
  physicalScheduleDocuments: PhysicalScheduleDocumentVisibility;
  renewalProposalLabel: string;
  pdcDocumentLabel: string;
  directDebitFormLabel: string;
  creditCardSideLetterLabel: string;
  directDebitSideLetterLabel: string;
  viewPdcCTALabel: string;
  onDownloadProposal: () => void;
  onDownloadDirectDebit: () => void;
  onDownloadCreditCardSideLetter: () => void;
  onDownloadDirectDebitSideLetter: () => void;
  onViewPdc: () => void;
}) {
  const rows: ReactNode[] = [];

  const appendRow = (row: ReactNode) => {
    if (rows.length > 0) {
      rows.push(<div key={`divider-${rows.length}`} className="border-t border-lilac-100 my-4" />);
    }
    rows.push(row);
  };

  if (physicalScheduleDocuments.showRenewalProposal) {
    appendRow(
      <DocumentRow
        key="renewal-proposal"
        label={renewalProposalLabel}
        icon={<DocumentIcon className="size-7 text-lilac-500" />}
        actionType="download"
        onAction={onDownloadProposal}
      />
    );
  }

  if (physicalScheduleDocuments.showPdcDocument) {
    appendRow(
      <DocumentRow
        key="pdc"
        label={pdcDocumentLabel}
        icon={<DocumentIcon className="size-7 text-lilac-500" />}
        actionType="view"
        actionLabel={viewPdcCTALabel}
        onAction={onViewPdc}
      />
    );
  }

  if (physicalScheduleDocuments.showCreditCardSideLetter) {
    appendRow(
      <DocumentRow
        key="credit-card-side-letter"
        label={creditCardSideLetterLabel}
        icon={<EmailIcon className="size-7 text-lilac-500" />}
        actionType="download"
        onAction={onDownloadCreditCardSideLetter}
      />
    );
  }

  if (physicalScheduleDocuments.showDirectDebitDocument) {
    appendRow(
      <DocumentRow
        key="direct-debit-form"
        label={directDebitFormLabel}
        icon={<EditIcon className="size-5 text-lilac-500" />}
        actionType="download"
        onAction={onDownloadDirectDebit}
      />
    );
  }

  if (physicalScheduleDocuments.showDirectDebitSideLetter) {
    appendRow(
      <DocumentRow
        key="direct-debit-side-letter"
        label={directDebitSideLetterLabel}
        icon={<EmailIcon className="size-7 text-lilac-500" />}
        actionType="download"
        onAction={onDownloadDirectDebitSideLetter}
      />
    );
  }

  return rows;
}

function ScheduleDocumentsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
      <div className="flex items-start gap-3 md:gap-4">
        <CircleErrorIcon className="shrink-0 text-warning-500 size-5 md:size-6" />
        <div className="flex flex-col gap-2">
          <p className="text-body font-medium text-navy-500">{title}</p>
          <p className="text-body font-light text-navy-500">{description}</p>
        </div>
      </div>

      <div className="flex flex-col">{children}</div>
    </div>
  );
}

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
