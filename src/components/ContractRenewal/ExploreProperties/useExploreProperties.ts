'use client';

import { useRouter } from 'next/navigation';
import { addDays, format, isAfter, startOfDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

export const PRICE_MIN = 0;
export const PRICE_MAX = 200;
export const PRICE_STEP = 1;

export const AREA_MIN = 0;
export const AREA_MAX = 5000;
export const AREA_STEP = 100;
export const AREA_MAX_DEFAULT = '5000';

interface SearchPropertyItem {
  Id: number;
  Description: string;
}

interface ExplorePropertiesResponse {
  CommunityList?: SearchPropertyItem[];
}

interface SearchPropertiesResponse {
  SearchPropertiesResult?: SearchPropertyItem[];
}

interface CaptureInterestResponse {
  CreateSR?: { Status?: string }[];
}

function mapSearchResults(items?: SearchPropertyItem[]) {
  if (!items?.length) return [];

  return items.map((item) => ({
    value: String(item.Id),
    label: item.Description,
    description: item.Description,
  }));
}

function mapBedroomOptions(items?: SearchPropertyItem[]) {
  if (!items?.length) return [];

  return items.map((item) => ({
    value: item.Description,
    label: item.Description,
  }));
}

function formatMoveInDate(date: Date) {
  return format(date, 'dd MMM yyyy');
}

function mapBedroomsForSubmit(description: string | any) {
  if (description.toLowerCase() === 'studio') return '0';
  return description.split(' ')[0];
}

export function useExploreProperties() {
  const router = useRouter();
  const { tCode, LeaseEndDate, setUserData } = useUserStore();
  const { openModal } = useUIStore();

  const [community, setCommunity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState<string | number>('');
  const [areaRange, setAreaRange] = useState<[number, number]>([AREA_MIN, AREA_MAX]);
  const [areaMinInput, setAreaMinInput] = useState('');
  const [areaMaxInput, setAreaMaxInput] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [priceMinInput, setPriceMinInput] = useState('');
  const [priceMaxInput, setPriceMaxInput] = useState('');
  const [moveInDate, setMoveInDate] = useState<Date | null>(null);

  const [communityOptions, setCommunityOptions] = useState<
    { value: string; label: string; description: string }[]
  >([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<
    { value: string; label: string; description: string }[]
  >([]);
  const [bedroomOptions, setBedroomOptions] = useState<{ value: string; label: string }[]>([]);

  const [isCommunitiesReady, setIsCommunitiesReady] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [emptyCommunityMessage, setEmptyCommunityMessage] = useState('');
  const [emptyPropertyTypeMessage, setEmptyPropertyTypeMessage] = useState('');

  const { mutate: fetchExploreProperties, isPending: isLoadingInitial } = useApiMutation<
    null,
    ExplorePropertiesResponse
  >(() => `/ContractRenewal/ExploreProperties?tCode=${tCode}`, 'GET', true);

  const { mutate: fetchPropertyTypes, isPending: isLoadingPropertyTypes } = useApiMutation<
    string,
    SearchPropertiesResponse
  >((communityId) => `/ContractRenewal/FetchPropertiesTypes/${communityId}`, 'GET', true);

  const { mutate: fetchBedroomTypes, isPending: isLoadingBedrooms } = useApiMutation<
    string,
    SearchPropertiesResponse
  >((propertyTypeId) => `/ContractRenewal/FetchBedRoomTypes/${propertyTypeId}`, 'GET', true);

  const { mutate: fetchProfileLite } = useApiMutation<any, any>(
    () => `/Tenant/${tCode}/Notifications/ProfileLiteApps`,
    'GET',
    false
  );

  const { mutate: submitCaptureInterest, isPending: isSubmitting } = useApiMutation<
    Record<string, string>,
    CaptureInterestResponse
  >(() => '/ContractRenewal/CaptureInterest', 'POST', true);

  const selectedCommunity = useMemo(
    () => communityOptions.find((option) => option.value === community),
    [community, communityOptions]
  );

  const selectedPropertyType = useMemo(
    () => propertyTypeOptions.find((option) => option.value === propertyType),
    [propertyType, propertyTypeOptions]
  );

  const moveInDisableBefore = useMemo(() => addDays(startOfDay(new Date()), 1), []);

  const moveInDisableAfter = useMemo(() => {
    if (!LeaseEndDate) return undefined;

    const leaseEnd = startOfDay(new Date(LeaseEndDate));
    return isAfter(leaseEnd, new Date()) ? leaseEnd : undefined;
  }, [LeaseEndDate]);

  const showPropertyTypesSection = Boolean(
    community && !emptyCommunityMessage && propertyTypeOptions.length > 0
  );
  const showBedroomsSection = Boolean(
    propertyType &&
      showPropertyTypesSection &&
      !emptyPropertyTypeMessage &&
      bedroomOptions.length > 0
  );
  const showFiltersAfterBedroom = Boolean(bedrooms);

  const isConfirmDisabled =
    !community ||
    !propertyType ||
    !bedrooms ||
    !moveInDate ||
    isLoadingInitial ||
    isLoadingPropertyTypes ||
    isLoadingBedrooms ||
    isSubmitting ||
    Boolean(emptyCommunityMessage) ||
    Boolean(emptyPropertyTypeMessage);

  const resetPropertySelections = useCallback(() => {
    setPropertyType('');
    setBedrooms('');
    setPropertyTypeOptions([]);
    setBedroomOptions([]);
    setEmptyPropertyTypeMessage('');
    setAreaRange([AREA_MIN, AREA_MAX]);
    setAreaMinInput('');
    setAreaMaxInput('');
    setMoveInDate(null);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setPriceMinInput('');
    setPriceMaxInput('');
  }, []);

  const resetBedroomSelections = useCallback(() => {
    setBedrooms('');
    setBedroomOptions([]);
    setAreaRange([AREA_MIN, AREA_MAX]);
    setAreaMinInput('');
    setAreaMaxInput('');
    setMoveInDate(null);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setPriceMinInput('');
    setPriceMaxInput('');
  }, []);

  useEffect(() => {
    if (!tCode) return;

    let isCancelled = false;

    fetchExploreProperties(null, {
      onSuccess: (response) => {
        if (isCancelled) return;

        const options = mapSearchResults(response?.CommunityList);
        setCommunityOptions(options);
        setIsCommunitiesReady(true);

        if (!options.length) {
          openModal('error-modal');
        }
      },
      onError: () => {
        if (isCancelled) return;
        setIsCommunitiesReady(true);
        openModal('error-modal');
      },
    });

    return () => {
      isCancelled = true;
    };
  }, [tCode, fetchExploreProperties, openModal]);

  useEffect(() => {
    if (!tCode || LeaseEndDate) return;

    fetchProfileLite(null, {
      onSuccess: (response) => {
        if (response?.LeaseEndDate) {
          setUserData({ LeaseEndDate: response.LeaseEndDate });
        }
      },
    });
  }, [tCode, LeaseEndDate, fetchProfileLite, setUserData]);

  const handleCommunityChange = (communityId: string) => {
    setCommunity(communityId);
    resetPropertySelections();
    setEmptyCommunityMessage('');

    if (!communityId) return;

    const communityLabel =
      communityOptions.find((option) => option.value === communityId)?.label ?? '';

    fetchPropertyTypes(communityId, {
      onSuccess: (response) => {
        const options = mapSearchResults(response?.SearchPropertiesResult);
        setPropertyTypeOptions(options);

        if (!options.length) {
          setEmptyCommunityMessage(communityLabel);
        }
      },
      onError: () => {
        openModal('error-modal');
      },
    });
  };

  const handlePropertyTypeChange = (propertyTypeId: string) => {
    setPropertyType(propertyTypeId);
    resetBedroomSelections();
    setEmptyPropertyTypeMessage('');

    if (!propertyTypeId) return;

    const propertyTypeLabel =
      propertyTypeOptions.find((option) => option.value === propertyTypeId)?.label ?? '';

    fetchBedroomTypes(propertyTypeId, {
      onSuccess: (response) => {
        const options = mapBedroomOptions(response?.SearchPropertiesResult);
        setBedroomOptions(options);

        if (!options.length) {
          setEmptyPropertyTypeMessage(propertyTypeLabel);
        }
      },
      onError: () => {
        openModal('error-modal');
      },
    });
  };

  const handleAreaRangeChange = (value: [number, number]) => {
    const [min, max] = value;
    setAreaRange([min, max]);
    setAreaMinInput(min <= AREA_MIN ? '' : String(min));
    setAreaMaxInput(max >= AREA_MAX ? '' : String(max));
  };

  const handleAreaMinInputChange = (value: string) => {
    const sanitized = value.replace(/[^\d]/g, '');
    setAreaMinInput(sanitized);

    if (!sanitized) {
      setAreaRange(([, max]) => [AREA_MIN, max]);
      return;
    }

    const parsed = Math.min(Number(sanitized), AREA_MAX);
    setAreaRange([parsed, Math.max(parsed, areaRange[1])]);
  };

  const handleAreaMaxInputChange = (value: string) => {
    const sanitized = value.replace(/[^\d]/g, '');
    setAreaMaxInput(sanitized);

    if (!sanitized) {
      setAreaRange(([min]) => [min, AREA_MAX]);
      return;
    }

    const parsed = Math.min(Number(sanitized), AREA_MAX);
    setAreaRange([Math.min(parsed, areaRange[0]), parsed]);
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    const [min, max] = value;
    setPriceRange([min, max]);
    setPriceMinInput(min <= PRICE_MIN ? '' : String(min));
    setPriceMaxInput(max >= PRICE_MAX ? '' : String(max));
  };

  const handlePriceMinInputChange = (value: string) => {
    const sanitized = value.replace(/[^\d]/g, '');
    setPriceMinInput(sanitized);

    if (!sanitized) {
      setPriceRange(([, max]) => [PRICE_MIN, max]);
      return;
    }

    const parsed = Math.min(Number(sanitized), PRICE_MAX);
    setPriceRange([parsed, Math.max(parsed, priceRange[1])]);
  };

  const handlePriceMaxInputChange = (value: string) => {
    const sanitized = value.replace(/[^\d]/g, '');
    setPriceMaxInput(sanitized);

    if (!sanitized) {
      setPriceRange(([min]) => [min, PRICE_MAX]);
      return;
    }

    const parsed = Math.min(Number(sanitized), PRICE_MAX);
    setPriceRange([Math.min(parsed, priceRange[0]), parsed]);
  };

  const handleCancel = () => {
    router.push('/contract-renewal');
  };

  const handleConfirm = () => {
    if (!tCode || isConfirmDisabled || !selectedCommunity || !selectedPropertyType || !moveInDate) {
      return;
    }

    const priceMaxThousands = priceRange[1];
    const payload = {
      tCode,
      CommunityName: selectedCommunity.description,
      UnitType: selectedPropertyType.description,
      BedRooms: mapBedroomsForSubmit(bedrooms),
      Size: String(areaRange[1] || AREA_MAX),
      PriceRange: String(priceMaxThousands * 1000),
      MoveInDate: formatMoveInDate(moveInDate),
    };

    submitCaptureInterest(payload, {
      onSuccess: (response) => {
        if (response?.CreateSR?.[0]?.Status?.toLowerCase() === 'success') {
          setShowSuccessModal(true);
          return;
        }

        openModal('error-modal');
      },
      onError: () => {
        openModal('error-modal');
      },
    });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/dashboard');
  };

  return {
    community,
    handleCommunityChange,
    communityOptions,
    propertyType,
    handlePropertyTypeChange,
    propertyTypeOptions,
    bedrooms,
    setBedrooms,
    bedroomOptions,
    areaRange,
    areaMinInput,
    areaMaxInput,
    handleAreaRangeChange,
    handleAreaMinInputChange,
    handleAreaMaxInputChange,
    priceRange,
    priceMinInput,
    priceMaxInput,
    handlePriceRangeChange,
    handlePriceMinInputChange,
    handlePriceMaxInputChange,
    moveInDate,
    setMoveInDate,
    moveInDisableBefore,
    moveInDisableAfter,
    showPropertyTypesSection,
    showBedroomsSection,
    showFiltersAfterBedroom,
    emptyCommunityMessage,
    emptyPropertyTypeMessage,
    isCommunitiesReady,
    isConfirmDisabled,
    showSuccessModal,
    handleCancel,
    handleConfirm,
    handleSuccessModalClose,
  };
}
