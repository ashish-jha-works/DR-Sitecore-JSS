import { useEffect, useRef, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';
import { validateEmail } from 'lib/utils/helper';
import { useRouter } from 'next/navigation';

export const useUnitSelection = () => {
  const { tCode } = useUserStore();
  const setUserData = useUserStore((state) => state.setUserData);
  const router = useRouter();
  const [showUsers, setShowUsers] = useState<boolean>(false);

  const [communities, setCommunities] = useState<any[]>([]);
  const [isCommunitiesLoading, setisCommunitiesLoading] = useState(true);

  const [units, setUnits] = useState<any>({});
  const [isUnitDataLoading, setisUnitDataLoading] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);
  const [activeUnit, setActiveUnit] = useState<any>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const unitDetailsCache = useRef<Record<string, any>>({});

  const [users, setusers] = useState<any[]>([]);
  const [isusersLoading, setisusersLoading] = useState(true);

  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
  const [isUserActionModalOpen, setisUserActionModalOpen] = useState(false);
  const [isAddUserModalOpen, setisAddUserModalOpen] = useState(false);

  const [activeModal, setactiveModal] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailError, setEmailError] = useState<string>();

  /* ---------------- API ---------------- */
  const { mutate: LoadCommunities } = useApiMutation<any, any>(
    `/Community/CummunityContent/${tCode}`,
    'GET',
    false
  );

  const { mutate: loadUnits } = useApiMutation<any, any>(`/v1/Unit/All/${tCode}`, 'GET', false);

  const { mutate: loadUnitData } = useApiMutation<any, any>(
    (unitId: string) => `/v1/Unit/${unitId}`,
    'GET',
    false
  );
  const { mutate: switchActiveUnit } = useApiMutation<any, any>(
    '/v1/Unit/ActiveUnit',
    'POST',
    true
  );

  const { mutate: loadUsers } = useApiMutation<any, any>(
    () => `/v1/coadmin/${tCode}`,
    'GET',
    false
  );

  const { mutate: modifyUser } = useApiMutation<
    any,
    {
      CoAdminId: number;
      ProfileId: number;
      Status: number | string;
    }
  >('/v1/coadmin/Modify', 'POST', false);

  const { mutate: addUser } = useApiMutation<any, any>(`/v1/coadmin/Modify`, 'GET', false);

  /* ---------------- Handlers ---------------- */
  /* Effects */
  useEffect(() => {
    if (tCode) {
      LoadCommunities(null, {
        onSuccess: (response) => {
          setCommunities(response ?? []);
          setisCommunitiesLoading(false);
        },
      });
    }
  }, [tCode, LoadCommunities]);

  useEffect(() => {
    if (tCode) {
      loadUnits(null, {
        onSuccess: (response) => {
          setShowUsers(response?.ShowCoAdminSection || false);
          setUnits(response ?? {});
        },
      });
    }
  }, [tCode, loadUnits]);

  useEffect(() => {
    if (!showTooltip) return;
    if (!activeUnit?.Id) return;

    if (isUnitDataLoading) return;
    const unitId = activeUnit.Id;

    if (unitDetailsCache.current[unitId]) {
      setActiveUnit((prev: any) =>
        prev ? { ...prev, details: unitDetailsCache.current[unitId] } : prev
      );
      return;
    }

    setisUnitDataLoading(true);

    if (showTooltip && activeUnit?.Id) {
      loadUnitData(activeUnit?.Id, {
        onSuccess: (response) => {
          if (response && response.PortalFetchTenantSummary) {
            const updatedDetails = response.PortalFetchTenantSummary.DAM_tenant_Summary_V;

            unitDetailsCache.current[activeUnit.Id] = updatedDetails;

            setActiveUnit((prev: any | null) =>
              prev ? { ...prev, details: updatedDetails } : prev
            );
          }
        },
        onSettled: () => {
          setisUnitDataLoading(false);
        },
      });
    }
  }, [showTooltip, activeUnit?.Id, loadUnitData]);

  useEffect(() => {
    if (tCode && showUsers) {
      loadUsers(null, {
        onSuccess: (response) => {
          setusers(response);
          setisusersLoading(false);
        },
      });
    }
  }, [tCode, showUsers]);

  /* Functions */
  function UserActions(status: number) {
    if (!selectedUser) return;

    const requestData = {
      CoAdminId: selectedUser.CoAdminId,
      ProfileId: selectedUser.ProfileId,
      Status: status,
    };

    modifyUser(requestData, {
      onSuccess: (response) => {
        if (response) {
          setisusersLoading(true);
          loadUsers(null, {
            onSuccess: (res) => {
              setusers(res);
              setisusersLoading(false);
              setisUserActionModalOpen(false);
            },
          });
        }
      },
      onError: () => {
        setisUserActionModalOpen(false);
      },
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailResult = validateEmail(email);

    if (!emailResult.isValid) {
      setEmailError('Invalid email, please try another.');
      return;
    }

    const requestData = {
      CoAdminFirstName: firstName,
      CoAdminLastName: lastName,
      CoAdminEmail: email,
      CoAdminPhone: phoneNumber,
      ProfileId: tCode,
    };
    if (tCode) {
      addUser(requestData, {
        onSuccess: (response) => {
          if (response) {
            setisusersLoading(true);
            loadUsers(null, {
              onSuccess: (res) => {
                setusers(res);
                setisusersLoading(false);
                setisAddUserModalOpen(false);
              },
            });
          }
        },
      });
    }
  };

  const handleUnitSelect = (unit: any) => {
    if (!unit) return;

    const selectedTCode = unit?.Id ?? null;

    if (
      selectedTCode &&
      String(selectedTCode).toLowerCase() === String(tCode ?? '').toLowerCase()
    ) {
      router.replace('/dashboard');
      return;
    }

    switchActiveUnit(unit, {
      onSuccess: () => {
        setUserData({
          tCode: selectedTCode,
          FirstName: units?.FirstName ?? null,
          LastName: units?.LastName ?? null,
          CommunityName: unit?.Community ?? null,
          Community: unit?.Community ?? null,
          CommunityDisplayName: unit?.CommunityDisplayName ?? unit?.Community ?? null,
          UnitNumber: unit?.UnitNo ?? unit?.UnitNumber ?? null,
          Unit_Code: (unit?.Unit_Code ?? unit?.UnitNo ?? unit?.UnitNumber)?.trim?.() ?? null,
          PropertyPhase: unit?.Property_Phase ?? null,
          LeaseStartDate: unit?.LeaseStartDate ?? null,
          LeaseEndDate: unit?.LeaseEndDate ?? null,
          IsBlackListedOrGR: unit?.IsBlackListedOrGR ?? false,
          IsMoveIn: unit?.IsMoveIn ?? false,
          IsMoveOut: unit?.IsMoveOut ?? false,
          IsRenewalUser: unit?.IsRenewalUser ?? false,
          IsOverStay: unit?.IsOverStay ?? false,
          IsNewLease: unit?.IsNewLease ?? false,
          UserState_NL: unit?.NL_UserState != null ? String(unit.NL_UserState) : null,
        });
        router.replace('/dashboard');
      },
    });
  };

  return {
    tCode,

    showUsers,
    setShowUsers,

    communities,
    setCommunities,

    units,
    setUnits,

    isCommunitiesLoading,
    setisCommunitiesLoading,

    showTooltip,
    setShowTooltip,

    activeUnit,
    setActiveUnit,

    contentRef,
    isUnitDataLoading,

    users,
    setusers,

    isusersLoading,
    setisusersLoading,

    openMenuUserId,
    setOpenMenuUserId,

    isUserActionModalOpen,
    setisUserActionModalOpen,

    isAddUserModalOpen,
    setisAddUserModalOpen,

    activeModal,
    setactiveModal,

    selectedUser,
    setSelectedUser,

    UserActions,

    firstName,
    setFirstName,

    lastName,
    setLastName,

    email,
    setEmail,

    phoneNumber,
    setPhoneNumber,

    emailError,
    setEmailError,

    handleSubmit,
    handleUnitSelect,
  };
};
