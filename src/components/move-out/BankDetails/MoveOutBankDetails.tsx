'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import ArrowLeft from 'assets/icons/ArrowLeft';
import { Radio } from 'components/common/Radio';
import { Input } from 'components/common/Input';
import Select from 'components/common/Select';
import { Checkbox } from 'components/common/Checkbox';
import CancelMoveOutModal from 'components/modals/CancelMoveOutModal';
import MoveOutOutstandingPayment from './MoveOutOutstandingPayment';
import MoveOutBankDetailsSkeleton from './MoveOutBankDetailsSkeleton';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';
import MoveOutStepper from '../Stepper/MoveOutStepper';
import {
  getPostBankDetailsRoute,
  getPostBankDetailsStepperPayload,
  hasMoveOutUtilities,
  setCachedHasMoveOutUtilities,
} from '../Stepper/moveOutNoUtilities';
import { CustomRichText } from 'src/common/SitecoreOverrides';

const PAYMENT_OPTION_VALUES = ['TR', 'OB', 'TT'] as const;

const UAE_PAYABLE_COUNTRY = 'United Arab Emirates';
const UAE_PAY_CURRENCY = 'United Arab Emirates Dirhams';

const INPUT_STYLE_LABEL_CLASS = 'block text-body font-light mb-2';

type ApiOption = {
  Description?: string;
  BankCode?: string;
  BankType?: string;
  CountryCode?: string;
  CurrencyCode?: string;
};

const MoveOutBankDetails: React.FC<{ fields?: any }> = ({ fields = {} }) => {
  const router = useRouter();
  const { openModal } = useUIStore();
  const { tCode, Email } = useUserStore();

  const [paymentMode, setPaymentMode] = useState<string>();
  const [confirmTransfer, setConfirmTransfer] = useState(false);

  const [bankDetails, setBankDetails] = useState<ApiOption[]>([]);
  const [countryDetails, setCountryDetails] = useState<ApiOption[]>([]);
  const [currencyDetails, setCurrencyDetails] = useState<ApiOption[]>([]);

  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryAddress, setBeneficiaryAddress] = useState('');
  const [beneficiaryBank, setBeneficiaryBank] = useState('');
  const [bankAddressLine1, setBankAddressLine1] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');
  const [hasTypedIban, setHasTypedIban] = useState(false);
  const [payableCountry, setPayableCountry] = useState('');
  const [payCurrency, setPayCurrency] = useState('');
  const [swiftBic, setSwiftBic] = useState('');
  const [routeCode, setRouteCode] = useState('');
  const [swiftCodeIB, setSwiftCodeIB] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [email, setEmail] = useState('');
  const [hasTenantDisputeCharges, setHasTenantDisputeCharges] = useState(false);
  const [isBankDetailsAlreadySubmitted, setIsBankDetailsAlreadySubmitted] = useState(false);
  const [showOutstandingPayment, setShowOutstandingPayment] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { mutate: getCurrencyCountryBankDetail } = useApiMutation<any, any>(
    () => '/moveout/GetCurrencyCountryBankDetail',
    'GET',
    false
  );

  const { mutate: fetchRefundBankDetails, isPending: isLoadingRefundBankDetails } = useApiMutation<
    any,
    any
  >(() => `/MoveOut/FetchRefundBankDetails/${tCode}`, 'GET', false);

  const { mutate: fetchProfileDetails } = useApiMutation<any, any>(
    () => `/Yardi/GetDetails?tCode=${tCode}`,
    'GET',
    false
  );

  const { mutate: submitMoveOutBankDetails, isPending: isSubmittingBankDetails } = useApiMutation<
    any,
    any
  >(() => '/MoveOut/SendBankDetails', 'POST', true);

  const { mutate: updateMoveOutStepper, isPending: isUpdatingStepper } = useApiMutation<any, any>(
    () => '/MoveOut/UpdateStepper',
    'POST',
    true
  );
  const { mutate: getMoveOutStepper } = useApiMutation<any, any>(
    () => `/MoveOut/Stepper/${tCode}`,
    'GET',
    false
  );
  const { mutate: getAllUtilities } = useApiMutation<any, any>(
    () => `/Community/Utilities/${tCode}`,
    'GET',
    false
  );
  const { mutate: cancelMoveOutNotice, isPending: isCancellingMoveOut } = useApiMutation<any, any>(
    () => `/moveout/CancelMoveoutNotice/${tCode}`,
    'POST',
    true
  );

  const isTRorOB = paymentMode === 'TR' || paymentMode === 'OB';
  const isTT = paymentMode === 'TT';
  const isLoading =
    isLoadingRefundBankDetails ||
    isSubmittingBankDetails ||
    isUpdatingStepper ||
    isCancellingMoveOut;

  const bankOptions = useMemo(() => {
    if (!bankDetails?.length) return [];
    const filtered =
      paymentMode === 'TR' || paymentMode === 'OB'
        ? bankDetails.filter((option) => option.BankType === paymentMode)
        : bankDetails;
    return filtered.map((option) => ({
      label: option.Description ?? '',
      value: option.BankCode ?? '',
    }));
  }, [bankDetails, paymentMode]);

  const countryOptions = useMemo(
    () =>
      (countryDetails || [])
        .filter((option) => option.CountryCode && option.CountryCode !== UAE_PAYABLE_COUNTRY)
        .map((option) => ({
          label: option.CountryCode ?? '',
          value: option.CountryCode ?? '',
        })),
    [countryDetails]
  );

  const currencyOptions = useMemo(
    () =>
      (currencyDetails || [])
        .filter((option) => option.CurrencyCode && option.CurrencyCode !== 'AED')
        .map((option) => ({
          label: option.Description ?? option.CurrencyCode ?? '',
          value: option.CurrencyCode ?? '',
        })),
    [currencyDetails]
  );

  const paymentOptions = [
    { value: PAYMENT_OPTION_VALUES[0], label: fields?.paymentOption1 },
    { value: PAYMENT_OPTION_VALUES[1], label: fields?.paymentOption2 },
    { value: PAYMENT_OPTION_VALUES[2], label: fields?.paymentOption3 },
  ];

  const isTrObValid =
    confirmTransfer &&
    !!beneficiaryName.trim() &&
    !!beneficiaryBank &&
    !!bankAddressLine1.trim() &&
    !!accountNumber.trim() &&
    !!iban.trim() &&
    iban.trim().length >= 23 &&
    !!email.trim();

  const isTtValid =
    confirmTransfer &&
    !!beneficiaryName.trim() &&
    !!beneficiaryAddress.trim() &&
    !!beneficiaryBank &&
    !!bankAddressLine1.trim() &&
    !!accountNumber.trim() &&
    !!payableCountry &&
    !!payCurrency &&
    !!swiftBic.trim() &&
    !!email.trim();

  const isNextBtnDisabled =
    !paymentMode || isLoading || (isTRorOB ? !isTrObValid : isTT ? !isTtValid : true);

  const applyReadOnlyDefaultsForTRorOB = () => {
    setPayableCountry(UAE_PAYABLE_COUNTRY);
    setPayCurrency(UAE_PAY_CURRENCY);
    if (!iban || !iban.startsWith('AE')) {
      setIban('AE');
    }
  };

  const populateProfileDefaults = (profile: any) => {
    const profileName = profile?.Tenant_Name || '';
    const profileEmail = profile?.Tenant_Email || Email || '';
    const profileAddress = `${profile?.Unit_Code?.trim?.() || ''}${
      profile?.Property_Code ? ` ${profile.Property_Code.trim?.() || ''}` : ''
    }${profile?.Tenant_Project_Name ? ` ${profile.Tenant_Project_Name.trim?.() || ''}` : ''}${
      profile?.Tenant_Zip ? ` ${profile.Tenant_Zip.trim?.() || ''}` : ''
    }`.trim();

    if (profileName) {
      setBeneficiaryName(profileName);
    }
    if (profileEmail) {
      setEmail(profileEmail);
    }
    if (profileAddress) {
      setBeneficiaryAddress(profileAddress);
    }
  };

  const loadProfileDefaults = () => {
    fetchProfileDetails(null, {
      onSuccess: (profileResponse) => {
        const profile = profileResponse?.Tenant_Details?.[0];
        if (profile) {
          populateProfileDefaults(profile);
        }
      },
      onError: () => openModal('error-modal'),
    });
  };

  const handlePaymentModeChange = (mode: string) => {
    setPaymentMode(mode);
    setConfirmTransfer(false);
    setBeneficiaryBank('');
    setHasTypedIban(false);
    if (mode === 'TR' || mode === 'OB') {
      applyReadOnlyDefaultsForTRorOB();
      return;
    }
    if (mode === 'TT') {
      setPayableCountry('');
      setPayCurrency('');
      if (iban === 'AE') {
        setIban('');
      }
    }
  };

  const handleTrObIbanChange = (value: string) => {
    const upper = value.toUpperCase();
    const withPrefix = upper.startsWith('AE') ? upper : `AE${upper.replace(/^AE/i, '')}`;
    const digitsOnly = withPrefix.slice(2).replace(/\D/g, '').slice(0, 21);
    setIban(`AE${digitsOnly}`);
    setHasTypedIban(digitsOnly.length > 0);
  };

  const trObIbanRemainingChars = Math.max(0, 23 - (iban?.length || 0));
  const trObIbanHelperText =
    hasTypedIban && trObIbanRemainingChars > 0
      ? `${trObIbanRemainingChars} ${
          trObIbanRemainingChars === 1 ? 'character' : 'characters'
        } remaining`
      : undefined;

  useEffect(() => {
    if (!tCode) return;

    setIsInitialLoading(true);
    let remaining = 3;
    const markLoaded = () => {
      remaining -= 1;
      if (remaining <= 0) {
        setIsInitialLoading(false);
      }
    };

    getMoveOutStepper(null, {
      onSuccess: (response) => {
        const dispute = Boolean(response?.TenantDisputeCharges);
        const submitted = Boolean(
          response?.isBankDetailsSubmitted ?? response?.IsBankDetailsSubmitted
        );
        setHasTenantDisputeCharges(dispute);
        setIsBankDetailsAlreadySubmitted(submitted);
        if (dispute && submitted) {
          setShowOutstandingPayment(true);
        }
        markLoaded();
      },
      onError: () => {
        openModal('error-modal');
        markLoaded();
      },
    });

    getCurrencyCountryBankDetail(null, {
      onSuccess: (res) => {
        const apiData = res?.FetchCurrencyCountryBankDetails;
        setBankDetails(apiData?.BankDetail || []);
        setCountryDetails(apiData?.CountryDetail || []);
        setCurrencyDetails(apiData?.CurrencyDetail || []);
        markLoaded();
      },
      onError: () => {
        openModal('error-modal');
        markLoaded();
      },
    });

    // Legacy: bank details first; profile only when bank details are missing/fail
    fetchRefundBankDetails(null, {
      onSuccess: (response) => {
        const details = response?.RefundBankDetails?.DAM_RES_Refund_Bank_Details;
        if (!details) {
          loadProfileDefaults();
          markLoaded();
          return;
        }

        const incomingMode = details.Pay_Mode || '';
        if (incomingMode) {
          setPaymentMode(incomingMode);
        }

        if (details.Beneficiary_Name) {
          setBeneficiaryName(details.Beneficiary_Name);
        } else {
          loadProfileDefaults();
        }

        setBeneficiaryBank(details.Beneficiary_Bank || '');
        setBankAddressLine1(details.Address_Line1 || '');
        setAccountNumber(details.Account_Number || '');
        setIban(details.IBAN || (incomingMode === 'TT' ? '' : 'AE'));
        setPayableCountry(details.Payable_Country || '');
        setPayCurrency(details.Pay_Currency || '');
        setEmail(details.emailAddr || Email || '');

        if (incomingMode === 'TT') {
          setBeneficiaryAddress(details.Address_Line2 || '');
          setBeneficiaryBank(details.Address_Line3 || details.Beneficiary_Bank || '');
          setSwiftBic(details.SwiftCode || '');
          setRouteCode(details.RouteCode || '');
          setSwiftCodeIB(details.SwiftCode_IB || '');
          setSortCode(details.SortCode || '');
        }

        if (incomingMode === 'TR' || incomingMode === 'OB') {
          applyReadOnlyDefaultsForTRorOB();
        }
        markLoaded();
      },
      onError: () => {
        loadProfileDefaults();
        markLoaded();
      },
    });
  }, [tCode]);

  const handleSubmit = () => {
    if (!tCode || !paymentMode) return;

    let selectedCurrency = isTRorOB ? UAE_PAY_CURRENCY : payCurrency;
    if (selectedCurrency === UAE_PAY_CURRENCY) {
      selectedCurrency = 'AED';
    }

    const submitBankDetailsObj: Record<string, any> = {
      TenantCode: tCode,
      Beneficiary_Name: beneficiaryName,
      Pay_Mode: paymentMode,
      Beneficiary_Bank: beneficiaryBank,
      Pay_Currency: selectedCurrency,
      IBAN: isTT && iban === 'AE' ? '' : iban,
      Account_Number: accountNumber,
      Payable_Country: isTRorOB ? UAE_PAYABLE_COUNTRY : payableCountry,
      emailAddr: email,
      Address_Line1: bankAddressLine1,
    };

    if (isTT) {
      submitBankDetailsObj.Address_Line2 = beneficiaryAddress;
      submitBankDetailsObj.Address_Line3 = beneficiaryBank;
      submitBankDetailsObj.SwiftCode = swiftBic;
      submitBankDetailsObj.RouteCode = routeCode;
      submitBankDetailsObj.SwiftCode_IB = swiftCodeIB;
      submitBankDetailsObj.SortCode = sortCode;
    }
    submitMoveOutBankDetails(JSON.stringify(submitBankDetailsObj), {
      onSuccess: (response) => {
        if (response?.CreateRefundBank?.Status === 'Success') {
          if (hasTenantDisputeCharges) {
            setIsBankDetailsAlreadySubmitted(true);
            setShowOutstandingPayment(true);
            return;
          }
          advanceAfterBankDetails();
          return;
        }
        openModal('error-modal');
      },
      onError: () => openModal('error-modal'),
    });
  };

  const handleCancelMoveOutConfirm = () => {
    cancelMoveOutNotice(null, {
      onSuccess: (response) => {
        if (response?.CancelMoveOutNotice?.Status === 'Success') {
          router.push('/dashboard');
          return;
        }
        openModal('error-modal');
      },
      onError: () => openModal('error-modal'),
    });
  };

  const advanceAfterBankDetails = () => {
    if (!tCode) return;

    getAllUtilities(null, {
      onSuccess: (utilitiesRes) => {
        const utilitiesPresent = hasMoveOutUtilities(utilitiesRes);
        setCachedHasMoveOutUtilities(tCode, utilitiesPresent);

        updateMoveOutStepper(getPostBankDetailsStepperPayload(tCode, utilitiesPresent), {
          onSuccess: (stepperResponse) => {
            if (stepperResponse?.Status === 'Success' || stepperResponse?.Code === 200) {
              router.push(getPostBankDetailsRoute(utilitiesPresent));
              return;
            }
            openModal('error-modal');
          },
          onError: () => openModal('error-modal'),
        });
      },
      onError: () => {
        // Fail closed: keep utilities path if the check fails.
        setCachedHasMoveOutUtilities(tCode, true);
        updateMoveOutStepper(getPostBankDetailsStepperPayload(tCode, true), {
          onSuccess: (stepperResponse) => {
            if (stepperResponse?.Status === 'Success' || stepperResponse?.Code === 200) {
              router.push(getPostBankDetailsRoute(true));
              return;
            }
            openModal('error-modal');
          },
          onError: () => openModal('error-modal'),
        });
      },
    });
  };

  const handleOutstandingPaymentCompleted = () => {
    advanceAfterBankDetails();
  };

  return (
    <>
      <MoveOutStepper />
      <section className="MoveOutBankDetails my-6 md:my-8">
        <div className="container-sm flex flex-col gap-5 md:gap-6">
          {isInitialLoading ? (
            <MoveOutBankDetailsSkeleton />
          ) : (
            <>
              <Link
                href="/move-out"
                className="text-body-sm font-medium flex gap-4 text-navy-500 uppercase items-center"
              >
                <ArrowLeft className="size-5 md:size-7" />
                {fields?.backLinkText?.value || 'BACK'}
              </Link>

              {!showOutstandingPayment && (
                <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-2 md:gap-3">
                    <div className="flex gap-4 items-center">
                      <span className="shrink-0 [&_svg]:size-8">
                        <CustomRichText field={fields?.titleIcon} />
                      </span>
                      <Text
                        tag="h2"
                        field={fields?.title}
                        className="text-base md:text-heading-3 font-normal text-navy-500"
                      />
                    </div>
                    <Text
                      tag="p"
                      field={fields?.description}
                      className="text-body font-light text-navy-500"
                    />
                  </div>

                  <div className="rounded-[12px] border border-[#EE9235] bg-[#FCE9D7] px-5 py-3 flex gap-3 md:gap-4 items-center">
                    <span className="shrink-0 flex items-center [&_svg]:size-6">
                      <CustomRichText field={fields?.warningIcon} />
                    </span>
                    <div className="text-sm md:text-base font-light text-amber-900 leading-normal [&_a]:underline [&_a]:font-medium [&_a]:text-[#426895]">
                      <CustomRichText field={fields?.warningMessage} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                    {paymentOptions.map((option) => {
                      const isSelected = paymentMode === option.value;
                      return (
                        <Radio
                          key={option.value}
                          id={option.value}
                          name="paymentMode"
                          value={option.value}
                          label={option.label?.value ?? ''}
                          checked={isSelected}
                          onChange={handlePaymentModeChange}
                          className={`w-full md:flex-1 md:min-w-0 border rounded-[8px] p-3 md:p-4 flex-row-reverse justify-between items-center ${
                            isSelected
                              ? 'bg-[#EBEDFF] border-[#B0B9FF]'
                              : 'bg-white-pure border-lilac-300'
                          }`}
                          inputClassName="h-4 w-4"
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {paymentMode && !showOutstandingPayment && (
                <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-2 md:gap-3">
                    <div className="flex gap-4 items-center">
                      <span className="shrink-0 [&_svg]:size-8">
                        <CustomRichText field={fields?.titleIcon} />
                      </span>
                      <Text
                        tag="h2"
                        field={fields?.title}
                        className="text-base md:text-heading-3 font-normal text-navy-500"
                      />
                    </div>
                    <Text
                      tag="p"
                      field={fields?.formInstruction}
                      className="text-body font-normal text-navy-500"
                    />
                  </div>

                  <div className="form-group w-full">
                    <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 md:gap-x-6 md:gap-y-2 [&>*]:min-w-0 [&_.space-y-1]:!mt-0 [&_.relative]:!mb-0 [&_.form-group-field]:!mt-0 [&_.choices]:!mb-0">
                      {isTRorOB &&
                        (paymentMode === 'TR' ? (
                          <>
                            {/* Row 1: Beneficiary name | Beneficiary bank */}
                            <Input
                              label="Beneficiary name*"
                              value={beneficiaryName}
                              disabled
                              containerClassName="w-full md:col-span-1"
                            />
                            <div className="w-full md:col-span-1">
                              <label htmlFor="beneficiary-bank" className={INPUT_STYLE_LABEL_CLASS}>
                                Beneficiary bank*
                              </label>
                              <Select
                                id="beneficiary-bank"
                                placeholder="Select bank"
                                options={bankOptions}
                                value={beneficiaryBank}
                                onChange={setBeneficiaryBank}
                              />
                            </div>
                            <div className="hidden md:block md:col-span-1" aria-hidden="true" />

                            {/* Row 2: Bank address | Account number */}
                            <Input
                              label="Bank address*"
                              value={bankAddressLine1}
                              onChange={(e) => setBankAddressLine1(e.target.value)}
                              onClear={() => setBankAddressLine1('')}
                              maxLength={35}
                              containerClassName="w-full md:col-span-1"
                            />
                            <Input
                              label="Account number*"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                              onClear={() => setAccountNumber('')}
                              containerClassName="w-full md:col-span-1"
                            />
                            <div className="hidden md:block md:col-span-1" aria-hidden="true" />

                            {/* Row 3:  IBAN | Payable country */}

                            <Input
                              label="IBAN #*"
                              value={iban}
                              onChange={(e) => handleTrObIbanChange(e.target.value)}
                              onClear={() => {
                                setIban('AE');
                                setHasTypedIban(false);
                              }}
                              placeholder="AE"
                              maxLength={23}
                              helperText={trObIbanHelperText}
                              containerClassName="w-full md:col-span-1"
                              className="!border-lilac-500 focus:!border-lilac-500 data-[filled]:!border-lilac-500"
                            />
                            <Input
                              label="Payable country*"
                              value={UAE_PAYABLE_COUNTRY}
                              disabled
                              startIcon={<CustomRichText field={fields?.payableCountryFlagIcon} />}
                              containerClassName="w-full md:col-span-1"
                            />
                            <div className="hidden md:block md:col-span-1" aria-hidden="true" />

                            {/* Row 4: Pay currency | Email */}
                            <Input
                              label="Pay currency*"
                              value={UAE_PAY_CURRENCY}
                              disabled
                              startIcon={
                                <span className="text-body-sm font-semibold tabular-nums">
                                  {fields?.payCurrencySymbol?.value?.trim()}
                                </span>
                              }
                              containerClassName="w-full md:col-span-1"
                            />
                            <Input
                              label="Email address*"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onClear={() => setEmail('')}
                              containerClassName="w-full md:col-span-1"
                            />
                            <div className="hidden md:block md:col-span-1" aria-hidden="true" />
                          </>
                        ) : (
                          <>
                            {/* Other Bank (OB) layout */}
                            <Input
                              label="Beneficiary name*"
                              value={beneficiaryName}
                              disabled
                              containerClassName="w-full md:col-span-1"
                            />
                            <div className="w-full md:col-span-1">
                              <label
                                htmlFor="beneficiary-bank-ob"
                                className={INPUT_STYLE_LABEL_CLASS}
                              >
                                Beneficiary bank*
                              </label>
                              <Select
                                id="beneficiary-bank-ob"
                                placeholder="Select bank"
                                options={bankOptions}
                                value={beneficiaryBank}
                                onChange={setBeneficiaryBank}
                              />
                            </div>
                            <div className="hidden md:block md:col-span-1" aria-hidden="true" />

                            {/* Row 2: Beneficiary bank address | Account number */}
                            <Input
                              label="Beneficiary bank address*"
                              value={bankAddressLine1}
                              onChange={(e) => setBankAddressLine1(e.target.value)}
                              onClear={() => setBankAddressLine1('')}
                              maxLength={35}
                              containerClassName="w-full md:col-span-1"
                            />
                            <Input
                              label="Account number*"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                              onClear={() => setAccountNumber('')}
                              containerClassName="w-full md:col-span-1"
                            />
                            <div className="hidden md:block md:col-span-1" aria-hidden="true" />

                            {/* Row 3: IBAN | Payable country */}
                            <Input
                              label="IBAN #*"
                              value={iban}
                              onChange={(e) => handleTrObIbanChange(e.target.value)}
                              onClear={() => {
                                setIban('AE');
                                setHasTypedIban(false);
                              }}
                              placeholder="AE"
                              maxLength={23}
                              helperText={trObIbanHelperText}
                              containerClassName="w-full md:col-span-1"
                              className="!border-lilac-500 focus:!border-lilac-500 data-[filled]:!border-lilac-500"
                            />
                            <Input
                              label="Payable country*"
                              value={UAE_PAYABLE_COUNTRY}
                              disabled
                              startIcon={<CustomRichText field={fields?.payableCountryFlagIcon} />}
                              containerClassName="w-full md:col-span-1"
                            />
                            <div className="hidden md:block md:col-span-1" aria-hidden="true" />

                            {/* Row 4: Pay currency | Email address */}
                            <Input
                              label="Pay currency*"
                              value={UAE_PAY_CURRENCY}
                              disabled
                              startIcon={
                                <span className="text-body-sm font-semibold tabular-nums">
                                  {fields?.payCurrencySymbol?.value?.trim()}
                                </span>
                              }
                              containerClassName="w-full md:col-span-1"
                            />
                            <Input
                              label="Email address*"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onClear={() => setEmail('')}
                              containerClassName="w-full md:col-span-1"
                            />
                            <div className="hidden md:block md:col-span-1" aria-hidden="true" />
                          </>
                        ))}
                      {isTT && (
                        <>
                          {/* Row 1: Beneficiary name | Beneficiary address */}
                          <Input
                            label="Beneficiary name*"
                            value={beneficiaryName}
                            disabled
                            containerClassName="w-full md:col-span-1"
                          />
                          <Input
                            label="Beneficiary address*"
                            value={beneficiaryAddress}
                            disabled
                            maxLength={35}
                            containerClassName="w-full md:col-span-1"
                          />
                          <div className="hidden md:block md:col-span-1" aria-hidden="true" />

                          {/* Row 2: Beneficiary bank (select) | Bank address */}
                          <div className="w-full md:col-span-1">
                            <label
                              htmlFor="beneficiary-bank-tt"
                              className={INPUT_STYLE_LABEL_CLASS}
                            >
                              Beneficiary bank*
                            </label>
                            <Select
                              id="beneficiary-bank-tt"
                              placeholder="Select bank"
                              options={bankOptions}
                              value={beneficiaryBank}
                              onChange={setBeneficiaryBank}
                            />
                          </div>
                          <Input
                            label="Bank address*"
                            value={bankAddressLine1}
                            onChange={(e) => setBankAddressLine1(e.target.value)}
                            onClear={() => setBankAddressLine1('')}
                            maxLength={35}
                            containerClassName="w-full md:col-span-1"
                          />
                          <div className="hidden md:block md:col-span-1" aria-hidden="true" />

                          {/* Row 3: Account number | IBAN */}
                          <Input
                            label="Account number*"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            onClear={() => setAccountNumber('')}
                            containerClassName="w-full md:col-span-1"
                          />
                          <Input
                            label="IBAN #"
                            value={iban}
                            onChange={(e) => setIban(e.target.value)}
                            onClear={() => setIban('')}
                            maxLength={32}
                            containerClassName="w-full md:col-span-1"
                          />
                          <div className="hidden md:block md:col-span-1" aria-hidden="true" />

                          {/* Row 4: Payable country | Pay currency */}
                          <div className="w-full md:col-span-1">
                            <label htmlFor="payable-country-tt" className={INPUT_STYLE_LABEL_CLASS}>
                              Payable country*
                            </label>
                            <Select
                              id="payable-country-tt"
                              placeholder="Select Country"
                              options={countryOptions}
                              value={payableCountry}
                              onChange={setPayableCountry}
                            />
                          </div>
                          <div className="w-full md:col-span-1">
                            <label htmlFor="pay-currency-tt" className={INPUT_STYLE_LABEL_CLASS}>
                              Pay currency*
                            </label>
                            <Select
                              id="pay-currency-tt"
                              placeholder="Select Currency"
                              options={currencyOptions}
                              value={payCurrency}
                              onChange={setPayCurrency}
                            />
                          </div>
                          <div className="hidden md:block md:col-span-1" aria-hidden="true" />

                          {/* Row 5: SWIFT/BIC | Email */}
                          <Input
                            label="SWIFT/BIC/Sort code*"
                            value={swiftBic}
                            onChange={(e) => setSwiftBic(e.target.value)}
                            onClear={() => setSwiftBic('')}
                            containerClassName="w-full md:col-span-1"
                          />
                          <Input
                            label="Email address*"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onClear={() => setEmail('')}
                            containerClassName="w-full md:col-span-1"
                          />
                          <div className="hidden md:block md:col-span-1" aria-hidden="true" />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Checkbox
                      id="confirm-transfer"
                      name="confirmTransfer"
                      value="confirm"
                      checked={confirmTransfer}
                      onChange={setConfirmTransfer}
                    >
                      <p className="text-sm md:text-base font-light text-navy-500">
                        I confirm that my security deposit refund (if applicable) will be
                        transferred to the bank account details provided above.
                      </p>
                    </Checkbox>
                  </div>
                </div>
              )}

              {showOutstandingPayment && isBankDetailsAlreadySubmitted && tCode && (
                <MoveOutOutstandingPayment
                  tCode={tCode}
                  fields={fields}
                  onPaymentCompleted={handleOutstandingPaymentCompleted}
                />
              )}

              {!showOutstandingPayment && (
                <div className="rounded-[12px] bg-[#EBEDFF] border border-[#B0B9FF] px-4 md:px-5 py-3 flex gap-3 md:gap-4 items-center">
                  <span className="shrink-0 flex items-center [&_svg]:size-6">
                    <CustomRichText field={fields?.infoBannerIcon} />
                  </span>
                  <p className="text-sm md:text-base font-normal text-[#3E4366]">
                    {paymentMode
                      ? fields?.infoBannerMessage?.value
                      : fields?.formInstruction?.value || fields?.infoBannerMessage?.value}
                  </p>
                </div>
              )}

              {!showOutstandingPayment && (
                <div className="btn-wrapper flex flex-col lg:flex-row justify-end gap-5 md:gap-6">
                  <button
                    type="button"
                    className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15"
                    onClick={() => openModal('cancel-moveout-modal')}
                  >
                    {fields?.cancelButtonText?.value}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 ${
                      isNextBtnDisabled ? 'disabled' : ''
                    }`}
                    disabled={isNextBtnDisabled}
                    onClick={handleSubmit}
                  >
                    {fields?.nextButtonText?.value}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <CancelMoveOutModal onConfirm={handleCancelMoveOutConfirm} />
    </>
  );
};

export default MoveOutBankDetails;
