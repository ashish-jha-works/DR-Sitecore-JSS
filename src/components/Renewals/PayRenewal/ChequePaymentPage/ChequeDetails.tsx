import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';
import { CustomRichText } from 'src/common/SitecoreOverrides';
import { Checkbox } from 'components/common/Checkbox';
import ChequeAccordion from './ChequeAccordion';
import { ChequeInstallment } from './ChequePaymentPage.types';

type ChequeDetailsProps = {
  fields: any;
  isSameBankForAllCheque: boolean;
  setIsSameBankForAllCheque: (value: boolean) => void;
  bankList: any[];
  installments: ChequeInstallment[];
  onChangeChequeNumber: (number: number, value: string) => void;
  onChangeBankName: (number: number, value: string) => void;
  onSaveInstallment: (number: number) => void;
  onCancelInstallment: (number: number) => void;
  onEditInstallment: (number: number) => void;
};

const ChequeDetails = ({
  fields,
  isSameBankForAllCheque,
  setIsSameBankForAllCheque,
  bankList,
  installments,
  onChangeChequeNumber,
  onChangeBankName,
  onSaveInstallment,
  onCancelInstallment,
  onEditInstallment,
}: ChequeDetailsProps) => {
  const hasMultipleInstallments = installments.length > 1;

  return (
    <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col gap-2 lg:gap-3">
        <div className="flex items-center gap-4">
          <CustomRichText field={fields?.chequeDetailsHeadingIcon} />
          <Text
            tag="h1"
            field={fields?.chequeDetailsHeading}
            className="text-[16px] md:text-[20px]"
          />
        </div>
        <div className="font-light text-body">
          <Text tag="p" field={fields?.chequeDetailsDesc} className="inline" />
        </div>
      </div>
      {hasMultipleInstallments ? (
        <div className="flex items-center gap-4 cursor-pointer">
          <Checkbox
            id="apply-same-bank-to-all-cheque"
            name="apply-same-bank-to-all-cheque"
            value="apply-same-bank-to-all-cheque"
            checked={isSameBankForAllCheque}
            onChange={setIsSameBankForAllCheque}
          >
            <p className="text-body font-light">
              {fields?.chequeBankNameToAllChequeOptionLabel?.value}{' '}
            </p>
          </Checkbox>
        </div>
      ) : null}
      <div className="space-y-4">
        {installments.map((item, index) => {
          const canSave = !!item.chequeNumber.trim() && !!item.bankName;
          const hasSavedCheque = item.savedChequeNumber !== null;
          const isDirty = hasSavedCheque
            ? item.chequeNumber !== item.savedChequeNumber ||
              item.bankName !== (item.savedBankName || '')
            : !!item.chequeNumber || !!item.bankName;
          // Hide Cancel on first empty fill; show after typing or when editing a saved cheque
          const showCancel = hasSavedCheque || isDirty;

          return (
            <ChequeAccordion
              key={item.number}
              fields={fields}
              installment={item}
              defaultOpen={index === 0}
              disableAccordion={!hasMultipleInstallments}
              bankList={bankList}
              chequeNumber={item.chequeNumber}
              bankName={item.bankName}
              status={item.status}
              canSave={canSave}
              showCancel={showCancel}
              isBankDisabled={hasMultipleInstallments && isSameBankForAllCheque && index !== 0}
              onChangeChequeNumber={(value: string) => onChangeChequeNumber(item.number, value)}
              onChangeBank={(value: string) => onChangeBankName(item.number, value)}
              onSave={() => onSaveInstallment(item.number)}
              onCancel={() => onCancelInstallment(item.number)}
              onEdit={() => onEditInstallment(item.number)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChequeDetails;
