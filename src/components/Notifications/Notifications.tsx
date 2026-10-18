import { useEffect, useRef, useState } from 'react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CustomLink } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';
import { useUIStore } from 'src/store/useUIStore';
import { formatDate } from 'src/utils/formatDate';
import CircleCrossIcon from 'assets/icons/CircleCrossIcon';
import CircleTickIcon from 'assets/icons/CircleTickIcon';
import AdminDocumentsIcon from 'assets/icons/AdminDocumentsIcon';
import AdminBillsIcon from 'assets/icons/AdminBillsIcon';
import DownloadIcon from 'assets/icons/DownloadIcon';
import EmailIcon from 'assets/icons/EmailIcon';
import NotificationIcon from 'assets/icons/NotificationIcon';
import CircleErrorIcon from 'assets/icons/CircleErrorIcon';
import ChevronLeft from 'assets/icons/ChevronLeft';
import ChevronRight from 'assets/icons/ChevronRight';
import CrossIcon from 'assets/icons/CrossIcon';
import ArrowRightIcon from 'assets/icons/ArrowRightIcon';
import useMoveInStepper from 'components/move-in/Stepper/useMoveInStepper';
import useMoveOutStepper from 'components/move-out/Stepper/useMoveOutStepper';
import 'lib/swiper-style';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: replace `any` with proper type
export default function Notifications({ fields }: any) {
  const router = useRouter();
  const { loadMoveInStepper, isLoadingStepperData } = useMoveInStepper(false);
  const { loadMoveOutStepper, isLoadingStepperData: isLoadingMoveOutStepper } =
    useMoveOutStepper(false);
  const { tCode, ProfileType } = useUserStore();
  const { openModal, activeModal, closeModal } = useUIStore();
  const [notifications, setNotifications] = useState<any[] | null>(null);
  const [profileData, setProfileData] = useState<any>({});
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [renewalPromotionData, setRenewalPromotionData] = useState<any>(null);
  const [showLeaseNotification, setShowLeaseNotification] = useState(false);
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const [formattedLeaseEndDate, setFormattedLeaseEndDate] = useState('');
  const [dateBeforeLeaseEnd, setDateBeforeLeaseEnd] = useState('');
  const [moveInUser, setMoveInUser] = useState(false);
  const [pendingNotificationAPI, setPendingNotificationAPI] = useState(3);
  const [renewLeaseButtonText, setRenewLeaseButtonText] = useState('RENEW LEASE');
  const swiperRef = useRef<SwiperType | null>(null);
  const setUserData = useUserStore((state) => state.setUserData);

  // API mutations
  const { mutate: mutateNotifications } = useApiMutation<any, any>(
    `/Tenant/${tCode}/Notifications?removeDashboard=true`,
    'GET',
    false
  );

  const { mutate: mutateProfileData } = useApiMutation<any, any>(
    `/Tenant/${tCode}/Notifications/ProfileLiteApps`,
    'GET',
    false
  );

  const { mutate: mutateOutstandingAmount } = useApiMutation<any, any>(
    `/v1/payments/dashboard/${tCode}/PaymentsSummary?onlyOutstanding=true`,
    'GET',
    false
  );

  const { mutate: mutateRenewalPromotion } = useApiMutation<any, any>(
    `/ContractRenewal/ContractRenewalDiscount/${tCode}`,
    'GET',
    false
  );

  const { mutate: mutateRenewalStepper } = useApiMutation<any, any>(
    `/ContractRenewal/Stepper/${tCode}`,
    'GET',
    true
  );

  const { mutate: mutateClearNotification } = useApiMutation<{ id: string }, any>(
    (variables) => `/Tenant/${tCode}/Notifications/${variables.id}`,
    'PUT',
    true,
    () => null
  );

  const { mutate: mutateGetDownloadDocuments } = useApiMutation<{ type: number }, any>(
    (variables) => `/MoveIn/GetMoveInDocument/${tCode}/${variables.type}`,
    'GET',
    false
  );

  const { mutate: mutateSendEmailDocuments } = useApiMutation<{ type: number }, any>(
    (variables) => `/MoveIn/EmailDocument/${tCode}/${variables.type}`,
    'POST',
    false,
    () => null
  );

  // Helper function to download file from base64
  const downloadFileFromBase64 = (base64String: string, fileName: string) => {
    try {
      // Determine content type from file extension
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      let contentType = 'application/octet-stream';
      switch (fileExtension) {
        case 'pdf':
          contentType = 'application/pdf';
          break;
        case 'jpg':
        case 'jpeg':
          contentType = 'image/jpeg';
          break;
        case 'png':
          contentType = 'image/png';
          break;
        default:
          contentType = 'application/octet-stream';
      }

      // Decode base64 string, remove spaces for IE compatibility
      const binary = atob(base64String.replace(/\s/g, ''));
      const len = binary.length;
      const buffer = new ArrayBuffer(len);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
      }

      // Create blob object
      const fileBlob = new Blob([view], { type: contentType });
      const url = URL.createObjectURL(fileBlob);

      // Handle IE/Edge
      if ((window.navigator as any).msSaveBlob) {
        (window.navigator as any).msSaveBlob(fileBlob, fileName);
        URL.revokeObjectURL(url);
        return;
      }

      // Create download link for modern browsers
      const anchor = document.createElement('a');
      anchor.style.display = 'none';
      anchor.setAttribute('href', url);
      anchor.setAttribute('target', '_self');
      anchor.setAttribute('download', fileName);
      document.body.appendChild(anchor);

      // Trigger download
      setTimeout(() => {
        anchor.click();
        URL.revokeObjectURL(url);
        anchor.remove();
        try {
          document.body.removeChild(anchor);
        } catch (e) {}
      }, 10);
    } catch (error) {
      console.error('Error downloading file:', error);
      openModal('error-modal');
    }
  };

  // Function to get download documents
  const getDownloadDocuments = (type: number) => {
    if (!tCode) return;

    mutateGetDownloadDocuments(
      { type },
      {
        onSuccess: (response: any) => {
          if (response && response.FileBase64String) {
            const downloadContent = response.FileBase64String;
            const downloadFileName = response.File_Name;
            downloadFileFromBase64(downloadContent, downloadFileName);
          } else {
            openModal('error-modal');
          }
        },
        onError: (error) => {
          console.error('Error downloading document:', error);
          openModal('error-modal');
        },
      }
    );
  };

  // Function to send email documents
  const sendEmailDocuments = (type: number) => {
    if (!tCode) return;

    mutateSendEmailDocuments(
      { type },
      {
        onSuccess: (response: any) => {
          if (response) {
            openModal('document-send-success-modal');
          } else {
            openModal('error-modal');
          }
        },
        onError: (error) => {
          console.error('Error sending email document:', error);
          openModal('error-modal');
        },
      }
    );
  };

  // Load notifications
  useEffect(() => {
    if (tCode) {
      mutateNotifications(null, {
        onSuccess: (response) => {
          if (response) {
            setNotifications(response);
          }
        },
      });
    }
  }, [tCode, mutateNotifications]);

  // Load profile data
  useEffect(() => {
    if (tCode) {
      mutateProfileData(null, {
        onSuccess: (response) => {
          if (response) {
            setUserData({
              FirstName: response?.FirstName,
              LastName: response?.LastName,
              CommunityName: response?.CommunityName,
              Email: response?.Email,
              Mobile: response?.Mobile,
              LeaseEndDate: response?.LeaseEndDate,
              ProfileType: response?.ProfileType,
              ProfileStatus: response?.ProfileStatus,
              UserState_CR: response?.UserState_CR,
              HideMoveOutLink: response?.HideMoveOutLink,
              DisableRenewLater: response?.DisableRenewLater,
              IsMoveIn: response?.IsMoveIn,
              IsMoveOut: response?.IsMoveOut,
              IsOverStay: response?.IsOverStay,
              IsRenewalUser: response?.IsRenewalUser,
              PropertyPhase: response?.PropertyPhase,
              LeaseStartDate: response?.LeaseStartDate,
              MoveInDate: response?.MoveInDate,
              UserState_MI: response?.UserState_MI,
              CommunityDisplayName: response?.CommunityDisplayName,
              CommunityEmail: response?.CommunityEmail,
              CommunityAddress: response?.CommunityAddress,
              CommunityOfficeWorkingHrs: response?.CommunityOfficeWorkingHrs,
              UnitNumber: response?.UnitNumber ?? response?.UnitNo ?? null,
              Unit_Code: response?.Unit_Code?.trim?.() ?? null,
              ProposalEndDate: response?.ProposalEndDate,
              IsNewLease: response?.IsNewLease,
              UserState_NL: response?.UserState_NL,
              TimeRemaningToUnblockUnit: response?.TimeRemaningToUnblockUnit,
              BlockedUnitId: response?.BlockedUnitId,
              UnitBlockedText: response?.UnitBlockedText,
              ShowCancelMoveOut: response?.ShowCancelMoveOut,
              MO_UserState: response?.MO_UserState,
              IsMOFinalDocPageVisited: response?.IsMOFinalDocPageVisited,
              OutstandingAmount: response?.OutstandingAmount,
              MoveInPermit_flag: response?.MoveInPermit_flag,
              IsBlackListedOrGR: response?.IsBlackListedOrGR,
            });
            setProfileData(response);
            // Extract lease end date from profile data if available
            if (response.LeaseEndDate) {
              setLeaseEndDate(response.LeaseEndDate);
            }
            // Check if user is move-in user
            if (response.IsMoveIn === true) {
              setMoveInUser(true);
            }

            // Set renew lease button text
            if (response.UserState_CR != null && response.UserState_CR !== '') {
              setRenewLeaseButtonText('RESUME RENEWAL');
            }
            setPendingNotificationAPI((prev) => prev - 1);
          }
        },
        onError: (error) => {
          console.error('Error loading profile data:', error);
          setPendingNotificationAPI((prev) => prev - 1);
        },
      });
    }
  }, [tCode, mutateProfileData, ProfileType]);

  // Load outstanding amount
  useEffect(() => {
    if (tCode) {
      mutateOutstandingAmount(null, {
        onSuccess: (response) => {
          if (response && Array.isArray(response)) {
            const outstandingPaymentArray = response.filter(
              (element: any) => element.Category === 'Outstanding Payments'
            );
            if (outstandingPaymentArray.length > 0) {
              let amount = parseFloat(outstandingPaymentArray[0].Amount);
              if (amount < 0) {
                amount = 0;
              }
              setOutstandingAmount(amount);
            }
          }
          setPendingNotificationAPI((prev) => prev - 1);
        },
        onError: (error) => {
          console.error('Error loading outstanding amount:', error);
          setPendingNotificationAPI((prev) => prev - 1);
        },
      });
    }
  }, [tCode, mutateOutstandingAmount]);

  // Load renewal promotion data
  useEffect(() => {
    if (tCode) {
      mutateRenewalPromotion(null, {
        onSuccess: (response) => {
          if (response && response.TotalDiscount !== 0 && response.ExpiryDate !== null) {
            response.TotalDiscount = Math.abs(response.TotalDiscount);
            setRenewalPromotionData(response);
          }
          setPendingNotificationAPI((prev) => prev - 1);
        },
        onError: (error) => {
          console.error('Error loading renewal promotion:', error);
          setPendingNotificationAPI((prev) => prev - 1);
        },
      });
    }
  }, [tCode, mutateRenewalPromotion]);

  const clearNotification = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!tCode) return;

    mutateClearNotification(
      { id },
      {
        onSuccess: (response: any) => {
          if (response && response.Code === 200) {
            const target = e.currentTarget as HTMLElement;
            const href = (target as HTMLAnchorElement).href;

            if (href) {
              window.location.href = href;
            } else {
              if (typeof (window as any).updateNotificationBadge === 'function') {
                (window as any).updateNotificationBadge(id);
              }

              setNotifications((prev) => prev?.filter((item: any) => item.Id !== id) || null);

              if (swiperRef.current) {
                swiperRef.current.update();
              }
            }
          } else {
            openModal('error-modal');
          }
        },
        onError: (error) => {
          console.error('Error clearing notification:', error);
          openModal('error-modal');
        },
      }
    );
  };

  // Format lease end date
  useEffect(() => {
    if (leaseEndDate) {
      setFormattedLeaseEndDate(formatDate(leaseEndDate));
      const leaseEndDateObj = new Date(leaseEndDate);
      const msIn90Days = 90 * 24 * 60 * 60 * 1000;
      const newDate = new Date(leaseEndDateObj.getTime() - msIn90Days);
      setDateBeforeLeaseEnd(formatDate(newDate.toISOString().split('T')[0]));
    }
  }, [leaseEndDate]);

  // Check lease notification
  useEffect(() => {
    if (leaseEndDate) {
      const leaseEndDateObj = new Date(leaseEndDate);
      const today = new Date();
      const diffTime = leaseEndDateObj.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 90 && diffDays < 120) {
        setShowLeaseNotification(true);
      }
    }
  }, [leaseEndDate]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-AE').format(num);
  };

  const showBlacklistedNotification = (): boolean => {
    if (!leaseEndDate || !profileData?.IsBlackListedOrGR) {
      return false;
    }
    const today = new Date();
    const endDate = new Date(leaseEndDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > -30 && diffDays < 90 && profileData.IsBlackListedOrGR) {
      return true;
    } else {
      return false;
    }
  };

  const getNotificationColor = (type: string): boolean => {
    const dangerTypes = [
      'CARD_EXPIRY',
      'DOC_EXPIRY',
      'DOC_VERIFICATION_FAILED',
      'SHORT_TERM_RENEWAL_REJECTED',
      'DEFER_PAYMENT_REJECTED',
      'PAYMENTS_BOUNCED_CHEQUE',
    ];
    return dangerTypes.includes(type);
  };

  const getUnseenNotifications = (): any[] => {
    return notifications ? notifications.filter((item: any) => !item.IsSeen) : [];
  };

  const validateRenewalProposal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!tCode) return;

    mutateRenewalStepper(null, {
      onSuccess: (response) => {
        if (response && response.ErrorCode == null) {
          // Navigate to renew lease link if validation succeeds
          const renewLeaseHref =
            fields?.renewLeaseLink?.value?.href || fields?.renewLeaseLink?.href;
          if (renewLeaseHref) {
            window.location.href = renewLeaseHref;
          } else {
            console.error('Renew lease link not found');
          }
        } else {
          openModal('renewals-error-modal');
        }
      },
      onError: (error) => {
        console.error('Error validating renewal proposal:', error);
        openModal('renewals-error-modal');
      },
    });
  };

  const hasNotifications = (): boolean => {
    if (
      pendingNotificationAPI === 0 &&
      ProfileType !== 8 &&
      profileData &&
      Object.keys(profileData).length > 0 &&
      !profileData.IsPastUser &&
      (profileData.IsBlackListedOrGR ||
        (outstandingAmount != 0 && !moveInUser) ||
        showLeaseNotification ||
        profileData.IsRenewalUser ||
        profileData.IsOverStay ||
        moveInUser ||
        profileData.IsMoveOut ||
        getUnseenNotifications().length > 0)
    ) {
      return true;
    }
    return false;
  };

  const unseenNotifications = getUnseenNotifications();

  return (
    <>
      {profileData && Object.keys(profileData) && ProfileType !== 8 && !profileData.IsPastUser && (
        <section className="notifications mt-10 md:mt-10">
          <div className="container-sm">
            <div className="flex flex-col">
              <div className="w-full">
                {hasNotifications() && (
                  <h3 className="text-heading-2 font-normal mb-0">Notifications</h3>
                )}
              </div>
              <div className="w-full">
                {pendingNotificationAPI === 0 &&
                  profileData &&
                  Object.keys(profileData).length > 0 &&
                  ProfileType !== 8 &&
                  !profileData.IsPastUser && (
                    <>
                      {/* Blacklisted Notification */}
                      {showBlacklistedNotification() && (
                        <div className="p-3 md:p-5 border-danger-500 bg-danger-50 rounded-xl mt-5 md:mt-6">
                          <div className="flex gap-3 items-center">
                            <div className="shrink-0">
                              <CircleCrossIcon className="text-danger-500 text-xl md:text-2xl" />
                            </div>
                            <div className="grow">
                              <p className="text-body lg:text-[14px] lg:leading-5 font-light text-danger-900 m-0">
                                We are unable to process your contract renewal via the app. Please
                                call us on{' '}
                                <a
                                  href="tel:8009933"
                                  className="text-danger-900 no-underline"
                                  data-analytics-value="home_blacklisted_call_click"
                                >
                                  8009933
                                </a>{' '}
                                or visit our branch before your contract expires on{' '}
                                {leaseEndDate ? formatDate(leaseEndDate) : ''}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Outstanding Payments */}
                      {outstandingAmount > 0 && (
                        <div className="p-4 lg:p-5 bg-silver-chalice-50 border border-lilac-300 rounded-xl mt-5 md:mt-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="grow">
                              <p className="text-[16px] leading-5 md:text-heading-3 font-normal text-navy-500 mb-0">
                                Outstanding Payment - AED {formatNumber(outstandingAmount)}
                              </p>
                            </div>
                            <div className="shrink-0">
                              <CustomLink
                                field={fields?.outstandingPaymentLink}
                                className="btn btn-primary w-full md:w-auto md:min-w-68.75"
                                data-analytics-value="home_outstanding_pay"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Renew Lease - Lease End Date > 90 and < 120 */}
                      {showLeaseNotification && (
                        <div className="p-4 lg:p-5 bg-silver-chalice-50 border border-lilac-300 rounded-xl mt-5 md:mt-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="grow">
                              <p className="text-[16px] leading-5 md:text-heading-3 font-normal text-navy-500 mb-0">
                                Lease Expiry Date - {formattedLeaseEndDate}
                              </p>
                              <p className="text-body lg:text-[14px] lg:leading-5 font-light text-navy-500 mt-2 md:mt-3 mb-0">
                                The renewal option will be available in the portal from{' '}
                                {dateBeforeLeaseEnd} (90 days before expiry).
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Renew Lease - Lease End Date < 90 */}
                      {profileData?.IsRenewalUser && (
                        <div className="p-4 lg:p-5 bg-silver-chalice-50 border border-lilac-300 rounded-xl mt-5 md:mt-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="grow">
                              <p className="text-[16px] leading-5 md:text-heading-3 font-normal text-navy-500 mb-0">
                                Lease Expiry Date - {formattedLeaseEndDate}
                              </p>
                              {renewalPromotionData ? (
                                <p className="text-body lg:text-[14px] lg:leading-5 font-light text-navy-500 mt-2 md:mt-3 mb-0">
                                  Complete renewal by {formatDate(renewalPromotionData.ExpiryDate)}{' '}
                                  to receive a payment waiver worth AED{' '}
                                  {parseFloat(renewalPromotionData.TotalDiscount).toFixed(2)}
                                </p>
                              ) : (
                                <p className="text-body lg:text-[14px] lg:leading-5 font-light text-navy-500 mt-2 md:mt-3 mb-0">
                                  Please renew at the earliest.
                                </p>
                              )}
                            </div>
                            <div className="shrink-0">
                              <CustomLink
                                field={fields?.renewLeaseLink}
                                className="btn btn-primary w-full md:w-auto md:min-w-68.75"
                                data-analytics-value="home_renew_lease_click"
                                onClick={validateRenewalProposal}
                              >
                                {renewLeaseButtonText}
                              </CustomLink>
                            </div>
                          </div>
                          {!profileData.HideMoveOutLink && (
                            <div className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-lilac-300">
                              <p className="text-body lg:text-[14px] lg:leading-5 font-light text-navy-500 m-0">
                                If you wish to move-out on lease expiry, please submit your{' '}
                                <CustomLink
                                  field={fields?.moveOutNoticeLink}
                                  className="text-body lg:text-[14px] lg:leading-5 font-normal text-sky-700 underline hover:text-sky-600"
                                  data-analytics-value="home_submit_move_out_notice"
                                />
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Expired Lease */}
                      {profileData?.IsOverStay && (
                        <div className="p-4 lg:p-5 bg-silver-chalice-50 border border-lilac-300 rounded-xl mt-5 md:mt-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="grow">
                              <p className="text-[16px] leading-5 md:text-heading-3 font-normal text-navy-500 mb-0">
                                Your lease contract has expired.
                              </p>
                              <p className="text-body lg:text-[14px] lg:leading-5 font-light text-navy-500 mt-2 md:mt-3 mb-0">
                                Please visit our Head Office immediately for renewal.
                              </p>
                            </div>
                            <div className="shrink-0">
                              <CustomLink
                                field={fields?.contactUsLink}
                                className="btn btn-primary w-full md:w-auto md:min-w-68.75"
                                data-analytics-value="home_lease_expired_contact_us"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Move In Notifications */}
                      {moveInUser && (
                        <>
                          {(profileData?.UserState_MI == null ||
                            profileData?.UserState_MI == 0) && (
                            <>
                              <div className="p-3 md:p-5 border border-solid border-success-500 bg-success-50 rounded-xl mt-5 md:mt-6">
                                <div className="flex gap-3 items-center">
                                  <div className="shrink-0">
                                    <CircleTickIcon className="text-success-500 text-xl md:text-2xl" />
                                  </div>
                                  <div className="grow">
                                    <p className="text-body lg:text-[14px] lg:leading-5 font-light text-success-900 m-0">
                                      Congratulations! Your Lease Document has been approved.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <h3 className="text-[16px] leading-5 md:text-heading-3 font-normal mt-5 md:mt-6 mb-0">
                                Download Your Lease Documents{' '}
                                <span className="font-light">
                                  (Also available in Documents section)
                                </span>
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-5">
                                <div className="p-3 bg-silver-chalice-50 border border-lilac-300 rounded-xl mt-5 md:mt-3">
                                  <div className="flex items-center justify-between">
                                    <div className="grow">
                                      <p className="text-body lg:text-[14px] lg:leading-5 font-light text-navy-500 m-0 flex items-center">
                                        <AdminDocumentsIcon className="text-xl md:text-2xl mr-4" />
                                        Lease Contract
                                      </p>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-4">
                                      <button
                                        onClick={() => getDownloadDocuments(2)}
                                        className="text-2xl text-navy-500 hover:text-lilac-hover"
                                        data-analytics-value="home_lease_con_download cursor-pointer"
                                      >
                                        <DownloadIcon />
                                      </button>
                                      <button
                                        onClick={() => sendEmailDocuments(2)}
                                        className="text-2xl text-navy-500 hover:text-lilac-hover"
                                        data-analytics-value="home_lease_con_email cursor-pointer"
                                      >
                                        <EmailIcon />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-3 bg-silver-chalice-50 border border-lilac-300 rounded-xl mt-5 md:mt-3">
                                  <div className="flex items-center justify-between">
                                    <div className="grow">
                                      <p className="text-body lg:text-[14px] lg:leading-5 font-light text-navy-500 m-0 flex items-center">
                                        <AdminBillsIcon className="text-xl md:text-2xl mr-4" />
                                        Ejari Certificate
                                      </p>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-4">
                                      <button
                                        onClick={() => getDownloadDocuments(1)}
                                        className="text-2xl text-navy-500 hover:text-lilac-hover"
                                        data-analytics-value="home_ejari_certi_downalod cursor-pointer"
                                      >
                                        <DownloadIcon />
                                      </button>
                                      <button
                                        onClick={() => sendEmailDocuments(1)}
                                        className="text-2xl text-navy-500 hover:text-lilac-hover"
                                        data-analytics-value="home_ejari_certi_email cursor-pointer"
                                      >
                                        <EmailIcon />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4 lg:p-5 bg-silver-chalice-50 border border-lilac-300 rounded-xl mt-5 md:mt-6">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                  <div className="grow">
                                    <p className="text-[16px] leading-5 md:text-heading-3 font-normal text-navy-500 mb-0">
                                      Please refer to the{' '}
                                      <button
                                        onClick={() => getDownloadDocuments(3)}
                                        className="text-sky-700 underline hover:text-sky-600 cursor-pointer"
                                      >
                                        MOVE-IN GUIDELINES
                                      </button>{' '}
                                      and complete your utilities registration to Move-In on{' '}
                                      {profileData?.MoveInDate ? (
                                        <span className="font-bold">
                                          {formatDate(profileData.MoveInDate)}
                                        </span>
                                      ) : (
                                        ''
                                      )}
                                    </p>
                                  </div>
                                  <div className="shrink-0">
                                    <button
                                      type="button"
                                      className="btn btn-primary w-full md:w-auto md:min-w-68.75"
                                      data-analytics-value="home_move_in"
                                      onClick={() => router.push('/move-in')}
                                    >
                                      {fields?.moveInLink?.value?.text ||
                                        fields?.moveInLink?.text ||
                                        'Initiate Move In'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          {(profileData?.UserState_MI == 1 || profileData?.UserState_MI == 2) && (
                            <div className="p-4 lg:p-5 bg-silver-chalice-50 border border-lilac-300 rounded-xl mt-5 md:mt-6">
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="grow">
                                  <p className="text-[16px] leading-5 md:text-heading-3 font-normal text-navy-500 mb-0">
                                    Complete your Move-in process by{' '}
                                    {profileData?.LeaseStartDate ? (
                                      <span className="font-bold">
                                        {formatDate(profileData.LeaseStartDate)}
                                      </span>
                                    ) : (
                                      ''
                                    )}
                                  </p>
                                </div>
                                <div className="shrink-0">
                                  <button
                                    type="button"
                                    className="btn btn-primary w-full md:w-auto md:min-w-68.75"
                                    data-analytics-value="home_move_in"
                                    disabled={isLoadingStepperData}
                                    onClick={() => loadMoveInStepper(true)}
                                  >
                                    {fields?.resumeMoveInLink?.value?.text ||
                                      fields?.resumeMoveInLink?.text ||
                                      'RESUME MOVE-IN'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                          {profileData?.UserState_MI == 3 && (
                            <div className="p-4 lg:p-5 bg-silver-chalice-50 border border-lilac-300 rounded-xl mt-5 md:mt-6">
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="grow">
                                  <p className="text-[16px] leading-5 md:text-heading-3 font-normal text-navy-500 mb-0">
                                    Your request for a key handover meeting has been submitted
                                    successfully!
                                  </p>
                                </div>
                                <div className="shrink-0">
                                  <CustomLink
                                    field={fields?.keyHandoverLink}
                                    className="btn btn-primary w-full md:w-auto md:min-w-68.75"
                                  />
                                </div>
                              </div>
                              {profileData?.MoveInPermit_flag && (
                                <div className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-lilac-300">
                                  <p className="text-body lg:text-[14px] lg:leading-5 font-light text-navy-500 m-0">
                                    Your Move-in permit is ready.{' '}
                                    <button
                                      onClick={() => getDownloadDocuments(4)}
                                      className="text-body lg:text-[14px] lg:leading-5 font-normal cursor-pointer text-sky-700 underline hover:text-sky-600"
                                      data-analytics-value="home_move_in_download_here"
                                    >
                                      Download here
                                    </button>
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}

                      {/* Move Out Notifications */}
                      {profileData?.IsMoveOut && !profileData?.IsMOFinalDocPageVisited && (
                        <div className="p-4 lg:p-5 bg-silver-chalice-50 border border-lilac-300 rounded-xl mt-5 md:mt-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="grow">
                              <p className="text-[16px] leading-5 md:text-heading-3 font-normal text-navy-500 mb-0">
                                You have initiated your Move-out. Please resume to complete the
                                process.
                              </p>
                            </div>
                            <div className="shrink-0">
                              <button
                                type="button"
                                className="btn btn-primary w-full md:w-auto md:min-w-68.75"
                                data-analytics-value="home_move_out"
                                disabled={isLoadingMoveOutStepper}
                                onClick={() => loadMoveOutStepper(true)}
                              >
                                {fields?.resumeMoveOutLink?.value?.text ||
                                  fields?.resumeMoveOutLink?.text ||
                                  'RESUME MOVE-OUT'}
                              </button>
                            </div>
                          </div>
                          {profileData?.ShowCancelMoveOut && (
                            <div className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-lilac-300">
                              <p className="text-body lg:text-[14px] lg:leading-5 font-light text-navy-500 m-0">
                                Would you like to renew your lease?{' '}
                                <button
                                  className="text-body lg:text-[14px] lg:leading-5 font-normal text-sky-700 underline hover:text-sky-600"
                                  data-analytics-value="home_cancel_move_out_notice"
                                >
                                  CANCEL MOVE-OUT NOTICE
                                </button>
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      {profileData?.IsMoveOut && profileData?.IsMOFinalDocPageVisited && (
                        <div className="p-4 lg:p-5 bg-silver-chalice-50 border border-lilac-300 rounded-xl mt-5 md:mt-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="grow">
                              <p className="text-[16px] leading-5 md:text-heading-3 font-normal text-navy-500 mb-0">
                                Thank you for submitting your Move-out related documents. Your
                                security deposit will be refunded soon, as applicable.
                              </p>
                            </div>
                            <div className="shrink-0">
                              <CustomLink
                                field={fields?.moveOutRefundLink}
                                className="btn btn-primary w-full md:w-auto md:min-w-68.75"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                {/* Skeleton Loading */}
                {(pendingNotificationAPI > 0 || notifications == null) && (
                  <div className="notifications-skeleton mt-5 md:mt-6">
                    {!hasNotifications() && (
                      <div className="h-4 rounded-lg bg-silver-chalice-200 max-w-61.25 relative overflow-hidden after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent after:animate-shine"></div>
                    )}
                    <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-8 p-5 rounded-xl bg-silver-chalice-100 items-center">
                      <div
                        className="h-4 rounded-lg bg-silver-chalice-200 w-full max-w-61.25 flex items-center mx-auto md:mx-0
                            relative overflow-hidden
                            after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full
                            after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent
                            after:animate-shine"
                      ></div>
                      <div
                        className="h-15 rounded-xl bg-silver-chalice-300 w-full md:max-w-68.75 shrink-0
                              md:ml-auto
                              relative overflow-hidden
                              after:content-[''] after:absolute after:top-0 after:-left-full after:h-full after:w-full
                              after:bg-linear-to-r after:from-transparent after:via-white-pure/40 after:to-transparent
                              after:animate-shine"
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full">
                {/* Unseen Notifications Slider */}
                {unseenNotifications.length > 0 && (
                  <div className="flex flex-wrap md:flex-nowrap gap-5 items-center mt-6 md:mt-6 justify-center md:justify-start">
                    <button
                      className="btn btn-secondary w-12 h-12 p-0 shrink-0 order-2 md:order-1 me-5 md:m-0"
                      onClick={() => swiperRef.current?.slidePrev()}
                    >
                      <ChevronLeft />
                    </button>
                    <div className="w-full md:w-[calc(100%-136px)] order-1 md:order-2">
                      <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        onSwiper={(swiper) => {
                          swiperRef.current = swiper;
                        }}
                        autoplay={{
                          delay: 5000,
                          disableOnInteraction: false,
                        }}
                        className="swiper h-full!"
                      >
                        {unseenNotifications.map((item: any) => (
                          <SwiperSlide key={item.Id} className="h-auto! flex">
                            <div
                              className={`flex flex-col h-full p-5 md:pl-17 rounded-xl border relative ${
                                getNotificationColor(item.Notification.NotificationId)
                                  ? 'border-danger-500 bg-danger-50'
                                  : 'border-success-500 bg-success-50'
                              }`}
                            >
                              <h4
                                className={`text-body font-medium mb-1 flex gap-2 items-center ${
                                  getNotificationColor(item.Notification.NotificationId)
                                    ? 'text-danger-900'
                                    : 'text-success-900'
                                }`}
                              >
                                {getNotificationColor(item.Notification.NotificationId) ? (
                                  <CircleErrorIcon className="size-6 text-danger-500 md:absolute md:left-5 md:top-1/2 md:-translate-y-1/2" />
                                ) : (
                                  <NotificationIcon className="size-6 text-success-500" />
                                )}
                                {item.Notification.Title}
                                <button
                                  onClick={(e) => clearNotification(item.Id, e)}
                                  className={`ms-auto ${
                                    getNotificationColor(item.Notification.NotificationId)
                                      ? 'text-danger-500'
                                      : 'text-success-500'
                                  }`}
                                  data-analytics-value={`home_notification_close_${item.Notification.NotificationId}`}
                                >
                                  <CrossIcon />
                                </button>
                              </h4>
                              <p
                                className={`text-body font-light mb-2 ${
                                  getNotificationColor(item.Notification.NotificationId)
                                    ? 'text-danger-900'
                                    : 'text-success-900'
                                }`}
                              >
                                {item.Notification.Description}
                              </p>
                              <div className="flex flex-col md:flex-row gap-4 mt-auto mb-0">
                                <div className="grow">
                                  {item.Notification.Actions &&
                                    item.Notification.Actions.length > 0 && (
                                      <a
                                        href={item.Notification.Actions[0].ActionURL}
                                        onClick={(e) => clearNotification(item.Id, e)}
                                        className="text-body font-medium text-sky-700 underline hover:text-sky-600"
                                        data-analytics-value={`home_notification_click_${item.Notification.NotificationId}`}
                                      >
                                        {item.Notification.Actions[0].ActionName}
                                      </a>
                                    )}
                                </div>
                                <div className="shrink-0">
                                  <CustomLink
                                    field={fields?.viewAllNotificationsLink}
                                    className="text-body font-medium text-navy-500 hover:text-navy-600 flex items-center gap-2 mt-5 md:mt-0"
                                    data-analytics-value="home_notification_view_all"
                                  >
                                    <ArrowRightIcon className="w-5 h-5" />
                                    {fields?.viewAllNotificationsLink?.value?.text}
                                  </CustomLink>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                    <button
                      className="btn btn-secondary w-12 h-12 p-0 shrink-0 order-3  ms-5 md:m-0"
                      onClick={() => swiperRef.current?.slideNext()}
                    >
                      <ChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Document Send Success Modal */}
      <div
        className={`custom-modal ${activeModal === 'document-send-success-modal' ? 'show' : ''}`}
      >
        <div className="custom-modal__wrapper">
          <h3 className="custom-modal__heading">
            Document has been sent successfully to your registered email!
          </h3>
          <Image
            className="custom-modal__img"
            src="/assets/svg/email.svg"
            alt="Email Sent"
            width={294}
            height={210}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="custom-modal__btn-wrapper">
            <button className="btn btn-primary btn-sm" onClick={closeModal}>
              CLOSE
            </button>
          </div>
        </div>
      </div>

      {/* Renewals Error Modal */}
      <div
        className={`custom-modal error-modal ${
          activeModal === 'renewals-error-modal' ? 'show' : ''
        }`}
      >
        <div className="custom-modal__wrapper">
          <h3 className="custom-modal__heading">Your renewal proposal is in progress.</h3>
          <Image
            className="custom-modal__img"
            src="/assets/svg/error.svg"
            alt="Error"
            width={294}
            height={210}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <p className="custom-modal__desc">
            Please contact our call center team on <a href="tel:8009933">800 9933</a>
          </p>
          <div className="custom-modal__btn-wrapper">
            <button className="btn btn-primary btn-sm" onClick={closeModal}>
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
