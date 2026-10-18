'use client';

import CircleTickIcon from 'assets/icons/CircleTickIcon';
import InfoMessage from 'components/InfoMessage';
import { Accordion } from 'components/common/Accordion';
import { Text } from 'src/common/SitecoreOverrides';

import RenewalStepper from '../Stepper/RenewalsStepper';
import RenewalSummarySkeleton from './RenewalSummarySkeleton';
import { useRenewalSummary } from './useRenewalSummary';

export default function RenewalSummary({ fields }: any) {
  const {
    isLoading,
    isPhysicalSigning,
    documentsReceivedDateLabel,
    leasePeriodLabel,
    installmentCount,
    totalPaymentLabel,
    installments,
  } = useRenewalSummary({
    card: fields?.paymentUsingCardLabel?.value || 'Payment using Card',
    cheque: fields?.paymentUsingChequeLabel?.value || 'Payment using Cheque',
    directDebit: fields?.paymentUsingDirectDebitLabel?.value || 'Payment using Direct Debit',
    cardEnding: fields?.cardEndingLabel?.value || 'Card ending in',
  });

  if (isLoading) {
    return (
      <section className="RenewalSummary contract-renewal">
        <RenewalStepper />
        <RenewalSummarySkeleton />
      </section>
    );
  }

  const installmentCountLabel = `${installmentCount} ${
    fields?.installmentsLabel?.value || 'Instalments'
  }`;
  const confirmationMessageField = isPhysicalSigning
    ? fields?.physicalConfirmationMessage
    : fields?.digitalConfirmationMessage;

  return (
    <section className="RenewalSummary contract-renewal">
      <RenewalStepper />

      <div className="container-sm py-8 md:py-10 relative lg:static flex flex-col gap-5 md:gap-6">
        {documentsReceivedDateLabel ? (
          <p className="text-body font-light text-navy-500">
            {(
              fields?.documentsReceivedMessage?.value ||
              'Your signed lease documents were received on {date}.'
            ).replace('{date}', documentsReceivedDateLabel)}
          </p>
        ) : null}

        <InfoMessage IconComponent={CircleTickIcon} status="success">
          <Text
            tag="p"
            field={confirmationMessageField}
            className="text-body font-light text-navy-500"
          />
        </InfoMessage>

        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
          <Text
            tag="h2"
            field={fields?.summaryTitle}
            className="text-body md:text-heading-3 font-medium text-navy-500"
          />

          <div className="border border-lilac-200 rounded-xl p-4 md:p-5 flex flex-col gap-2">
            <Text
              tag="p"
              field={fields?.leasePeriodLabel}
              className="text-body font-medium text-navy-500"
            />
            {leasePeriodLabel ? (
              <p className="text-body font-light text-navy-500">{leasePeriodLabel}</p>
            ) : null}
          </div>

          <div className="border border-lilac-200 rounded-xl p-4 md:p-5 flex flex-col gap-2">
            <Text
              tag="p"
              field={fields?.paymentScheduleLabel}
              className="text-body font-medium text-navy-500"
            />
            {installmentCount ? (
              <p className="text-body font-light text-navy-500">{installmentCountLabel}</p>
            ) : null}
            {totalPaymentLabel ? (
              <p className="text-body font-light text-navy-500">
                {fields?.totalPaymentLabel?.value || 'Total payment:'} {totalPaymentLabel}
              </p>
            ) : null}
          </div>

          <div className="border border-lilac-200 rounded-xl px-4 md:px-5">
            <Accordion
              title={fields?.paymentMethodLabel}
              defaultOpen
              version={2}
              className="!border-b-0 !py-4 md:!py-5"
            >
              <div className="flex flex-col">
                {installments.map((installment, index) => (
                  <div
                    key={installment.number}
                    className={`flex flex-col gap-1 py-4 ${
                      index < installments.length - 1 ? 'border-b border-lilac-100' : ''
                    }`}
                  >
                    <p className="text-body font-light text-navy-500">
                      {fields?.installmentLabel?.value || 'Instalment'} {installment.number} -{' '}
                      {installment.methodLabel}
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4">
                      <p className="text-body font-light text-navy-400">{installment.dateLabel}</p>
                      {installment.cardEnding ? (
                        <p className="text-body font-light text-navy-400">
                          {installment.cardEnding}
                        </p>
                      ) : null}
                      <p className="text-body font-light text-navy-500 md:text-right md:min-w-36">
                        {installment.amountLabel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
