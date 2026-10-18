'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, isBefore, startOfDay, subDays } from 'date-fns';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';
import { formatDate } from 'src/utils/formatDate';
import { formatToYYYYMMDD } from 'lib/utils/helper';

export function useRemindMeLater(isOpen: boolean, onClose: () => void) {
  const router = useRouter();
  const { tCode, LeaseEndDate } = useUserStore();
  const { openModal } = useUIStore();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [proposalId, setProposalId] = useState('');

  const { mutate: fetchRenewalStepper } = useApiMutation<any, any>(
    () => `/ContractRenewal/Stepper/${tCode}`,
    'GET',
    false
  );

  const { mutate: trackRemindLater, isPending: isSubmitting } = useApiMutation<any, any>(
    () => '/ContractRenewal/TrackContractDetails',
    'POST',
    true
  );

  const formattedLeaseEndDate = useMemo(
    () => (LeaseEndDate ? formatDate(LeaseEndDate) : ''),
    [LeaseEndDate]
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      const day = startOfDay(date);
      const today = startOfDay(new Date());

      if (isBefore(day, today)) return true;

      if (!LeaseEndDate) return false;

      const lastSelectableDay = subDays(startOfDay(new Date(LeaseEndDate)), 6);
      return !isBefore(day, lastSelectableDay);
    },
    [LeaseEndDate]
  );

  useEffect(() => {
    if (!isOpen || !tCode) return;

    setSelectedDate(undefined);

    fetchRenewalStepper(null, {
      onSuccess: (response) => {
        setProposalId(response?.ProposalId ?? '');
      },
    });
  }, [isOpen, tCode, fetchRenewalStepper]);

  const submitRemindLater = useCallback((): Promise<boolean> => {
    if (!tCode || !selectedDate) return Promise.resolve(false);

    return new Promise((resolve) => {
      trackRemindLater(
        {
          ProfileId: tCode,
          ProposalId: proposalId,
          RemindForRenewalOn: format(selectedDate, 'yyyy-MM-dd'),
        },
        {
          onSuccess: (response) => {
            if (response?.Status === 'Success') {
              onClose();
              router.push('/dashboard');
              resolve(true);
              return;
            }

            openModal('error-modal');
            resolve(false);
          },
          onError: () => {
            openModal('error-modal');
            resolve(false);
          },
        }
      );
    });
  }, [tCode, selectedDate, proposalId, trackRemindLater, onClose, router, openModal]);

  const calendarDate = selectedDate ? (formatToYYYYMMDD(selectedDate) as string) : '';
  const isAddToCalendarDisabled = !selectedDate || isSubmitting;

  return {
    selectedDate,
    setSelectedDate,
    formattedLeaseEndDate,
    isDateDisabled,
    calendarDate,
    isAddToCalendarDisabled,
    isSubmitting,
    submitRemindLater,
  };
}
