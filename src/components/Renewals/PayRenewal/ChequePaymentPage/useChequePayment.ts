import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import {
  ChequeInstallment,
  ChequeSectionStatus,
  CompanyIssuerFields,
  IndividualIssuerFields,
} from './ChequePaymentPage.types';
import { useUserStore } from 'src/store/useUserStore';
import { formatDate } from 'lib/utils/helper';

const chequeFromThirdPartyOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

const chequeIssuerOptions = [
  { label: 'Individual', value: 'Individual' },
  { label: 'Company', value: 'Company' },
];

const emptyIndividualFields: IndividualIssuerFields = {
  chequeIssuerName: '',
  passportNumber: '',
  passportExpiry: null,
  EIDNumber: '',
  EIDExpiry: null,
};

const emptyCompanyFields: CompanyIssuerFields = {
  chequeIssuerName: '',
  tradeLicenseNumber: '',
  tradeLicenseExpiry: null,
};

export const useChequePayment = () => {
  const router = useRouter();
  const { tCode } = useUserStore();
  const searchParams = useSearchParams();
  const selectedPaymentOption = searchParams.get('po');
  const { openModal } = useUIStore();

  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [isChequeFromThirdParty, setIsChequeFromThirdParty] = useState<any>();
  const [chequeIssuerType, setChequeIssuerType] = useState<any>();
  const [isSameBankForAllCheque, setIsSameBankForAllCheque] = useState(false);
  const [bankList, setBankList] = useState([]);

  const [chequeInstallments, setChequeInstallments] = useState<ChequeInstallment[]>([]);

  /* ---------------- Cheque issuer details ---------------- */
  const [individualValues, setIndividualValues] =
    useState<IndividualIssuerFields>(emptyIndividualFields);
  const [companyValues, setCompanyValues] = useState<CompanyIssuerFields>(emptyCompanyFields);
  const [savedIndividualValues, setSavedIndividualValues] = useState<IndividualIssuerFields | null>(
    null
  );
  const [savedCompanyValues, setSavedCompanyValues] = useState<CompanyIssuerFields | null>(null);
  const [issuerDetailsStatus, setIssuerDetailsStatus] = useState<ChequeSectionStatus>('editing');

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

  useEffect(() => {
    fetchPDCDetails(null, {
      onSuccess: (res: any) => {
        if (res?.PdcList?.length) {
          const pdcList = res.PdcList;

          const installmentPdcList =
            Number(selectedPaymentOption) === 3 && pdcList.length > 1
              ? pdcList.slice(1) // Remove first item for 1st by direct debit rest by PDC case
              : pdcList;

          const installmentDetails = installmentPdcList.map((pdc: any, index: number) => ({
            amount: pdc.InstallmentAmount,
            bankName: '',
            chequeNumber: '',
            date: formatDate(pdc.InstallementDate),
            number: Number(selectedPaymentOption) === 3 ? index + 2 : index + 1,
            savedBankName: null,
            savedChequeNumber: null,
            status: 'editing',
          }));

          setChequeInstallments(installmentDetails);
        } else {
          openModal('error-modal');
        }
      },
      onError: () => openModal('error-modal'),
    });
  }, [selectedPaymentOption]);

  useEffect(() => {
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

  /* ---------------- Handlers ---------------- */

  const handleCancelJourney = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace('/contract-renewal');
    }
  };

  /* ---------------- Cheque details handlers ---------------- */

  const updateChequeInstallment = (number: number, updates: Partial<ChequeInstallment>) => {
    setChequeInstallments((prev) =>
      prev.map((item) => (item.number === number ? { ...item, ...updates } : item))
    );
  };

  const setChequeNumber = (number: number, value: string) => {
    updateChequeInstallment(number, { chequeNumber: value });
  };

  const setBankName = (number: number, value: string) => {
    updateChequeInstallment(number, { bankName: value });
  };

  const saveChequeInstallment = (number: number) => {
    const item = chequeInstallments.find((i) => i.number === number);
    if (!item) return;
    updateChequeInstallment(number, {
      savedChequeNumber: item.chequeNumber,
      savedBankName: item.bankName,
      status: 'saved',
    });
  };

  const editChequeInstallment = (number: number) => {
    updateChequeInstallment(number, { status: 'editing' });
  };

  const cancelChequeInstallment = (number: number) => {
    const item = chequeInstallments.find((i) => i.number === number);
    if (!item) return;

    if (item.savedChequeNumber !== null) {
      // Revert to saved data on cancel
      updateChequeInstallment(number, {
        chequeNumber: item.savedChequeNumber,
        bankName: item.savedBankName || '',
        status: 'saved',
      });
    } else {
      // Clean data on first cancel
      updateChequeInstallment(number, {
        chequeNumber: '',
        bankName: '',
        status: 'editing',
      });
    }
  };

  // First cheque's bank name to all cheques
  const firstBankName = chequeInstallments[0]?.bankName;
  useEffect(() => {
    if (isSameBankForAllCheque && firstBankName) {
      setChequeInstallments((prev) =>
        prev.map((item, index) => (index === 0 ? item : { ...item, bankName: firstBankName }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSameBankForAllCheque, firstBankName]);

  /* ---------------- Cheque issuer details handlers ---------------- */

  const updateIndividualField = (key: keyof IndividualIssuerFields, value: string) => {
    setIndividualValues((prev) => ({ ...prev, [key]: value }));
  };

  const updateCompanyField = (key: keyof CompanyIssuerFields, value: string) => {
    setCompanyValues((prev) => ({ ...prev, [key]: value }));
  };

  const updateIndividualDateField = (key: keyof IndividualIssuerFields, value: Date | null) => {
    setIndividualValues((prev) => ({ ...prev, [key]: value }));
  };

  const updateCompanyDateField = (key: keyof CompanyIssuerFields, value: Date | null) => {
    setCompanyValues((prev) => ({ ...prev, [key]: value }));
  };

  const saveIssuerDetails = () => {
    if (chequeIssuerType === 'Individual') {
      setSavedIndividualValues(individualValues);
    } else if (chequeIssuerType === 'Company') {
      setSavedCompanyValues(companyValues);
    }
    setIssuerDetailsStatus('saved');
  };

  const editIssuerDetails = () => {
    setIssuerDetailsStatus('editing');
  };

  const cancelIssuerDetails = () => {
    if (chequeIssuerType === 'Individual') {
      if (savedIndividualValues) {
        setIndividualValues(savedIndividualValues);
        setIssuerDetailsStatus('saved');
      } else {
        setIndividualValues(emptyIndividualFields);
        setIssuerDetailsStatus('editing');
      }
    } else if (chequeIssuerType === 'Company') {
      if (savedCompanyValues) {
        setCompanyValues(savedCompanyValues);
        setIssuerDetailsStatus('saved');
      } else {
        setCompanyValues(emptyCompanyFields);
        setIssuerDetailsStatus('editing');
      }
    }
  };

  // First load editing status
  useEffect(() => {
    setIssuerDetailsStatus('editing');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chequeIssuerType]);

  /* ---------------- Derived state / gating ---------------- */

  const isChequeDetailsSaved = useMemo(
    () => chequeInstallments.every((item) => item.status === 'saved'),
    [chequeInstallments]
  );

  const isChequeIssuerDetailsSaved = issuerDetailsStatus === 'saved';

  const isSubmitEnabled =
    isChequeDetailsSaved && (isChequeFromThirdParty !== 'Yes' || isChequeIssuerDetailsSaved);

  const isLoading = !stepperAPIData || isLoadingBankDetails || isLoadingPDCDetails;

  const handleSubmitChequeDetails = () => {
    const payload = {
      isChequeFromThirdParty,
      chequeIssuerType: isChequeFromThirdParty === 'Yes' ? chequeIssuerType : null,
      chequeIssuerDetails:
        isChequeFromThirdParty === 'Yes'
          ? chequeIssuerType === 'Individual'
            ? savedIndividualValues
            : savedCompanyValues
          : null,
      cheques: chequeInstallments.map((item) => ({
        number: item.number,
        date: item.date,
        amount: item.amount,
        chequeNumber: item.savedChequeNumber,
        bankName: item.savedBankName,
      })),
    };
    console.log('Submit called', payload);
  };

  return {
    stepperAPIData,
    setStepperAPIData,
    isLoading,
    handleCancelJourney,
    handleSubmitChequeDetails,
    chequeFromThirdPartyOptions,
    isChequeFromThirdParty,
    setIsChequeFromThirdParty,
    isSameBankForAllCheque,
    setIsSameBankForAllCheque,
    bankList,
    chequeIssuerOptions,
    chequeIssuerType,
    setChequeIssuerType,

    // Cheque details
    chequeInstallments,
    setChequeNumber,
    setBankName,
    saveChequeInstallment,
    editChequeInstallment,
    cancelChequeInstallment,
    isChequeDetailsSaved,

    // Cheque issuer details
    individualValues,
    companyValues,
    savedIndividualValues,
    savedCompanyValues,
    issuerDetailsStatus,
    updateIndividualField,
    updateCompanyField,
    updateIndividualDateField,
    updateCompanyDateField,
    saveIssuerDetails,
    editIssuerDetails,
    cancelIssuerDetails,
    isChequeIssuerDetailsSaved,

    isSubmitEnabled,
  };
};
