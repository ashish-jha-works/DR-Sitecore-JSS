import { useUnitSelection } from './useUnitSelectionPage';
import { useMemo, useState, useEffect } from 'react';
import ChevronUp from 'assets/icons/ChevronUp';
import InfoIcon from 'assets/icons/InfoIcon';
import Plus from 'assets/icons/Plus';
import User from 'assets/icons/User';
import Menu from 'assets/icons/Menu';
import Image from 'next/image';
import { Input } from 'components/common/Input';
import { formatEmailInput, formatPhoneInput, validateEmail } from 'lib/utils/helper';
import CrossIcon from 'assets/icons/CrossIcon';

export default function UnitSelectionPage() {
  const { showUsers } = useUnitSelection();

  return (
    <div className="pt-10 container-sm">
      <LoadCommunityUnits />
      {showUsers && <LoadUsers />}
    </div>
  );
}

function LoadCommunityUnits() {
  const { communities, units, isCommunitiesLoading } = useUnitSelection();

  const mergedCommunityUnits = useMemo(() => {
    if (!communities.length || !Array.isArray(units?.units)) return [];

    return communities
      .map((community: any) => {
        const communityUnits = units.units.filter(
          (unit: any) => unit.Community === community.CommunityName
        );

        if (!communityUnits.length) return null;

        return {
          ...community,
          units: communityUnits,
        };
      })
      .filter(Boolean);
  }, [communities, units]);

  if (isCommunitiesLoading || !Array.isArray(units?.units) || units.units.length === 0)
    return <CommunitySkeletonLoader />;

  return (
    <>
      <h3 className="text-heading-1 font-normal mb-6 md:mb-8">Select unit to proceed</h3>
      <div className="flex flex-col gap-6 md:gap-8">
        {mergedCommunityUnits.map((community: any, index: number) => (
          <CommunityAccordion key={index} community={community} />
        ))}
      </div>
    </>
  );
}

function CommunitySkeletonLoader() {
  return (
    <div className="overflow-hidden rounded-3xl bg-silver-chalice-50">
      <div className="h-50 relative overflow-hidden bg-silver-chalice-400 skelton-animation"></div>
      <div className="p-6">
        <div className="flex gap-6">
          <div className="grow flex items-center">
            <div className="max-w-55 w-full h-4 rounded-full bg-silver-chalice-400 relative overflow-hidden skelton-animation"></div>
          </div>
          <div className="shrink">
            <div className="min-w-12 w-full h-12 rounded-lg bg-silver-chalice-200 relative overflow-hidden skelton-animation"></div>
          </div>
        </div>
        <div className="grid md:gap-3 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2 mt-4">
            <div className="min-w-12 w-full h-12 rounded-lg bg-silver-chalice-200 relative overflow-hidden skelton-animation"></div>
            <div className="min-w-6 min-h-6 rounded-full bg-silver-chalice-200 relative overflow-hidden skelton-animation"></div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="min-w-12 w-full h-12 rounded-lg bg-silver-chalice-200 relative overflow-hidden skelton-animation"></div>
            <div className="min-w-6 min-h-6 rounded-full bg-silver-chalice-200 relative overflow-hidden skelton-animation"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommunityAccordion({ community }: any) {
  const {
    contentRef,
    showTooltip,
    setShowTooltip,
    activeUnit,
    setActiveUnit,
    isUnitDataLoading,
    handleUnitSelect,
  } = useUnitSelection();
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);

  const toggleAccordion = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [community.units]);

  return (
    <div className="rounded-3xl border border-lilac-300 overflow-hidden">
      <img
        className="w-full h-50 object-cover rounded-tl-3xl"
        src={community?.ImagePortal}
        alt=""
      />
      <div className="pt-4 px-6 pb-6">
        <div className="accordion-item">
          <button
            className="text-heading-2 font-normal py-4 w-full flex justify-between items-center text-navy-500 text-start relative cursor-pointer"
            type="button"
            onClick={toggleAccordion}
          >
            <span className="grow">{community?.CommunityName}</span>
            <span>
              <ChevronUp
                className={`text-lilac-500 transition-default ${
                  isOpen ? 'rotate-0' : 'rotate-180'
                }`}
              />
            </span>
          </button>
          <div
            style={{
              maxHeight: isOpen ? `${height}px` : '0px',
            }}
            className="overflow-hidden transition-default"
          >
            <div ref={contentRef} className="pt-2">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {community.units?.map((unit: any, index: any) => (
                  <div className="flex items-center gap-2" key={index}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleUnitSelect(unit)}
                    >
                      {unit?.UnitNo}
                    </button>
                    <div
                      className="relative cursor-pointer"
                      onMouseEnter={() => {
                        setShowTooltip(true);
                        setActiveUnit(unit);
                      }}
                      onMouseLeave={() => {
                        setShowTooltip(false);
                      }}
                    >
                      <InfoIcon className="text-lilac-500" />
                      <div
                        className={`w-62.5 text-body-sm font-light py-1.5 px-3 absolute bottom-full -right-3 transform -translate-y-1 rounded-sm text-navy-500 bg-white-pure z-100 ${
                          showTooltip && activeUnit?.Id === unit?.Id
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'
                        } shadow-[0px_1px_8px_0px_rgba(0,0,0,0.1)] transition-default before:content-[''] before:w-3 before:h-3 before:bg-white-pure before:absolute before:end-4.5 before:bottom-0 before:translate-y-[50%] before:rotate-45`}
                      >
                        {isUnitDataLoading ? (
                          <div className="loader-balls-sm">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        ) : (
                          <ul className="ps-4 list-disc">
                            {activeUnit?.IsRenewalUser && <li>Upcoming renewal</li>}
                            {activeUnit?.details?.OutstandingAmount > 0 && (
                              <li>Outstanding payment</li>
                            )}
                            <li>
                              {activeUnit?.details?.ActiveFMRequestCount || 0} open service requests
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Users Section

function UsersSkeletonLoader() {
  return (
    <div className="overflow-hidden rounded-3xl bg-silver-chalice-50 p-4">
      <div className="flex">
        <div className="grow">
          <div className="flex items-center gap-2">
            <div className="min-w-11 min-h-11 rounded-full bg-silver-chalice-200 relative overflow-hidden skelton-animation"></div>
            <div className="grow">
              <div className="skeleton-line max-w-55 w-full h-4 rounded-full relative overflow-hidden bg-silver-chalice-400 skelton-animation"></div>
              <div className="skeleton-line max-w-55 w-full h-4 rounded-full relative overflow-hidden bg-silver-chalice-400 skelton-animation mt-1"></div>
            </div>
          </div>
        </div>
        <div className="shrink">
          <div className="flex items-center gap-2">
            <div className="min-w-25 h-9 rounded-full bg-silver-chalice-200 relative overflow-hidden skelton-animation"></div>
            <div className="min-w-12 w-full h-12 rounded-lg bg-silver-chalice-200 relative overflow-hidden skelton-animation"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadUsers() {
  const {
    setisAddUserModalOpen,
    isusersLoading,
    users,
    openMenuUserId,
    setOpenMenuUserId,
    setisUserActionModalOpen,
    setSelectedUser,
    setactiveModal,
    isUserActionModalOpen,
    activeModal,
    selectedUser,
    UserActions,
    isAddUserModalOpen,
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
  } = useUnitSelection();

  const getUserStatus = (status: number): any => {
    switch (status) {
      case 0:
      case 1:
        return 'Pending Activation';
      case 2:
        return 'Active';
      case 3:
        return status;
      case 4:
        return 'Deactivate';
      case 5:
        return 'Deleted';
    }
  };

  const getStatusStyle = (status: number): any => {
    switch (status) {
      case 2:
        return 'active';
      case 4:
        return 'deactivated';
      case 5:
        return 'deleted';
      default:
        return '';
    }
  };

  const handleCancelUnitSelection = () => {
    setisUserActionModalOpen(false);
    if (activeModal === 'activate') {
      UserActions(2);
    } else if (activeModal === 'deactivate') {
      UserActions(4);
    } else {
      UserActions(5);
    }
  };

  const isFormDisabled = !firstName || !lastName || !email || !phoneNumber;

  return (
    <>
      <div className="w-full h-px bg-lilac-300 my-8"></div>
      <div className="flex flex-col md:flex-row">
        <div className="md:grow">
          <h3 className="mb-2 md:mb-3 font-normal text-heading-2">Manage users</h3>
          <p className="mb-0 font-normal text-body">Control users who can access the account.</p>
        </div>
        <div className="md:shrink">
          <a
            href="javascript:void(0)"
            className="btn btn-primary mt-2 md:mt-0 min-w-68.75"
            onClick={(e) => {
              e.preventDefault();
              setisAddUserModalOpen(true);
            }}
          >
            <Plus />
            ADD USER
          </a>
        </div>
      </div>
      <div className="mt-6 md:mt-8">
        <h4 className="mb-2 md:mb-3 font-normal text-heading-3">Users</h4>
        {isusersLoading || !Array.isArray(users) || users.length === 0 ? (
          <UsersSkeletonLoader />
        ) : (
          <ul className="flex flex-col gap-3">
            {users.map((user, index: number) => (
              <li className="p-4 md:p-5 rounded-3xl border border-lilac-300" key={index}>
                <div className="flex">
                  <div className="grow">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="switch-unit__user-image">
                        {user?.ProfilePicture === null ? (
                          <User className="size-11 rounded-full text-lilac-500" />
                        ) : (
                          <img
                            className="size-11 rounded-full"
                            width={44}
                            height={44}
                            src={user?.ProfilePicture}
                            alt=""
                          />
                        )}
                      </div>
                      <div className="grow">
                        <h5 className="text-body font-medium mb-0 break-all">
                          {user?.CoAdminFirstName}
                        </h5>
                        <p className="text-body font-light mb-0">{user?.CoAdminPhone}</p>
                      </div>
                      <span
                        className={`min-w-25 flex items-center justify-center text-center p-2 text-body font-normal rounded-full border
                        ${
                          getStatusStyle(user?.Status) === 'active'
                            ? 'text-success-900 border-success-500 bg-success-50'
                            : getStatusStyle(user?.Status) === 'deactivated'
                            ? 'text-warning-900 border-warning-500 bg-warning-50'
                            : getStatusStyle(user?.Status) === 'deactivated'
                            ? 'text-danger-900 border-danger-500 bg-danger-50'
                            : 'text-lilac-800 border-lilac-500 bg-lilac-100'
                        }`}
                      >
                        {getUserStatus(user?.Status)}
                      </span>
                      <div className="flex relative">
                        {user?.Status !== 5 && (
                          <a
                            href="javascript:void(0)"
                            className="text-lilac-500 text-2xl"
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenMenuUserId(
                                openMenuUserId === user.CoAdminId ? null : user.CoAdminId
                              );
                            }}
                          >
                            <Menu className="text-lilac-500" />
                          </a>
                        )}
                        <div
                          className={`py-3 px-5 absolute top-1/2 right-full transform -translate-y-1/2 rounded-xl bg-white-pure border border-lilac-300 ${
                            openMenuUserId === user.CoAdminId
                              ? 'opacity-100 pointer-events-auto'
                              : 'opacity-0 pointer-events-none'
                          }  transition-default`}
                        >
                          <ul className="switch-unit__user-menu-popup-list">
                            {user?.Status === 4 && (
                              <li className="switch-unit__user-menu-popup-list-item">
                                <a
                                  href="javascript:void(0)"
                                  className="w-full text-cta-sm py-2 px-0 whitespace-nowrap text-navy-500 hover:text-lilac-300"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setisUserActionModalOpen(true);
                                    setSelectedUser(user);
                                    setactiveModal('activate');
                                    setOpenMenuUserId(null);
                                  }}
                                >
                                  ACTIVATE USER
                                </a>
                              </li>
                            )}
                            {user?.Status === 2 && (
                              <li className="switch-unit__user-menu-popup-list-item">
                                <a
                                  href="javascript:void(0)"
                                  className="w-full text-cta-sm py-2 px-0 whitespace-nowrap text-navy-500 hover:text-lilac-300"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setisUserActionModalOpen(true);
                                    setSelectedUser(user);
                                    setactiveModal('deactivate');
                                    setOpenMenuUserId(null);
                                  }}
                                >
                                  DEACTIVATE USER
                                </a>
                              </li>
                            )}
                            <li className="switch-unit__user-menu-popup-list-item">
                              <a
                                href="javascript:void(0)"
                                className="w-full text-cta-sm py-2 px-0 whitespace-nowrap text-navy-500 hover:text-lilac-300"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setisUserActionModalOpen(true);
                                  setSelectedUser(user);
                                  setactiveModal('delete');
                                  setOpenMenuUserId(null);
                                }}
                              >
                                DELETE USER
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* #User Action Modal */}
      <div className={`custom-modal ${isUserActionModalOpen ? 'show' : ''}`}>
        <div className="custom-modal__wrapper">
          {activeModal === 'activate' ? (
            <h3 className="custom-modal__heading">
              Do you confirm to activate the profile of {selectedUser?.CoAdminFirstName}{' '}
              {selectedUser?.CoAdminLastName} and allow them access to your account?
            </h3>
          ) : activeModal === 'deactivate' ? (
            <h3 className="custom-modal__heading">
              Do you confirm to deactivate the profile of {selectedUser?.CoAdminFirstName}{' '}
              {selectedUser?.CoAdminLastName} and disable their access to the account?
            </h3>
          ) : (
            <h3 className="custom-modal__heading">
              Can you confirm if the profile of {selectedUser?.CoAdminFirstName}{' '}
              {selectedUser?.CoAdminLastName} should be deleted?
            </h3>
          )}
          {activeModal === 'activate' ? (
            <Image
              className="custom-modal__img"
              src="/assets/svg/activate-account.svg"
              alt="Error"
              width={294}
              height={210}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : activeModal === 'deactivate' ? (
            <Image
              className="custom-modal__img"
              src="/assets/svg/deactivate-account.svg"
              alt="Error"
              width={294}
              height={210}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <Image
              className="custom-modal__img"
              src="/assets/svg/delete-account.svg"
              alt="Error"
              width={294}
              height={210}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          {activeModal === 'delete' && (
            <p className="custom-modal__desc">
              Once deleted, the user will have to register again to access the account.
            </p>
          )}
          <div className="custom-modal__btn-wrapper">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setisUserActionModalOpen(false);
              }}
            >
              CANCEL
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleCancelUnitSelection}>
              PROCEED
            </button>
          </div>
        </div>
      </div>

      {/* #Add User Modal */}
      <div className={`custom-modal ${isAddUserModalOpen ? 'show' : ''}`}>
        <div className="custom-modal__wrapper">
          <div className="flex items-center mb-5 md:mb-6">
            <h4 className="text-navy-500 text-heading-2 text-start font-normal grow">Add a user</h4>
            <button
              className="shrink"
              onClick={() => {
                setisAddUserModalOpen(false);
              }}
            >
              <CrossIcon className="text-lilac-500 size-6 cursor-pointer" />
            </button>
          </div>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="form-group !text-start grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-2 md:gap-x-10 md:gap-y-4"
          >
            <Input
              label="First name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <Input
              label="Last name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <Input
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(formatEmailInput(e.target.value));
                setEmailError(undefined);
              }}
              onBlur={(e) => {
                if (!e.target.value.trim()) return;
                const isValid = validateEmail(email);
                if (!isValid?.isValid) {
                  setEmailError('Invalid email, please try another.');
                }
              }}
              error={emailError}
            />
            <Input
              label="Mobile number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(formatPhoneInput(e.target.value));
              }}
              onBlur={(e) => {
                const value = e.target.value.trim();

                if (value === '05' || (value?.length > 0 && value?.length < 11)) {
                  setPhoneNumber('');
                }
              }}
            />
            <button
              type="submit"
              className="btn btn-primary uppercase md:col-start-2"
              disabled={isFormDisabled}
            >
              ADD USER
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
