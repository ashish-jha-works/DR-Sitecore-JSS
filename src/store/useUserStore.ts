import router from 'next/router';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Define the interface
interface UserData {
  tCode: string | null;
  tenant_name: string | null;
  FirstName: string | null;
  LastName: string | null;
  CommunityName: string | null;
  CommunityDisplayName: string | null;
  CommunityEmail: string | null;
  CommunityAddress: string | null;
  CommunityOfficeWorkingHrs: string | null;
  UnitNumber: string | null;
  Unit_Code: string | null;

  AccessToken: string | null;
  RefreshToken: string | null;

  Community: string | null;

  Email: string | null;
  Mobile: string | null;

  LeaseStartDate: string | null;
  LeaseEndDate: string | null;
  MoveInDate: string | null;
  ProposalEndDate: string | null;

  ProfileType: number | null;
  ProfileStatus: string | null;

  PropertyPhase: string | null;

  UserState_CR: string | null;
  UserState_MI: string | null;
  UserState_NL: string | null;
  MO_UserState: string | null;

  HideMoveOutLink: boolean;
  DisableRenewLater: boolean;
  IsMoveIn: boolean;
  IsMoveOut: boolean;
  IsOverStay: boolean;
  IsRenewalUser: boolean;
  IsNewLease: boolean;
  ShowCancelMoveOut: boolean;
  ShowUnitSelectionScreen: boolean;
  IsMOFinalDocPageVisited: boolean;
  MoveInPermit_flag: boolean;
  IsBlackListedOrGR: boolean;

  TimeRemaningToUnblockUnit: number | null;
  BlockedUnitId: string | null;
  UnitBlockedText: string | null;

  OutstandingAmount: number | null;

  IsLoggedIn: boolean;

  notifications: any[];
  lastFetchedNotifications: number | null;
  unauthenticatedUserEmailorPhone?: string | null; // To Store user reset email globally
}

interface UserState extends UserData {
  _hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  isLoadingNotifications: boolean;
  setUserData: (data: any) => void;
  setNotifications: (data: any[]) => void;
  setLoadingNotifications: (loading: boolean) => void;
  setUnauthenticatedUser: (userId?: string, tCode?: string) => void;
  logout: () => void;
}

// 2. Initial State
const initialState: UserData = {
  tCode: null,
  tenant_name: null,
  FirstName: null,
  LastName: null,
  CommunityName: null,
  CommunityDisplayName: null,
  CommunityEmail: null,
  CommunityAddress: null,
  CommunityOfficeWorkingHrs: null,
  UnitNumber: null,
  Unit_Code: null,

  AccessToken: null,
  RefreshToken: null,

  Community: null,

  Email: null,
  Mobile: null,

  LeaseStartDate: null,
  LeaseEndDate: null,
  MoveInDate: null,
  ProposalEndDate: null,

  ProfileType: null,
  ProfileStatus: null,

  PropertyPhase: null,

  UserState_CR: null,
  UserState_MI: null,
  UserState_NL: null,
  MO_UserState: null,

  HideMoveOutLink: false,
  DisableRenewLater: false,
  IsMoveIn: false,
  IsMoveOut: false,
  IsOverStay: false,
  IsRenewalUser: false,
  IsNewLease: false,
  ShowCancelMoveOut: false,
  ShowUnitSelectionScreen: false,
  IsMOFinalDocPageVisited: false,
  MoveInPermit_flag: false,
  IsBlackListedOrGR: false,

  TimeRemaningToUnblockUnit: null,
  BlockedUnitId: null,
  UnitBlockedText: null,

  OutstandingAmount: null,

  IsLoggedIn: false,

  notifications: [],
  lastFetchedNotifications: null,
  unauthenticatedUserEmailorPhone: null,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      isLoadingNotifications: false,
      _hasHydrated: false,
      setHasHydrated: (val) => set({ _hasHydrated: val }),

      setUserData: (data) =>
        set({
          ...data,
          IsLoggedIn: true,
        }),

      setNotifications: (data) =>
        set({
          notifications: data,
          lastFetchedNotifications: Date.now(),
          isLoadingNotifications: false,
        }),

      setLoadingNotifications: (loading) => set({ isLoadingNotifications: loading }),

      setUnauthenticatedUser: (userId?: string, tCode?: string) =>
        set({
          ...initialState,
          unauthenticatedUserEmailorPhone: userId,
          tCode: tCode,
        }),

      logout: () => {
        set({ ...initialState });
        localStorage.removeItem('user-storage');
        router.push('/login');
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        ...state,
        isLoadingNotifications: undefined, // prevent persisting
      }),
      onRehydrateStorage: () => (state) => {
        // Called once localStorage has been read into the store
        state?.setHasHydrated(true);
      },
    }
  )
);
