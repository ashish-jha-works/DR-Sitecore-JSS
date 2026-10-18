import { useEffect, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import { Card } from 'components/payments/PaymentsPage/payment.types';
import { getLastDayOfMonthDate, isExpired } from 'lib/utils/helper';

export const usePaymentWithCard = (setSelectedCard: any, cardsValidUntilDate: any) => {
  const { tCode, LeaseEndDate, ProposalEndDate } = useUserStore();
  const { openModal } = useUIStore();
  const setUserData = useUserStore((state) => state.setUserData);

  const [cards, setCards] = useState<any[]>([]);
  const [primaryCard, setPrimaryCard] = useState<Card>();
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [leaseEndData, setLeaseEndDate] = useState('');
  const [proposalEndData, setProposalEndDate] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const { mutate: fetchCards } = useApiMutation<any, any>(
    `/v1/payments/${tCode}/cards`,
    'GET',
    false
  );

  const { mutate: mutateProfileData } = useApiMutation<any, any>(
    () => `/v1/Tenant/${tCode}/Notifications/ProfileLiteApps`,
    'GET',
    false
  );

  const shouldShowError = (cardExpiry: string, leaseEndDate: string, proposalEndDate: string) => {
    const expiry = getLastDayOfMonthDate(cardExpiry);
    const notExpired = !isExpired(cardExpiry);
    const beforeLease = expiry < new Date(leaseEndDate);
    const beforeProposal = expiry < new Date(proposalEndDate);

    return notExpired && (beforeLease || beforeProposal);
  };

  useEffect(() => {
    if (tCode) {
      fetchCards(null, {
        onSuccess: (response) => {
          if (response != null) {
            setCards(
              response
                .filter(
                  (card: any) =>
                    !isExpired(card.ExpiryDate) &&
                    getLastDayOfMonthDate(card.ExpiryDate) > new Date(cardsValidUntilDate) // To exclude cards whose card Expiry is before lease start or end date based upon the payment method we chose
                )
                .sort((a: any, b: any) => {
                  if (a.IsSelected === b.IsSelected) return 0;
                  return a.IsSelected ? -1 : 1;
                })
            );
            setIsCardsLoading(false);
            const _primaryCard = response.find((card: any) => card.IsSelected === true);

            if (_primaryCard) {
              setPrimaryCard(_primaryCard);
              setSelectedCard(_primaryCard);
            }
          } else {
            openModal('error-modal');
          }
        },
        onError: () => {
          openModal('error-modal');
        },
      });
    }
  }, [cardsValidUntilDate]);

  useEffect(() => {
    if (LeaseEndDate || ProposalEndDate) {
      if (LeaseEndDate) setLeaseEndDate(LeaseEndDate);
      if (ProposalEndDate) setProposalEndDate(ProposalEndDate);
    } else if (tCode) {
      mutateProfileData(null, {
        onSuccess: (response) => {
          setUserData({
            LeaseEndDate: response?.LeaseEndDate,
            ProposalEndDate: response?.ProposalEndDate,
          });
        },
      });
    }
  }, [LeaseEndDate, ProposalEndDate, tCode, mutateProfileData]);

  return {
    cards,
    primaryCard,
    isCardsLoading,
    isExpired,
    shouldShowError,
    leaseEndData,
    proposalEndData,
    showTooltip,
    setShowTooltip,
  };
};
