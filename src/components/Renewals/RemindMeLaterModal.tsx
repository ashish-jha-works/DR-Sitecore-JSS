'use client';

import InfoIcon from 'assets/icons/InfoIcon';
import AddToCalendar from 'components/common/AddToCalendar';
import AvailableCalendar from 'components/common/AvailableCalendar';
import InfoMessage from 'components/InfoMessage';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useRemindMeLater } from './useRemindMeLater';

const REMINDER_TIME_RANGE = '09:00 AM - 10:00 AM';

interface RemindMeLaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields?: any;
}

export default function RemindMeLaterModal({
  isOpen,
  onClose,
  fields = {},
}: RemindMeLaterModalProps) {
  const {
    selectedDate,
    setSelectedDate,
    formattedLeaseEndDate,
    isDateDisabled,
    calendarDate,
    isAddToCalendarDisabled,
    submitRemindLater,
  } = useRemindMeLater(isOpen, onClose);

  if (!isOpen) return null;

  const reminderTitle = fields?.remindLaterEventTitle?.value ?? 'Contract Renewal Reminder';
  const reminderDescription =
    fields?.remindLaterEventDescription?.value ??
    `Reminder to renew your lease. Your lease expires on ${formattedLeaseEndDate}.`;

  return (
    <div className="custom-modal show overflow-y-auto !block">
      <div className="flex min-h-[100dvh] items-center justify-center p-5 md:p-8">
        <div className="relative bg-white-pure w-full max-w-xl rounded-xl border border-lilac-300 px-4 md:px-8 py-4 md:py-8 max-h-[calc(100dvh-2.5rem)] md:max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <Text
            tag="h2"
            field={fields?.remindLaterModalHeading}
            className="text-base md:text-heading-3 font-normal text-navy-500 mb-5 md:mb-6"
          />

          {formattedLeaseEndDate ? (
            <InfoMessage
              IconComponent={InfoIcon}
              status="normal"
              className="!border-lilac-400 mb-5"
            >
              <p className="text-body font-light">Your lease expires on {formattedLeaseEndDate}</p>
            </InfoMessage>
          ) : null}

          <p className="text-body font-light text-navy-500 mb-4">
            {fields?.remindLaterSelectDateLabel?.value ?? 'Remind me on this date.'}
          </p>

          <div className="[&_.rdp-day]:!w-8 [&_.rdp-day_button]:!w-8 [&_.rdp-day_button]:!h-8 md:[&_.rdp-day]:!w-12.5 md:[&_.rdp-day_button]:!w-12.5 md:[&_.rdp-day_button]:!h-12.5">
            <AvailableCalendar
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              isDateDisabled={isDateDisabled}
              className="w-full max-w-full lg:w-full min-w-0"
            />
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <button
              type="button"
              className="btn btn-secondary w-full h-11 md:h-15"
              onClick={onClose}
            >
              {fields?.remindLaterCancelButtonText?.value ?? 'CANCEL'}
            </button>

            <AddToCalendar
              label={fields?.remindLaterAddToCalendarLabel?.value ?? 'ADD TO CALENDAR'}
              title={reminderTitle}
              description={reminderDescription}
              date={calendarDate}
              timeRange={REMINDER_TIME_RANGE}
              timeZone="Asia/Dubai"
              disabled={isAddToCalendarDisabled}
              isPrimaryBtn
              fullWidth
              menuPlacement="top"
              onBeforeAction={submitRemindLater}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
