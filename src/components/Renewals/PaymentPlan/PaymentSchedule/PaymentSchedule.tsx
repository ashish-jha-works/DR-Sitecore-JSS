import React, { useState } from 'react';

import { formatNumber } from 'lib/utils/helper';
import { useUIStore } from 'src/store/useUIStore';
import ViewPDCModal from './ViewPDCModal';

export const installmentPaymentTypeName = (installmentNumber: number, selectedPaymentPlan: any) => {
  switch (selectedPaymentPlan - 1) {
    case 0:
      return 'PDC';
    case 1:
      return 'Card';
    case 2:
      return installmentNumber == 0 ? 'Card' : 'PDC';
    case 3:
      return installmentNumber == 0 ? 'Card' : 'Direct Debit';
    default:
      return 'PDC';
  }
};

const PaymentSchedule = ({
  installmentsDetails,
  selectedPaymentPlan,
  showFirstAndFuturePayment = false,
}: any) => {
  const openModal = useUIStore((state) => state.openModal);
  const [selectedInstallmentIndex, setSelectedInstallmentIndex] = useState(0);

  const handleViewPDCClick = (_selectedInstallmentData: any, _selectedInstallmentIndex: number) => {
    setSelectedInstallmentIndex(_selectedInstallmentIndex);
    openModal('view-pdc-modal');
  };

  return (
    <div className="payment-schedule">
      {!showFirstAndFuturePayment ? (
        <p className="text-body font-medium mb-1 lg:mb-2">Payment schedule</p>
      ) : null}
      {installmentsDetails?.map((installmentData: any, index: number) => (
        <div
          className={`${showFirstAndFuturePayment && index < 1 ? 'mb-5 lg:mb-6' : ''}`}
          key={index}
        >
          {showFirstAndFuturePayment && index < 2 ? (
            <p className="text-body font-medium mb-1 lg:mb-2">
              {index === 0 ? 'First Payment' : index === 1 ? 'Future Payments' : ''}
            </p>
          ) : null}
          <div
            className={`${
              showFirstAndFuturePayment && index < 1 ? '' : 'border-b'
            } border-solid border-lilac-200 flex justify-between py-3`}
            key={index}
          >
            <div className="text-[16px] font-light">
              {installmentData?.installmentDate}
              <p className="text-body text-navy-400">{installmentData?.paymentDesc}</p>
            </div>
            <div className="text-body font-light text-right">
              AED {formatNumber(installmentData?.installmentAmount)}
              {installmentPaymentTypeName(index, selectedPaymentPlan) !== 'PDC' ? (
                <p className="text-body text-navy-400">
                  {installmentPaymentTypeName(index, selectedPaymentPlan)}
                </p>
              ) : (
                <p
                  className="uppercase text-body-xs text-sky-700 underline font-medium cursor-pointer"
                  onClick={() => handleViewPDCClick(installmentData, index)}
                >
                  View PDC
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      <ViewPDCModal
        installmentsDetails={installmentsDetails}
        selectedInstallmentIndex={selectedInstallmentIndex}
        selectedPaymentPlan={selectedPaymentPlan}
      />
    </div>
  );
};

export default PaymentSchedule;
