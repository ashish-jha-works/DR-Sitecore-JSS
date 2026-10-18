import { useCallback, useEffect, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';

const capitalizeCode = (code?: string) => {
  if (!code) return '';
  return code.charAt(0).toUpperCase() + code.slice(1);
};

const getSpaceCodes = (items: any[] | undefined, chargeCode: string) =>
  Array.from(
    new Set(
      (items ?? [])
        .filter((item) => item.Admin_Fee_Chargecode === chargeCode)
        .map((item) => capitalizeCode(item.rentable_item_code))
        .filter(Boolean)
    )
  );

export const useParkingStorage = (tCode: string | null) => {
  const [parkingSpaces, setParkingSpaces] = useState<string[]>([]);
  const [storageSpaces, setStorageSpaces] = useState<string[]>([]);

  const { mutate: fetchParkingStorage, isPending: isLoading } = useApiMutation<null, any>(
    () => `/Profile/Parking/${tCode}`,
    'GET',
    false
  );

  const loadParkingStorage = useCallback(() => {
    if (!tCode) return;

    fetchParkingStorage(null, {
      onSuccess: (response) => {
        const summary = response?.PortalFetchTenantParkStorageSummary;
        setParkingSpaces(getSpaceCodes(summary, 'Parkadmn'));
        setStorageSpaces(getSpaceCodes(summary, 'Storadmn'));
      },
      onError: () => {
        setParkingSpaces([]);
        setStorageSpaces([]);
      },
    });
  }, [tCode, fetchParkingStorage]);

  useEffect(() => {
    loadParkingStorage();
  }, [loadParkingStorage]);

  return {
    parkingSpaces,
    storageSpaces,
    hasParking: parkingSpaces.length > 0,
    hasStorage: storageSpaces.length > 0,
    hasAny: parkingSpaces.length > 0 || storageSpaces.length > 0,
    isLoading,
  };
};
