import { LeaseCharge, LeaseChargeSummary } from './paymentPlan.types';

/**
 * Splits a long "amount in words" string into two lines so it fits the receipt layout.
 * Returns the original string unmodified if it's short enough or has no breakable space.
 */
export function separatedAmount(amount: string): string {
  if (!amount || typeof amount !== 'string') return '';

  const fullAmount = `${amount.trim()} only`;
  if (fullAmount.length < 54) return fullAmount;

  const firstPart = fullAmount.slice(0, 54);
  const splitIndex = firstPart.lastIndexOf(' ');

  // No breakable space found within the limit, return as-is
  if (splitIndex === -1) return fullAmount;

  const line1 = fullAmount.slice(0, splitIndex);
  const line2 = fullAmount.slice(splitIndex + 1);
  return `${line1}~;${line2}`;
}

// Sums lease charges into total / Ejari fees / admin fee buckets
export function summarizeLeaseCharges(leaseCharges: LeaseCharge[]): LeaseChargeSummary {
  return leaseCharges.reduce<LeaseChargeSummary>(
    (acc, item) => {
      const amount = Number(item.Amount) || 0;
      acc.total += amount;

      if (
        item.Charge_Description === 'Ejari Fees' ||
        item.Charge_Description === 'Ejari Admin Fees'
      ) {
        acc.ejariFees += amount;
      }
      if (item.Charge_Description === 'Admin Fees') {
        acc.adminFee += amount;
      }
      return acc;
    },
    { total: 0, ejariFees: 0, adminFee: 0 }
  );
}
