export function isRenewalSignStepComplete(stepperResponse: any): boolean {
  return Boolean(
    stepperResponse?.Schedule_Type ||
      stepperResponse?.IsDocumentSigned ||
      stepperResponse?.Steppers?.find((item: any) => Number(item.Id) === 3)?.StepCompleted
  );
}

export function getResolvedRenewalStep(stepperResponse: any): number {
  const isShortTerm = Boolean(stepperResponse?.IsShortTermRenewal);
  const signComplete = isRenewalSignStepComplete(stepperResponse);
  let resolvedStep = 4;

  for (const item of stepperResponse?.Steppers ?? []) {
    const stepId = Number(item.Id);
    if (isShortTerm && stepId === 1) continue;
    if (stepId === 3 && signComplete) continue;
    if (item.StepCompleted) continue;
    resolvedStep = stepId;
    break;
  }

  return resolvedStep;
}

export function areAllRenewalStepsComplete(stepperResponse: any): boolean {
  const isShortTerm = Boolean(stepperResponse?.IsShortTermRenewal);
  const signComplete = isRenewalSignStepComplete(stepperResponse);

  return (stepperResponse?.Steppers ?? []).every((item: any) => {
    if (isShortTerm && Number(item.Id) === 1) return true;
    if (Number(item.Id) === 3 && signComplete) return true;
    return Boolean(item.StepCompleted);
  });
}

export function mapRenewalSteppersForDisplay(stepperResponse: any) {
  const signComplete = isRenewalSignStepComplete(stepperResponse);

  return (stepperResponse?.Steppers ?? []).map((item: any) => {
    const stepId = Number(item.Id);
    return {
      step: stepId,
      name: item.Description,
      back_stepping: item.BackAllowed,
      stepDone: Boolean(item.StepCompleted) || (stepId === 3 && signComplete),
    };
  });
}

export function resolveShortTermRenewalRoute(
  stepperResponse: any,
  resolvedStep: number,
  allStepsComplete: boolean
): string | null {
  if (!stepperResponse?.IsShortTermRenewal) return null;

  if (allStepsComplete) {
    return '/contract-renewal/summary';
  }

  const paymentKey = Number(stepperResponse?.SelectedPaymentOption?.Key);
  const hasPaymentOption = Boolean(paymentKey);

  // Before payment method is chosen, stay on short-term proposal page
  if (!hasPaymentOption && resolvedStep <= 2) {
    return '/contract-renewal/short-term';
  }

  // Step 2 for short-term: pay / upload / sign
  if (resolvedStep === 2 && hasPaymentOption) {
    if (paymentKey === 1) {
      if (stepperResponse?.Schedule_Type) {
        return '/contract-renewal/collection-scheduled';
      }

      if (stepperResponse?.AnyDocFailed) {
        return '/contract-renewal/upload-documents';
      }
      return '/contract-renewal/sign-contract';
    }

    if (paymentKey === 4) {
      return stepperResponse?.HasSubmittedDD
        ? '/contract-renewal/pay-renewal?po=4'
        : '/contract-renewal/direct-debit-form';
    }

    return `/contract-renewal/pay-renewal?po=${paymentKey}`;
  }

  if (resolvedStep === 3) {
    if (stepperResponse?.Schedule_Type) {
      return '/contract-renewal/collection-scheduled';
    }
    if (stepperResponse?.AnyDocFailed) {
      return '/contract-renewal/upload-documents';
    }
    return '/contract-renewal/sign-contract';
  }

  return null;
}
