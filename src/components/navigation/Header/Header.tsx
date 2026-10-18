import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CustomImage, CustomLink } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import BellIcon from 'assets/icons/BellIcon';
import ChevronDown from 'assets/icons/ChevronDown';
import Logout from 'assets/icons/Logout';
import Settings from 'assets/icons/Settings';
import SwitchUnit from 'assets/icons/SwitchUnit';
import DeleteProfileModal from 'components/modals/DeleteProfileModal';
import LogoutModal from 'components/modals/LogoutModal';
import useRenewalStepper from 'components/Renewals/Stepper/useRenewalStepper';
import useMoveOutStepper from 'components/move-out/Stepper/useMoveOutStepper';

// Unauthorized Header
function GuestHeader({ fields }: any) {
  return (
    <header className="GuestHeader sticky top-0 z-1000 ">
      <div className=" text-white-pure bg-navy-500 text-body-xs font-normal px-9 py-6 2xl:py-3 2xl:px-8 h-23.5 xl:h-auto">
        <div className="hidden xl:block">
          <div className="flex gap-6">
            <div className="shrink">
              <CustomLink field={fields?.logoLink} className="w-22.5">
                <CustomImage field={fields?.logoImage} />
              </CustomLink>
            </div>
          </div>
        </div>
        <div className="xl:hidden">
          <div className="flex gap-6">
            <div className="grow">
              <div className="h-11.5 flex justify-center items-center relative">
                <CustomLink
                  field={fields?.logoLink}
                  className="h-full absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 transition-default"
                >
                  <CustomImage field={fields?.logoImage} className="h-full" />
                </CustomLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Authorized Header
function AuthHeader({ fields }: any) {
  // const { FirstName, logout } = useUserStore();
  const [toggleSettings, setToggleSettings] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);
  const openModal = useUIStore((state) => state.openModal);
  const router = useRouter();

  const setActiveLink = (path: string) => {
    const splittedPath = router.asPath.split('/');

    // Condition to check if after path of an URL contains a partial of existing URL or not
    // example: contract-renewal/payment-plan use to match partial path for /payment
    if (splittedPath?.length > 2) {
      return ('/' + splittedPath[1]).includes(path)
        ? 'border-b-4 border-solid border-lilac-500 rounded-sm'
        : '';
    } else {
      return router.asPath.includes(path)
        ? 'border-b-4 border-solid border-lilac-500 rounded-sm'
        : '';
    }
  };

  const { loadContractRenewalStepper } = useRenewalStepper(false);
  const { loadMoveOutStepper } = useMoveOutStepper(false);
  const { IsMoveOut, MO_UserState } = useUserStore();

  const isMoveOutInProgress =
    !!IsMoveOut ||
    (MO_UserState != null && String(MO_UserState).trim() !== '' && Number(MO_UserState) > 0);

  const proceedNavigation = (e: any) => {
    e.preventDefault();
    const href = e.currentTarget?.href || e.target?.href || '';
    if (href.includes('move-out')) {
      // Resume in-progress journey; otherwise open landing to initiate
      if (isMoveOutInProgress) {
        loadMoveOutStepper(true);
      } else {
        router.push('/move-out');
      }
    } else if (href.includes('move-in')) {
      // Initiate / nav Move In always opens landing; Resume uses stepper from Home CTA
      router.push('/move-in');
    } else if (href.includes('contract-renewal')) {
      loadContractRenewalStepper(true);
    } else {
      router.push(href);
    }
  };

  const {
    tCode,
    ProfileType,
    IsLoggedIn,
    lastFetchedNotifications,
    setNotifications,
    setLoadingNotifications,
  } = useUserStore();
  const notifications = useUserStore((state) => state.notifications);
  const notificationCount = notifications.filter((n: any) => n.IsSeen === false).length || 0;

  const { mutate, isPending } = useApiMutation<any, any>(
    `/Tenant/${tCode}/Notifications`,
    'GET',
    false
  );

  useEffect(() => {
    setLoadingNotifications(isPending);
  }, [isPending, setLoadingNotifications]);

  useEffect(() => {
    // Only run logic if logged in and tCode exists
    if (!IsLoggedIn || !tCode) return;

    const FIVE_MINUTES = 0.2 * 60 * 1000;
    const now = Date.now();

    // Condition: Data is missing OR it has been more than 5 minutes
    const shouldFetch = !lastFetchedNotifications || now - lastFetchedNotifications > FIVE_MINUTES;

    if (shouldFetch) {
      mutate(null, {
        onSuccess: (response: any) => {
          if (ProfileType === 8 && response?.Code === 403) {
            setNotifications([]);
          } else {
            setNotifications(response?.Data || response || []);
          }
        },
        onError: () => {
          setLoadingNotifications(false);
        },
      });
    }
  }, [
    router.asPath,
    tCode,
    IsLoggedIn,
    lastFetchedNotifications,
    mutate,
    ProfileType,
    setNotifications,
    setLoadingNotifications,
  ]);

  const navigationLinks = (fields.navigationLinks || []).map((item: any) => {
    // disconnected mode (ContentList)
    if (item?.fields?.link) {
      return item.fields.link?.value;
    }

    // connected mode (flat GeneralLink array)
    return item;
  });

  return (
    <header className="AuthHeader sticky top-0 z-1000 ">
      <div
        className={`text-white-pure bg-navy-500 text-body-xs font-normal px-9 py-6 2xl:py-3 2xl:px-8 ${
          navigationLinks.length > 0 ? 'h-23.5' : ''
        } xl:h-auto`}
      >
        <div className="hidden xl:block">
          <div className="flex gap-6">
            <div className="shrink">
              <CustomLink field={fields?.logoLink} className="w-22.5">
                <CustomImage field={fields?.logoImage} />
              </CustomLink>
            </div>
            <div className="grow">
              {navigationLinks?.length > 0 && (
                <ul className="h-full flex items-center xl:ms-8 2xl:ms-10">
                  {navigationLinks?.map((item: any, index: any) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className={`pb-1 uppercase ${
                          index > 0 ? 'ms-9 2xl:ms-14 3xl:ms-20' : ''
                        } ${setActiveLink(item.href)}`}
                        onClick={(e: any) => proceedNavigation(e)}
                      >
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="shrink">
              <div className="h-full flex items-center">
                <ul className="flex gap-6">
                  {navigationLinks?.length > 0 && (
                    <>
                      {ProfileType == 6 ||
                        (ProfileType == 7 && (
                          <li className="inline-flex relative">
                            <Link href={`/unit-selection`} className="uppercase">
                              <SwitchUnit className="size-5" />
                            </Link>
                          </li>
                        ))}
                      <li className="inline-flex relative">
                        <Link href={`/notifications`}>
                          <BellIcon className="size-5" />
                          {notificationCount != 0 && (
                            <span
                              className={`text-body-xs font-normal absolute top-0 end-0 translate-x-1/2 -translate-y-1/2 text-white-pure bg-danger-500 justify-center items-center size-4.5 rounded-full flex`}
                            >
                              {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                          )}
                        </Link>
                      </li>
                      <li className="inline-flex relative">
                        <button
                          className="link-btn"
                          onClick={() => setToggleSettings((prev) => !prev)}
                        >
                          <Settings className="size-5" />
                        </button>
                        {toggleSettings}
                        <div
                          className={`absolute top-full end-0 bg-navy-500 border border-solid border-lilac-300 rounded-xl py-3 px-5 transition-default translate-y-1
                        ${
                          toggleSettings
                            ? 'opacity-100 visible pointer-events-auto'
                            : 'opacity-0 invisible pointer-events-none'
                        }`}
                        >
                          <ul>
                            <li>
                              <Link
                                href={`/changepassword`}
                                className="text-body-xs inline-block py-2 whitespace-nowrap"
                              >
                                CHANGE PASSWORD
                              </Link>
                            </li>
                            <li>
                              <button
                                className="link-btn text-body-xs inline-block py-2 whitespace-nowrap"
                                onClick={() => {
                                  openModal('delete-profile-modal');
                                  setToggleSettings(false);
                                }}
                              >
                                DELETE PROFILE
                              </button>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </>
                  )}
                  <li className="inline-flex relative">
                    <button className="link-btn" onClick={() => openModal('logout-modal')}>
                      <Logout className="size-5" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:hidden">
          {navigationLinks?.length > 0 ? (
            <>
              <div className="flex gap-6">
                <div className="shrink">
                  <div className="h-full inline-flex items-center">
                    <div
                      className="size-6 relative flex-col gap-1.25 cursor-pointer"
                      onClick={() => {
                        setToggleMenu((prev) => !prev);
                        setToggleSettings(false);
                      }}
                    >
                      <div
                        className={`w-6 h-0.5 inline-block bg-white-pure rounded-full absolute top-1/2 start-1/2 -translate-x-1/2 transition-default
                      ${toggleMenu ? '-translate-y-1/2 rotate-45' : 'translate-y-[calc(-50%-8px)]'}
                    `}
                      ></div>
                      <div
                        className={`w-6 h-0.5 inline-block bg-white-pure rounded-full absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 transition-default
                      ${toggleMenu ? 'scale-0' : ''}
                    `}
                      ></div>
                      <div
                        className={`w-6 h-0.5 inline-block bg-white-pure rounded-full absolute top-1/2 start-1/2 -translate-x-1/2 transition-default
                      ${toggleMenu ? '-translate-y-1/2 -rotate-45' : 'translate-y-[calc(-50%+8px)]'}
                    `}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="grow">
                  <div className="h-11.5 flex justify-center items-center relative">
                    <span
                      className={`transition-default ${
                        toggleMenu ? 'opacity-0 invisible' : 'opacity-100 visible'
                      }`}
                    >
                      HOME
                    </span>
                    <CustomImage
                      field={fields?.logoImage}
                      className={`h-full absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 transition-default ${
                        toggleMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                    />
                  </div>
                </div>
                <div className="shrink">
                  <div className="h-full inline-flex items-center">
                    <Link href={`/notifications`} className="relative">
                      <BellIcon className="size-5" />
                      {notificationCount != 0 && (
                        <span
                          className={`text-body-xs font-normal absolute top-0 end-0 translate-x-1/2 -translate-y-1/2 text-white-pure bg-danger-500 justify-center items-center size-4.5 rounded-full flex`}
                        >
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
              <div
                className={`fixed w-full px-9 pb-8 h-[calc(100vh-94px)] top-23.5 start-0 z-1000 bg-navy-500 transition-default overflow-auto ${
                  toggleMenu ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <ul className="py-9 border-y border-solid border-lilac-300">
                  {navigationLinks?.map((item: any, index: any) => (
                    <li className={`${index != 0 ? 'mt-5' : ''}`} key={index}>
                      <Link
                        href={item.href}
                        className={`py-2 ${setActiveLink(item.href)}`}
                        onClick={(e: any) => proceedNavigation(e)}
                      >
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
                {ProfileType == 6 ||
                  (ProfileType == 7 && (
                    <Link
                      href={`/unit-selection`}
                      className={`text-sm font-normal mt-7 flex items-center`}
                    >
                      <SwitchUnit className="size-6 me-3" />
                      SWITCH UNIT
                    </Link>
                  ))}
                <button
                  className={`link-btn w-full text-sm font-normal mt-7 flex items-center`}
                  onClick={() => setToggleSettings((prev) => !prev)}
                >
                  <Settings className="size-6 me-3" />
                  SETTINGS
                  <ChevronDown
                    className={`size-6 ms-auto transition-default ${
                      toggleSettings ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <ul
                  className={`text-sm font-normal overflow-hidden transition-default
              ${toggleSettings ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}
              `}
                >
                  <li className="mt-4">
                    <Link href={`/changepassword`} className="py-2">
                      CHANGE PASSWORD
                    </Link>
                  </li>
                  <li className="mt-4">
                    <button
                      className="link-btn py-2"
                      onClick={() => {
                        openModal('delete-profile-modal');
                        setToggleSettings(false);
                        setToggleMenu(false);
                      }}
                    >
                      DELETE PROFILE
                    </button>
                  </li>
                </ul>
                <button
                  className={`link-btn text-sm font-normal mt-7 flex items-center`}
                  onClick={() => {
                    openModal('logout-modal');
                    setToggleMenu(false);
                  }}
                >
                  <Logout className="size-6 me-3" />
                  LOG OUT
                </button>
              </div>
            </>
          ) : (
            <button
              className={`link-btn text-sm font-normal flex items-center ms-auto`}
              onClick={() => {
                openModal('logout-modal');
                setToggleMenu(false);
              }}
            >
              <Logout className="size-6" />
            </button>
          )}
        </div>
      </div>
      <LogoutModal />
      <DeleteProfileModal />
    </header>
  );
}

export default function Header({ fields }: any) {
  const isLoggedIn = useUserStore((state) => state.IsLoggedIn);

  return isLoggedIn ? <AuthHeader fields={fields} /> : <GuestHeader fields={fields} />;
}
