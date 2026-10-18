'use client';

import { useEffect, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';
import { Card } from '../PaymentsPage/payment.types';
import { getLastDayOfMonthDate, isExpired } from 'lib/utils/helper';
import { usePathname } from 'next/navigation';

export const useManageCards = () => {
  const pathname = usePathname();
  const { tCode, LeaseEndDate, ProposalEndDate } = useUserStore();
  const { openModal } = useUIStore();
  const setUserData = useUserStore((state) => state.setUserData);

  const [cardsLoaded, setCardsLoaded] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [primaryCard, setPrimaryCard] = useState<Card>();
  const [leaseEndData, setLeaseEndDate] = useState('');
  const [proposalEndData, setProposalEndDate] = useState('');
  const [selectedCard, setSelectedCard] = useState<any>();
  const [selectedDeleteCard, setSelectedDeleteCard] = useState<Card>();
  const [showPrimaryCardDeleteWarning, setShowPrimaryCardDeleteWarning] = useState(false);
  const [cardRef, setCardRef] = useState<string>('');

  // Modal Flags
  const [isCardReplaced, setIsCardReplaced] = useState(true);

  /* ---------------- API's ---------------- */

  const { mutate: fetchCards, isPending: isLoadingCards } = useApiMutation<any, any>(
    `/v1/payments/${tCode}/cards`,
    'GET',
    false
  );

  const { mutate: mutateProfileData } = useApiMutation<any, any>(
    () => `/Tenant/${tCode}/Notifications/ProfileLiteApps`,
    'GET',
    false
  );

  const { mutate: deleteCard } = useApiMutation<any, any>(
    () => `/v1/payments/${tCode}/cards/${selectedDeleteCard?.CardId}`,
    'DELETE',
    true
  );

  const { mutate: setDefaultCard } = useApiMutation<any, any>(
    () => `/v1/payments/${tCode}/SetAsDefault/${selectedCard?.CardId}`,
    'POST',
    false
  );
  const { mutate: getAccessToken } = useApiMutation<any, any>(
    () => `/v1/payments/gateway/token`,
    'GET',
    true
  );
  const { mutate: createOrder } = useApiMutation<any, any>(
    () => `/v1/payments/gateway/${tCode}/order`,
    'POST',
    true
  );

  const { mutate: getOrderDetails } = useApiMutation<any, any>(
    () => `/v1/payments/gateway/${tCode}/order/${cardRef}/2`,
    'GET',
    false
  );

  /* ---------------- Handlers ---------------- */

  const shouldShowError = (cardExpiry: string, leaseEndDate: string, proposalEndDate: string) => {
    const expiry = getLastDayOfMonthDate(cardExpiry);
    const notExpired = !isExpired(cardExpiry);
    const beforeLease = expiry < new Date(leaseEndDate);
    const beforeProposal = expiry < new Date(proposalEndDate);

    return notExpired && (beforeLease || beforeProposal);
  };

  const handleDeleteCard = (card: Card) => {
    if (card.CanBeDeleted) {
      openModal('delete-card-modal');
      setSelectedDeleteCard(card);
    } else {
      setShowPrimaryCardDeleteWarning(true);
      setTimeout(() => {
        setShowPrimaryCardDeleteWarning(false);
      }, 5000);
    }
  };

  const handleConfirmDelete = () => {
    openModal('delete-card-modal');
    deleteCard(null, {
      onSuccess: (response: Card[]) => {
        if (response !== null) {
          const _cards = cards.filter((card) => card.CardId !== selectedDeleteCard?.CardId);
          setCards(_cards);
          openModal('delete-card-success-modal');
        } else {
          openModal('error-modal');
        }
      },
      onError: (error) => {
        openModal('error-modal');
        console.error('Error while deleting card', error);
      },
    });
  };

  const loadProfile = () => {
    mutateProfileData(null, {
      onSuccess: (response: any) => {
        if (response) {
        } else {
          openModal('error-modal');
        }
      },
      onError: () => {
        openModal('error-modal');
      },
    });
  };

  const handleAddNewCard = () => {
    console.log(pathname);
    fetchAccessToken((token) => {
      getOrderIdForOutstanding(token);
    });
  };

  const fetchAccessToken = (onSuccess: (token: string) => void) => {
    getAccessToken(null, {
      onSuccess: (response: any) => {
        if (!response?.access_token) {
          openModal('error-modal');
          return;
        }
        onSuccess(response.access_token);
      },
      onError: () => {
        openModal('error-modal');
      },
    });
  };

  const getOrderIdForOutstanding = (paymentToken: string) => {
    const redirectURL = `${window.location.origin}${pathname}`;

    const payload = {
      TransactionItems: [],
      UserJourneyId: '4',
      Transaction: {
        action: 'SALE',
        amount: {
          currencyCode: 'AED',
          value: '100',
        },
        merchantAttributes: {
          redirectUrl: redirectURL,
          skip3DS: 'false',
          cancelText: 'Cancel',
          cancelUrl: `${redirectURL}?rd=1`,
        },
      },
    };

    createOrder(
      {
        ...payload,
        _headers: {
          token: paymentToken,
        },
      },
      {
        onSuccess: (response: any) => {
          if (response?.PaymentsUrl) {
            window.location.href = response.PaymentsUrl;
          } else {
            openModal('error-modal');
          }
        },
        onError: () => {
          openModal('error-modal');
        },
      }
    );
  };

  const getOrderDetailsForOutstanding = (paymentToken: string) => {
    getOrderDetails(
      {
        _headers: {
          token: paymentToken,
        },
      },
      {
        onSuccess: (response: any) => {
          if (response?.PaymentStatus === 'CAPTURED') {
            openModal('add-card-success-modal');
          } else {
            openModal('add-card-failure-modal');
          }

          // Always refresh so existing cards show after success or decline
          loadCards();

          // Clean URL params
          window.history.replaceState({}, '', window.location.pathname);
        },
        onError: () => {
          openModal('error-modal');
          loadCards();
        },
      }
    );
  };

  const loadCards = () => {
    fetchCards(null, {
      onSuccess: (response: Card[]) => {
        setCardsLoaded(true);
        if (response?.length) {
          const sortedCards = response.sort((a, b) => {
            if (a.IsSelected === b.IsSelected) return 0;
            return a.IsSelected ? -1 : 1;
          });

          setCards(sortedCards);

          const _primaryCard = response.find((card) => card.IsSelected === true);

          if (_primaryCard) {
            setPrimaryCard(_primaryCard);
            setSelectedCard(_primaryCard);
          } else {
            setPrimaryCard(undefined);
            setSelectedCard(sortedCards[0]);
          }
        } else {
          setCards([]);
          setPrimaryCard(undefined);
          setSelectedCard(undefined);
        }
      },
      onError: (error) => {
        openModal('error-modal');
        console.error('Error while fetching card details', error);
      },
    });
  };

  const handleSaveChanges = () => {
    if (!selectedCard?.CardId) return;

    setDefaultCard(null, {
      onSuccess: (response: any) => {
        if (response !== null) {
          if (primaryCard?.CardId === undefined) {
            setIsCardReplaced(false);
          } else {
            setIsCardReplaced(true);
          }

          const updatedCards = cards.map((card) => {
            const isPrimary = card.CardId === selectedCard.CardId;
            return {
              ...card,
              IsSelected: isPrimary,
              CanBeDeleted: !isPrimary,
            };
          });

          const nextPrimary = updatedCards.find((card) => card.CardId === selectedCard.CardId);

          setCards(updatedCards);
          setPrimaryCard(nextPrimary);
          setSelectedCard(nextPrimary);
          openModal('card-replaced-modal');
        } else {
          openModal('error-modal');
        }
      },
      onError: (error) => {
        openModal('error-modal');
        console.error('Error while saving card change', error);
      },
    });
  };

  /* ---------------- Effects ---------------- */

  // useEffect(() => {
  //   if (tCode) {
  //     fetchCards(null, {
  //       onSuccess: (response: Card[]) => {
  //         setCardsLoaded(true);
  //         if (response?.length) {
  //           const sortedCards = response.sort((a, b) => {
  //             if (a.IsSelected === b.IsSelected) return 0;
  //             return a.IsSelected ? -1 : 1;
  //           });

  //           setCards(sortedCards);

  //           const _primaryCard = response.find((card) => card.IsSelected === true);

  //           if (_primaryCard) {
  //             setPrimaryCard(_primaryCard);
  //             setSelectedCard(_primaryCard);
  //           }
  //         }
  //       },
  //       onError: (error) => {
  //         openModal('error-modal');
  //         console.error('Error while fetching card details', error);
  //       },
  //     });
  //   }
  // }, [tCode, fetchCards]);

  useEffect(() => {
    loadProfile();

    const refFromUrl =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('ref') || ''
        : '';

    // Always load saved cards; gateway return only checks order status
    loadCards();

    if (refFromUrl) {
      setCardRef(refFromUrl);
    }
  }, []);

  useEffect(() => {
    if (!cardRef) return;

    fetchAccessToken((token) => {
      getOrderDetailsForOutstanding(token);
    });
  }, [cardRef]);

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
        onError: (error) => {
          console.error('Error loading profile data:', error);
          openModal('error-modal');
        },
      });
    }
  }, [LeaseEndDate, ProposalEndDate, tCode, mutateProfileData]);

  return {
    cardsLoaded,
    cards,
    primaryCard,
    leaseEndData,
    proposalEndData,
    selectedCard,
    selectedDeleteCard,
    showPrimaryCardDeleteWarning,
    isCardReplaced,
    isLoadingCards,

    setSelectedCard,

    shouldShowError,
    handleDeleteCard,
    handleConfirmDelete,
    handleAddNewCard,
    handleSaveChanges,
  };
};
