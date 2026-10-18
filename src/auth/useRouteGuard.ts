import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUserStore } from 'src/store/useUserStore';

import { authRoutes, publicRoutes, routePermissions } from './permissions';

// --- Types ---

export type GuardState = 'LOADING' | 'AUTHORIZED' | 'REDIRECTING';

// Either redirection of URL will be allowed to access that URL else we will receive the redirectURL
type AccessResult = { accessGranted: true } | { accessGranted: false; redirectUrl: string };

// --- Helpers ---

// remove query params & hash fragments
const normalizePath = (path: string): string => path.split('?')[0].split('#')[0];

// special case for "/", preventing it to match with sub-routes ex: /move-in, /move-in/utility-registration
const isMatch = (route: string, path: string): boolean =>
  route === '/' ? path === '/' : path.startsWith(route);

// apply a hard reload, to refresh the sitecore content of that page
const hardRedirect = (url: string): void => {
  window.location.replace(url);
};

// --- Route Access/Redirection Logic ---

const canAccessRoute = (
  path: string,
  role: number | null,
  isUserBlacklistedForServiceRequestRoutes?: boolean
): AccessResult => {
  const cleanPath = normalizePath(path);

  // 1. PUBLIC — always allow
  if (publicRoutes.some((route) => isMatch(route, cleanPath))) {
    return { accessGranted: true };
  }

  // 2. AUTH ROUTES — /login, /register etc. Block if already logged in
  if (authRoutes.some((r) => isMatch(r, cleanPath))) {
    return role != null
      ? { accessGranted: false, redirectUrl: '/dashboard' }
      : { accessGranted: true };
  }

  // 3. PROTECTED ROUTES — must be logged in with correct role
  const matchedRoute = Object.keys(routePermissions).find((route) => isMatch(route, cleanPath));

  if (matchedRoute) {
    if (role == null) {
      return { accessGranted: false, redirectUrl: '/login' };
    }
    if (!routePermissions[matchedRoute].includes(role)) {
      return { accessGranted: false, redirectUrl: '/not-found' };
    }
    if (matchedRoute === '/service-request' && isUserBlacklistedForServiceRequestRoutes) {
      return { accessGranted: false, redirectUrl: '/not-found' };
    }
    return { accessGranted: true };
  }

  // 4. UNKNOWN ROUTES — redirect to /not-found
  return {
    accessGranted: false,
    redirectUrl: '/not-found',
  };
};

export const useRouteGuard = (IsBlackListedOrGR = false): GuardState => {
  const router = useRouter();
  const { ProfileType, _hasHydrated } = useUserStore();
  const [guardState, setGuardState] = useState<GuardState>('LOADING');

  // Reset to LOADING immediately on every path change so the
  // previous page content never flashes during navigation
  useEffect(() => {
    setGuardState('LOADING');
  }, [router.asPath]);

  useEffect(() => {
    // Wait for Global State(Zustand) to hydrate ProfileType from localStorage
    if (!_hasHydrated) return;

    const access = canAccessRoute(router.asPath, ProfileType, IsBlackListedOrGR);

    if (!access.accessGranted) {
      setGuardState('REDIRECTING');
      hardRedirect(access.redirectUrl); // Page to hard reload to fetch Sitecore content
    } else {
      setGuardState('AUTHORIZED');
    }
  }, [router.asPath, ProfileType, _hasHydrated]);

  return guardState;
};
