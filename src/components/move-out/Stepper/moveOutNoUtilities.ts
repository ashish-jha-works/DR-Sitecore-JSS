import { StepItem } from 'components/common/Stepper';

/** Backend `/MoveOut/Stepper` step Ids (always 1–5). */
export const MOVE_OUT_API_STEPS = {
  BANK_DETAILS: 1,
  UTILITIES_TERMINATION: 2,
  MOVE_OUT_PERMIT: 3,
  SCHEDULE_INSPECTION: 4,
  FINAL_DOCUMENTS: 5,
} as const;

const HIDDEN_WHEN_NO_UTILITIES = new Set<number>([
  MOVE_OUT_API_STEPS.UTILITIES_TERMINATION,
  MOVE_OUT_API_STEPS.FINAL_DOCUMENTS,
]);

let cachedTCode: string | null = null;
let cachedHasUtilities: boolean | null = null;

export function getCachedHasMoveOutUtilities(tCode?: string | null): boolean | null {
  if (!tCode || cachedTCode !== tCode) return null;
  return cachedHasUtilities;
}

export function setCachedHasMoveOutUtilities(tCode: string, hasUtilities: boolean) {
  cachedTCode = tCode;
  cachedHasUtilities = hasUtilities;
}

export function hasMoveOutUtilities(utilities: unknown): boolean {
  return Array.isArray(utilities) && utilities.length > 0;
}

/** no-utilities stepper: Bank Details → Move-Out Permit → Schedule Inspection. */
export function mapSteppersForDisplay(steppers: StepItem[], hasUtilities: boolean): StepItem[] {
  if (hasUtilities) return steppers;

  return steppers
    .filter((item) => !HIDDEN_WHEN_NO_UTILITIES.has(item.step))
    .map((item, index) => ({
      ...item,
      step: index + 1,
    }));
}

export function mapApiStepToDisplayStep(apiStep: number, hasUtilities: boolean): number {
  if (hasUtilities) return apiStep;

  switch (apiStep) {
    case MOVE_OUT_API_STEPS.BANK_DETAILS:
      return 1;
    case MOVE_OUT_API_STEPS.UTILITIES_TERMINATION:
    case MOVE_OUT_API_STEPS.MOVE_OUT_PERMIT:
      return 2;
    case MOVE_OUT_API_STEPS.SCHEDULE_INSPECTION:
    case MOVE_OUT_API_STEPS.FINAL_DOCUMENTS:
      return 3;
    default:
      return apiStep;
  }
}

/** After bank details: skip terminate + upload-docs when there are no utilities. */
export function getPostBankDetailsStepperPayload(tCode: string, hasUtilities: boolean) {
  if (hasUtilities) {
    return {
      ProfileId: tCode,
      IsBankDetailsSubmitted: true,
      UserState: MOVE_OUT_API_STEPS.BANK_DETAILS,
    };
  }

  return {
    ProfileId: tCode,
    IsBankDetailsSubmitted: true,
    IsUtilityTerminationPageVisited: true,
    // Complete utilities step so active step becomes Move-Out Permit (3).
    UserState: MOVE_OUT_API_STEPS.UTILITIES_TERMINATION,
  };
}

export function getPostBankDetailsRoute(hasUtilities: boolean) {
  return hasUtilities ? '/move-out/terminate-utilities' : '/move-out/move-out-permit';
}
