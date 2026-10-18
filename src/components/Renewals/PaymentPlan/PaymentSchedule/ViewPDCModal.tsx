'use client';
import ChevronLeft from 'assets/icons/ChevronLeft';
import ChevronRight from 'assets/icons/ChevronRight';
import CrossIcon from 'assets/icons/CrossIcon';
import { getOrdinalSuffix } from 'lib/utils/helper';
import { useEffect, useState } from 'react';
import { useUIStore } from 'src/store/useUIStore';
import PDCCheque from './PDCCheque';

export default function ViewPDCModal({
  installmentsDetails,
  selectedInstallmentIndex,
  selectedPaymentPlan,
}: any) {
  const { activeModal, closeModal } = useUIStore();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(selectedInstallmentIndex);
  }, [selectedInstallmentIndex]);

  const selectedInstallmentData = installmentsDetails[currentIndex];

  return (
    <div className={`custom-modal p-4 ${activeModal === 'view-pdc-modal' && 'show'}`}>
      <div className="custom-modal__wrapper lg:min-w-fit">
        <h3 className="custom-modal__heading flex justify-between text-[16px] lg:text-[20px]">
          Sample PDC for {currentIndex + 1 + getOrdinalSuffix(currentIndex + 1)} instalment
          <button
            onClick={() => closeModal()}
            className="text-lilac-500 cursor-pointer px-2.5 lg:px-4"
          >
            <CrossIcon className="size-6 lg:size-7" />
          </button>
        </h3>
        <PDCCheque
          bankName="XXXX Bank - BUR Dubai"
          date={selectedInstallmentData?.installmentDate}
          payeeName={selectedInstallmentData?.recieptName}
          amountInWords={
            selectedInstallmentData?.installmentAmountInWords1 +
            ' ' +
            selectedInstallmentData?.installmentAmountInWords2
          }
          amount={selectedInstallmentData?.installmentAmount}
          templateSrc="/assets/images/pdc-cheque-sample.png"
        />
        <div className="flex justify-center mt-5 lg:mt-6 gap-20">
          <button
            onClick={() => setCurrentIndex((prev: number) => (prev > 0 ? prev - 1 : 0))}
            className={`btn btn-secondary w-12 h-12 inline-flex justify-center items-center p-0 ${
              selectedPaymentPlan === 3 // If payment option, 1st by card rest PDC selected
                ? currentIndex === 0 || currentIndex === 1
                  ? 'disabled opacity-50 pointer-events-none'
                  : ''
                : currentIndex === 0
                ? 'disabled opacity-50 pointer-events-none'
                : ''
            }`}
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() =>
              setCurrentIndex((prev: number) =>
                prev < installmentsDetails?.length - 1 ? prev + 1 : installmentsDetails?.length - 1
              )
            }
            className={`btn btn-secondary w-12 h-12 inline-flex justify-center items-center p-0 ${
              currentIndex === installmentsDetails?.length - 1
                ? 'disabled opacity-50 pointer-events-none'
                : ''
            }`}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
