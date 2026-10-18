'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUserStore } from 'src/store/useUserStore';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { CustomLink, CustomRichText, Text } from 'src/common/SitecoreOverrides';
import MoveOutStepper from '../Stepper/MoveOutStepper';
import InfoMessage from 'components/InfoMessage';
import CircleInfoIcon from 'assets/icons/CircleInfoIcon';

type BankOption = {
  Description?: string;
  BankCode?: string;
};

const maskAccountNumber = (value: string) => {
  if (!value) return '-';
  if (value.length <= 4) return value;
  return `${'X'.repeat(value.length - 4)}${value.slice(-4)}`;
};

export default function MoveOutRefundInProgress({ fields }: any) {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();

  const [bankDetails, setBankDetails] = useState<BankOption[]>([]);
  const [averageProcessingDays, setAverageProcessingDays] = useState<number>(25);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [modeOfPayment, setModeOfPayment] = useState('EFT');
  const [accountNumber, setAccountNumber] = useState('');

  const { mutate: getCurrencyCountryBankDetail, isPending: isLoadingBankReference } =
    useApiMutation<any, any>(() => '/moveout/GetCurrencyCountryBankDetail', 'GET', false);

  const { mutate: fetchRefundBankDetails, isPending: isLoadingRefundDetails } = useApiMutation<
    any,
    any
  >(() => `/MoveOut/FetchRefundBankDetails/${tCode}`, 'GET', false);

  useEffect(() => {
    if (!tCode) return;

    getCurrencyCountryBankDetail(null, {
      onSuccess: (response) => {
        const apiData = response?.FetchCurrencyCountryBankDetails;
        setBankDetails(apiData?.BankDetail || []);
        if (response?.AverageProcessingTimeInDays) {
          setAverageProcessingDays(Number(response.AverageProcessingTimeInDays));
        }
      },
      onError: () => openModal('error-modal'),
    });

    fetchRefundBankDetails(null, {
      onSuccess: (response) => {
        const details = response?.RefundBankDetails?.DAM_RES_Refund_Bank_Details;
        if (!details) return;

        setBeneficiaryName(details.Beneficiary_Name || '');
        setSelectedBank(details.Beneficiary_Bank || '');
        setModeOfPayment(details.Pay_Mode || '');
        setAccountNumber(details.Account_Number || '');
      },
      onError: () => openModal('error-modal'),
    });
  }, [tCode]);

  const beneficiaryBankDisplay = useMemo(() => {
    if (!selectedBank) return '-';
    const selectedBankOption = bankDetails.find((option) => option?.BankCode === selectedBank);
    return selectedBankOption?.Description || selectedBank;
  }, [bankDetails, selectedBank]);

  const paymentModeDisplay = modeOfPayment || 'EFT';

  const isLoading = isLoadingBankReference || isLoadingRefundDetails;

  return (
    <>
      <MoveOutStepper />
      <section className="MoveOutRefundInProgress my-6 md:my-8">
        <div className="container-sm flex flex-col gap-6">
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8">
            <div className="flex flex-col gap-3 md:gap-5">
              <div className="flex items-center gap-4">
                <span className="shrink-0 flex items-center justify-center [&_svg]:size-8">
                  <CustomRichText field={fields?.titleIcon} />
                </span>
                <Text
                  tag="h1"
                  field={fields?.title}
                  className="text-base md:text-heading-3 font-normal text-navy-500 m-0"
                />
              </div>
              <div className="text-body font-light text-navy-500">
                <Text tag="span" field={fields?.processingTimePrefix} />
                <span>{` ${averageProcessingDays} `}</span>
                <Text tag="span" field={fields?.processingTimeSuffix} />
              </div>

              <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-8 md:gap-y-3">
                <div className="text-body text-navy-500">
                  <Text tag="span" field={fields?.beneficiaryNameLabel} className="font-light" />
                  <span className="font-medium">{` ${beneficiaryName || '-'}`}</span>
                </div>
                <div className="text-body text-navy-500">
                  <Text tag="span" field={fields?.beneficiaryBankLabel} className="font-light" />
                  <span className="font-medium">{` ${beneficiaryBankDisplay}`}</span>
                </div>
                <div className="text-body text-navy-500">
                  <Text tag="span" field={fields?.paymentMethodLabel} className="font-light" />
                  <span className="font-medium">{` ${paymentModeDisplay}`}</span>
                </div>
                <div className="text-body text-navy-500">
                  <Text tag="span" field={fields?.accountNumberLabel} className="font-light" />
                  <span className="font-medium">{` ${maskAccountNumber(accountNumber)}`}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4 text-body text-navy-500">
                <span className="shrink-0 flex items-center justify-center [&_svg]:size-8">
                  <CustomRichText field={fields?.phoneIcon} />
                </span>
                <span className="font-light">
                  <Text tag="span" field={fields?.queryPrefixText} />
                  <span className="font-medium">{` ${
                    fields?.customerCareNumber?.value || '-'
                  }`}</span>
                </span>
              </div>
            </div>
            <InfoMessage IconComponent={CircleInfoIcon} status="warning" className="my-5 md:my-6">
              <p className="text-body">{fields?.warningMessage.value}</p>
            </InfoMessage>
          </div>
          <div className="flex justify-end">
            <CustomLink
              field={fields?.backToHomeLink}
              className="btn btn-primary w-full md:w-68.75 h-11 md:h-15"
            >
              {fields?.backToHomeText?.value}
            </CustomLink>
          </div>

          {isLoading && (
            <div className="text-body-sm font-light text-navy-400 text-center">
              {fields?.loadingText?.value}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
