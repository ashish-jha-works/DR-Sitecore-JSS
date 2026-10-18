import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import { useDocumentVerification } from '../useDocumentVerification';

export const useDirectDebitPage = () => {
  const router = useRouter();
  const { tCode, FirstName, LastName, Mobile, Email } = useUserStore();
  const { openModal } = useUIStore();
  const { checkDocumentValidation } = useDocumentVerification();
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [iban, setIban] = useState('');
  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [monthlyDeduction, setMonthlyDeduction] = useState(0);

  /* ---------------- API ---------------- */

  const { mutate: fetchPDCDetails, isPending: isLoadingPDCDetails } = useApiMutation<any, any>(
    () => `ContractRenewal/GetPdcDetails/${tCode}`,
    'GET',
    false
  );

  const { mutate: fetchBankDetails, isPending: isLoadingBankDetails } = useApiMutation<any, any>(
    () => `moveout/GetCurrencyCountryBankDetail?isDirectDebit=true`,
    'GET',
    false
  );

  const { mutate: updateDirectDebitDetails } = useApiMutation<any, any>(
    `v1/payments/DirectDebit`,
    'POST',
    true
  );

  /* ---------------- Handlers ---------------- */

  const trObIbanRemainingChars = Math.max(0, 23 - (iban?.length || 0));

  const beneficiaryName = `${FirstName ?? ''} ${LastName ?? ''}`.trim();

  const handleTrObIbanChange = (value: string) => {
    const upper = value.toUpperCase();
    const withPrefix = upper.startsWith('AE') ? upper : `AE${upper.replace(/^AE/i, '')}`;
    const digitsOnly = withPrefix.slice(2).replace(/\D/g, '');
    setIban(`AE${digitsOnly.slice(0, 21)}`);
  };

  const handleSubmitDirectDebitDetails = () => {
    const reqBody = {
      ACCOUNT_NAME: beneficiaryName,
      IBAN: iban.trim(),
      IsValid: true,
      RequestType: 1,
      TCODE: tCode,
      bank_name: selectedBank,
      bankname_drawn: '000',
      secCheck_amt: 0,
      secCheck_num: '',
    };

    updateDirectDebitDetails(reqBody, {
      onSuccess: async (res) => {
        if (res?.Status && res?.Status.trim().toLowerCase().includes('success')) {
          // Check for documents status, accordingly to redirection & update stepper
          checkDocumentValidation({ paymentOptionId: 4 });
        } else {
          openModal('error-modal');
        }
      },
      onError: () => {
        openModal('error-modal');
      },
    });
  };

  const handleCancelJourney = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace('/contract-renewal');
    }
  };

  useEffect(() => {
    fetchPDCDetails(null, {
      onSuccess: (res: any) => {
        if (res && res?.PdcList?.length) {
          setMonthlyDeduction(res.PdcList[res.PdcList.length - 1].InstallmentAmount);
        } else {
          openModal('error-modal');
        }
      },
      onError: () => openModal('error-modal'),
    });
    fetchBankDetails(null, {
      onSuccess: (res) => {
        if (res) {
          const updatedBankList = res?.FetchCurrencyCountryBankDetails?.BankDetail?.map(
            (bankData: any) => ({
              ...bankData,
              label: bankData.Description,
              value: bankData.Description,
            })
          );
          setBankList(updatedBankList);
        } else {
          openModal('error-modal');
        }
      },
      onError: () => {
        openModal('error-modal');
      },
    });
  }, []);

  const isLoading = !stepperAPIData || isLoadingPDCDetails || isLoadingBankDetails;

  return {
    beneficiaryName,
    beneficiaryMobileNo: Mobile,
    beneficiaryEmail: Email,
    bankList,
    selectedBank,
    setSelectedBank,
    iban,
    setIban,
    trObIbanRemainingChars,
    handleTrObIbanChange,
    setStepperAPIData,
    monthlyDeduction,
    isLoading,
    handleCancelJourney,
    handleSubmitDirectDebitDetails,
  };
};
