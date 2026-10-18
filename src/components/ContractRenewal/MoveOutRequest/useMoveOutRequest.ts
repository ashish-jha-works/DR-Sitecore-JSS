'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

export interface MoveOutReasonItem {
  id: number;
  label: string;
  category: string;
}

export interface MoveOutOption {
  value: string;
  label: string;
}

const CATEGORY_ORDER = [
  'Relocation',
  'Financial Reasons',
  'Property & Maintenance Issues',
  'Environmental & Community Issues',
  'Miscellaneous',
  'Other',
];

function normalizeMoveOutReasons(data: unknown): MoveOutReasonItem[] {
  if (!data) return [];

  const list = Array.isArray(data) ? data : (data as { MoveoutReasons?: unknown })?.MoveoutReasons;

  if (!Array.isArray(list)) return [];

  return list
    .map((item) => {
      if (typeof item === 'string') {
        return {
          id: 0,
          label: item,
          category: 'Other',
        };
      }

      const reasonItem = item as {
        Id?: number;
        MoveoutReason?: string;
        Category?: string;
      };

      if (!reasonItem.MoveoutReason) return null;

      return {
        id: reasonItem.Id ?? 0,
        label: reasonItem.MoveoutReason,
        category: reasonItem.Category || 'Other',
      };
    })
    .filter((option): option is MoveOutReasonItem => Boolean(option));
}

function getCategoryOptions(reasons: MoveOutReasonItem[]): MoveOutOption[] {
  const uniqueCategories = [...new Set(reasons.map((reason) => reason.category))];

  return uniqueCategories
    .sort((a, b) => {
      const aIndex = CATEGORY_ORDER.indexOf(a);
      const bIndex = CATEGORY_ORDER.indexOf(b);

      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    })
    .map((category) => ({
      value: category,
      label: category,
    }));
}

function formatMoveOutApiDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function useMoveOutRequest() {
  const router = useRouter();
  const { tCode, LeaseEndDate, setUserData } = useUserStore();
  const { openModal } = useUIStore();

  const [moveOutReasons, setMoveOutReasons] = useState<MoveOutReasonItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedReasonId, setSelectedReasonId] = useState('');
  const [isReasonsReady, setIsReasonsReady] = useState(false);

  const { mutate: fetchMoveOutReasons, isPending: isLoadingReasons } = useApiMutation<any, any>(
    () => '/MoveOut/MoveoutReasons',
    'GET',
    true
  );

  const { mutate: fetchProfile } = useApiMutation<any, any>(
    () => `/Tenant/${tCode}/Notifications/ProfileLiteApps`,
    'GET',
    false
  );

  const { mutate: submitMoveOutNotice, isPending: isSubmitting } = useApiMutation<any, any>(
    () => '/ContractRenewal/MoveOutNotice',
    'POST',
    true
  );

  const leaseEndDate = LeaseEndDate ?? '';

  const categoryOptions = useMemo(() => getCategoryOptions(moveOutReasons), [moveOutReasons]);

  const specificReasonOptions = useMemo(
    () =>
      moveOutReasons
        .filter((reason) => reason.category === selectedCategory)
        .map((reason) => ({
          value: String(reason.id),
          label: reason.label,
        })),
    [moveOutReasons, selectedCategory]
  );

  const selectedReasonLabel = useMemo(
    () => moveOutReasons.find((reason) => String(reason.id) === selectedReasonId)?.label ?? '',
    [moveOutReasons, selectedReasonId]
  );

  const isSubmitDisabled =
    !selectedCategory ||
    !selectedReasonId ||
    !leaseEndDate ||
    isSubmitting ||
    isLoadingReasons ||
    !isReasonsReady;

  useEffect(() => {
    if (!tCode) return;

    let isCancelled = false;

    fetchMoveOutReasons(null, {
      onSuccess: (response) => {
        if (isCancelled) return;

        const reasons = normalizeMoveOutReasons(response);
        setMoveOutReasons(reasons);
        setIsReasonsReady(true);

        if (!reasons.length) {
          openModal('error-modal');
        }
      },
      onError: () => {
        if (isCancelled) return;

        setIsReasonsReady(true);
        openModal('error-modal');
      },
    });

    return () => {
      isCancelled = true;
    };
  }, [tCode, fetchMoveOutReasons, openModal]);

  useEffect(() => {
    if (!tCode || LeaseEndDate) return;

    fetchProfile(null, {
      onSuccess: (response) => {
        if (response?.LeaseEndDate) {
          setUserData({ LeaseEndDate: response.LeaseEndDate });
        }
      },
    });
  }, [tCode, LeaseEndDate, fetchProfile, setUserData]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedReasonId('');
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  const handleSubmit = () => {
    if (!tCode || isSubmitDisabled || !selectedReasonLabel) return;

    const today = formatMoveOutApiDate(new Date().toISOString());

    submitMoveOutNotice(
      {
        ProposalId: '',
        TenantCode: tCode,
        Reason_for_move_out: selectedReasonLabel,
        Move_out_date: formatMoveOutApiDate(leaseEndDate),
        Notice_type: 'Normal Termination',
        Notice_Date: today,
        Source: 'NA',
      },
      {
        onSuccess: (response) => {
          if (response?.CreateMoveOutNotice?.Status === 'Success') {
            router.push('/move-out');
            return;
          }

          openModal('error-modal');
        },
        onError: () => {
          openModal('error-modal');
        },
      }
    );
  };

  return {
    categoryOptions,
    specificReasonOptions,
    selectedCategory,
    selectedReasonId,
    isSubmitDisabled,
    isReasonsReady,
    handleCategoryChange,
    setSelectedReasonId,
    handleCancel,
    handleSubmit,
  };
}
