export interface PhysicalScheduleDocumentVisibility {
  showRenewalProposal: boolean;
  showPdcDocument: boolean;
  showCreditCardSideLetter: boolean;
  showDirectDebitDocument: boolean;
  showDirectDebitSideLetter: boolean;
}

/**
 * Mirrors legacy crCompleteRenewalProposal.html v-if rules on the green document checklist
 * (pickup + delivery schedule forms) using SelectedPaymentOption.Key and NoOfInstallments.
 */
export function getPhysicalScheduleDocumentVisibility(
  stepperAPIData: any
): PhysicalScheduleDocumentVisibility {
  const paymentKey = Number(stepperAPIData?.SelectedPaymentOption?.Key);
  const noOfInstallments = Number(stepperAPIData?.NoOfInstallments);

  const isPdcPayment = paymentKey === 1 || paymentKey === 3;
  const isAllCard = paymentKey === 2;
  const isCardAndDirectDebit = paymentKey === 4;

  return {
    showRenewalProposal: true,
    showPdcDocument: isPdcPayment,
    showCreditCardSideLetter: isAllCard && noOfInstallments !== 1,
    showDirectDebitDocument: isCardAndDirectDebit,
    showDirectDebitSideLetter: isCardAndDirectDebit,
  };
}
