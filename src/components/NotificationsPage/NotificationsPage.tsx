import Tabs from 'src/common/Tabx';
import { useUserStore } from 'src/store/useUserStore';

import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { CustomImage } from 'src/common/SitecoreOverrides';
import CrossIcon from 'assets/icons/CrossIcon';
import CircleErrorIcon from 'assets/icons/CircleErrorIcon';
import BellIcon from 'assets/icons/BellIcon';
import Link from 'next/link';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import CircleInfoIcon from 'assets/icons/CircleInfoIcon';
import { useMemo, useState } from 'react';
import ChevronDown from 'assets/icons/ChevronDown';
import { useRouter } from 'next/navigation';

export default function NotificationsPage({ fields }: any) {
  return (
    <section className="NotificationsPage">
      {/* Tabs */}
      <Tabs
        tabs={[
          {
            id: 1,
            label: 'UNREAD',
            content: <UnreadNotifications fields={fields} />,
          },
          {
            id: 2,
            label: 'ARCHIVE',
            content: <ArchiveNotifications fields={fields} />,
          },
        ]}
      />
    </section>
  );
}

function UnreadNotifications({ fields }: any) {
  const { tCode, notifications, isLoadingNotifications, setNotifications } = useUserStore();
  const { openModal } = useUIStore();
  const { mutate } = useApiMutation<string, any>(
    (id) => `/Tenant/${tCode}/Notifications/${id}`,
    'PUT',
    true
  );

  const clearNotification = (id: any, e: any) => {
    e.preventDefault();
    mutate(id, {
      onSuccess: (response: any) => {
        if (response != null && response.Code === 200) {
          const _notifications = notifications.map((n) => {
            if (n.Id === id) {
              n.IsSeen = true;
            }
            return n;
          });
          setNotifications(_notifications);
          if (e.target.href) {
            window.location.href = e.target.href;
          }
        } else {
          openModal('error-modal');
        }
      },
    });
  };

  if (isLoadingNotifications) return <SkeletonLoader />;
  if (getNotifications(1, notifications).length == 0)
    return <NoResultsFound fields={{ ...fields, type: 'archive' }} />;

  return (
    <div className="container-sm">
      <ul className="flex flex-col gap-3 md:gap-4">
        {getNotifications(1, notifications).map((item: any, index: number) => (
          <li
            key={index}
            className={`px-3 py-4 md:p-5 md:ps-17 rounded-xl relative border border-solid bg-white-pure ${
              getNotificationColor(item?.Notification?.NotificationId)
                ? 'border-danger-500'
                : 'border-lilac-300'
            }`}
          >
            <div className="flex gap-6">
              <div className="grow">
                <span className="text-body-sm font-light">{formatDate(item?.Date)}</span>
              </div>
              <div className="shrink">
                <button
                  className="text-navy-500 hover:text-lilac-300 transition-default cursor-pointer"
                  onClick={(e: any) => clearNotification(item?.Id, e)}
                >
                  <CrossIcon className="size-5" />
                </button>
              </div>
            </div>
            <h5 className="text-body font-medium text-navy-500 my-3 md:mt-2 md:mb-1">
              {getNotificationColor(item?.Notification?.NotificationId) ? (
                <CircleErrorIcon className="inline-block size-3.5 me-1 md:size-6 md:absolute md:top-5 md:start-5 text-danger-500" />
              ) : (
                <BellIcon className="inline-block size-3.5 me-1 md:size-6 md:absolute md:top-5 md:start-5 text-success-500" />
              )}
              {item?.Notification?.Title}
            </h5>
            <p className="text-body font-light text-navy-500">{item.Notification.Description}</p>
            <Link
              href={item.Notification.Actions[0].ActionURL}
              className="text-body font-medium text-sky-700 underline mt-3 md:mt-2 hover:text-sky-900 uppercase"
              onClick={(e: any) => clearNotification(item?.Id, e)}
            >
              {item.Notification.Actions[0].ActionName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const LOAD_LIMIT = 6;

function ArchiveNotifications({ fields }: any) {
  const [loadMore, setLoadMore] = useState(false);
  const notifications = useUserStore((state) => state.notifications);
  const isLoadingNotifications = useUserStore((state) => state.isLoadingNotifications);

  const sections = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    // Initial categorization
    const groups = notifications
      .filter((n: any) => n.IsSeen === true)
      .reduce(
        (acc: any, item: any) => {
          const d = new Date(item.Date);
          d.setHours(0, 0, 0, 0);
          if (d.getTime() === today.getTime()) acc.today.push(item);
          else if (d >= oneWeekAgo) acc.lastWeek.push(item);
          else acc.older.push(item);
          return acc;
        },
        { today: [], lastWeek: [], older: [] }
      );

    // Flatten into sections with a continuous index for the "Load More" logic
    let currentGlobalIndex = 0;
    return [
      { id: 'today', label: 'Today', data: groups.today },
      { id: 'lastWeek', label: 'Last Week', data: groups.lastWeek },
      { id: 'older', label: 'Older', data: groups.older },
    ].map((section) => ({
      ...section,
      items: section.data.map((item: any) => ({
        ...item,
        globalIndex: ++currentGlobalIndex,
      })),
    }));
  }, [notifications]);

  const totalSeen = useMemo(() => sections.reduce((sum, s) => sum + s.items.length, 0), [sections]);

  if (isLoadingNotifications) return <SkeletonLoader />;
  if (getNotifications(1, notifications).length == 0)
    return <NoResultsFound fields={{ ...fields, type: 'archive' }} />;
  return (
    <div className="container-sm">
      <p className="info-message-warning">
        <CircleInfoIcon />
        Archived notifications are automatically deleted after 30 days.
      </p>
      {sections.map(
        (section, index: any) =>
          section.items.length > 0 && (
            <div key={index} className="mt-5 md:mt-8 first:mt-0">
              <h4 className="text-heading-3 font-normal text-navy-400 mb-3 md:mb-4">
                {section.label}
              </h4>
              <ul className="flex flex-col gap-3 md:gap-4">
                {section.items.map((item: any, index: any) => {
                  if (!loadMore && item.globalIndex > LOAD_LIMIT) return null;

                  return (
                    <li
                      key={index}
                      className={`px-3 py-4 md:p-5 md:ps-17 rounded-xl relative border border-solid bg-white-pure ${
                        getNotificationColor(item?.Notification?.NotificationId)
                          ? 'border-danger-500'
                          : 'border-lilac-300'
                      }`}
                    >
                      <div className="flex gap-6">
                        <div className="grow">
                          <span className="text-body-sm font-light">{formatDate(item?.Date)}</span>
                        </div>
                      </div>
                      <h5 className="text-body font-medium text-navy-500 my-3 md:mt-2 md:mb-1">
                        {getNotificationColor(item?.Notification?.NotificationId) ? (
                          <CircleErrorIcon className="inline-block size-3.5 me-1 md:size-6 md:absolute md:top-5 md:start-5 text-danger-500" />
                        ) : (
                          <BellIcon className="inline-block size-3.5 me-1 md:size-6 md:absolute md:top-5 md:start-5 text-success-500" />
                        )}
                        {item?.Notification?.Title}
                      </h5>
                      <p className="text-body font-light text-navy-500">
                        {item.Notification.Description}
                      </p>
                      {item.Notification.Actions?.[0] && (
                        <Link
                          href={item.Notification.Actions[0].ActionURL}
                          className="text-body font-medium text-sky-700 underline mt-3 md:mt-2 hover:text-sky-900"
                        >
                          {item.Notification.Actions[0].ActionName}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )
      )}

      {!loadMore && totalSeen > LOAD_LIMIT && (
        <button
          onClick={() => setLoadMore(true)}
          className="flex justify-center items-center gap-3 w-auto mx-auto mt-8 text-body-sm font-bold md:font-medium text-navy-500 hover:text-navy-300 transition-default cursor-pointer"
        >
          <span>LOAD MORE</span>
          <ChevronDown className="size-4" />
        </button>
      )}
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="container-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-3 relative overflow-hidden px-3 py-5 md:p-5 rounded-xl bg-silver-chalice-100 skelton-animation">
          <div className="size-6 rounded-sm bg-silver-chalice-200"></div>
          <div className="grow">
            <div className="h-4 rounded-xl bg-silver-chalice-200"></div>
            <div className="h-4 max-w-43.75 mt-2 rounded-xl bg-silver-chalice-200"></div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 relative overflow-hidden px-3 py-5 md:p-5 rounded-xl bg-silver-chalice-100 skelton-animation">
          <div className="size-6 rounded-sm bg-silver-chalice-200"></div>
          <div className="grow">
            <div className="h-4 rounded-xl bg-silver-chalice-200"></div>
            <div className="h-4 max-w-43.75 mt-2 rounded-xl bg-silver-chalice-200"></div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 relative overflow-hidden px-3 py-5 md:p-5 rounded-xl bg-silver-chalice-100 skelton-animation">
          <div className="size-6 rounded-sm bg-silver-chalice-200"></div>
          <div className="grow">
            <div className="h-4 rounded-xl bg-silver-chalice-200"></div>
            <div className="h-4 max-w-43.75 mt-2 rounded-xl bg-silver-chalice-200"></div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 relative overflow-hidden px-3 py-5 md:p-5 rounded-xl bg-silver-chalice-100 skelton-animation">
          <div className="size-6 rounded-sm bg-silver-chalice-200"></div>
          <div className="grow">
            <div className="h-4 rounded-xl bg-silver-chalice-200"></div>
            <div className="h-4 max-w-43.75 mt-2 rounded-xl bg-silver-chalice-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoResultsFound({ fields }: any) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-6 m-4">
      <CustomImage field={fields?.NoResultsFoundImage} className="w-68.75 md:w-87.5" />
      <Text
        field={
          fields?.type == 'unread'
            ? fields?.NoNewNofiticationMessage
            : fields?.NoArchiveNofiticationMessage
        }
        tag="p"
        className="text-body font-light"
      />
      <button
        className="btn btn-secondary w-full md:w-68.75 px-0 h-11 md:h-15 uppercase"
        onClick={() => router.push('/dashboard')}
      >
        Back To Home
      </button>
    </div>
  );
}

const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  const day: any = date.getDate();
  const year = date.getFullYear();
  const getDaySuffix = (day: any) => {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };
  const dayWithSuffix = parseInt(day, 10) + getDaySuffix(parseInt(day, 10));
  const monthName = date.toLocaleString('default', { month: 'short' });
  return `${dayWithSuffix} ${monthName} ${year}`;
};

const getNotificationColor = (type: any) => {
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

const getNotifications = (activeTab: number, notificationsList: any) => {
  if (activeTab == 1) {
    return notificationsList.filter((n: any) => n.IsSeen === false);
  } else if (activeTab == 2) {
    return notificationsList.filter((n: any) => n.IsSeen === true);
  }
};
