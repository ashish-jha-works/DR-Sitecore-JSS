'use client';

import ChevronRight from 'assets/icons/ChevronRight';
import React, { useLayoutEffect, useRef, useState } from 'react';

type MenuPlacement = 'top' | 'bottom' | 'auto';

type CalendarProps = {
  label: string;
  title: string;
  description: string;
  date: string;
  timeRange: string;
  timeZone?: string;
  showGoogle?: boolean;
  showOutlookWeb?: boolean;
  showOutlookDesktop?: boolean;
  disabled?: boolean;
  isPrimaryBtn?: boolean;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
  menuPlacement?: MenuPlacement;
  onBeforeAction?: () => Promise<boolean>;
};

/* ---------------- TIME FORMATTERS ---------------- */

const formatForGoogleCalendar = (date: string, timeRange: string): string => {
  const [startTime, endTime] = timeRange.split(' - ');

  const convert = (time: string) => {
    const [hm, mod] = time.split(' ');
    const [h, m] = hm.split(':');
    let hrs = parseInt(h, 10);

    if (mod === 'PM' && hrs !== 12) hrs += 12;
    if (mod === 'AM' && hrs === 12) hrs = 0;

    return `${String(hrs).padStart(2, '0')}${m}00`;
  };

  const d = date.replace(/-/g, '');

  return `${d}T${convert(startTime)}/${d}T${convert(endTime)}`;
};

const formatForOutlookCalendar = (date: string, timeRange: string) => {
  const [startTime, endTime] = timeRange.split(' - ');

  const convert = (time: string) => {
    const [hm, mod] = time.split(' ');
    const [h, m] = hm.split(':');
    let hrs = parseInt(h, 10);

    if (mod === 'PM' && hrs !== 12) hrs += 12;
    if (mod === 'AM' && hrs === 12) hrs = 0;

    return `${date}T${String(hrs).padStart(2, '0')}:${m}:00`;
  };

  return {
    start: convert(startTime),
    end: convert(endTime),
  };
};

const AddToCalendar: React.FC<CalendarProps> = ({
  label,
  title,
  description,
  date,
  timeRange,
  timeZone = 'Asia/Dubai',
  showGoogle = true,
  showOutlookWeb = true,
  showOutlookDesktop = true,
  disabled = false,
  isPrimaryBtn = true,
  className = '',
  containerClassName = '',
  fullWidth = false,
  menuPlacement = 'bottom',
  onBeforeAction,
}) => {
  const [toggleOpen, setToggleOpen] = useState(false);
  const [autoPlacement, setAutoPlacement] = useState<'top' | 'bottom'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);

  const resolvedPlacement = menuPlacement === 'auto' ? autoPlacement : menuPlacement;

  useLayoutEffect(() => {
    if (!toggleOpen || menuPlacement !== 'auto' || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const estimatedMenuHeight = 192;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    setAutoPlacement(
      spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow ? 'top' : 'bottom'
    );
  }, [toggleOpen, menuPlacement]);

  const runAction = async (action: () => void) => {
    if (onBeforeAction) {
      const canProceed = await onBeforeAction();
      if (!canProceed) return;
    }

    action();
    setToggleOpen(false);
  };

  const handleGoogle = () => {
    const dates = formatForGoogleCalendar(date, timeRange);

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      details: description,
      dates: dates,
      ctz: timeZone,
    });

    const url = `https://calendar.google.com/calendar/render?${params.toString()}`;

    window.open(url, '_blank');
  };

  const handleOutlookWeb = () => {
    const { start, end } = formatForOutlookCalendar(date, timeRange);

    // Ensure description uses <br> not \n
    const formattedDescription = description.replace(/\n/g, '<br>');

    const params = new URLSearchParams({
      subject: title,
      startdt: start,
      enddt: end,
      body: formattedDescription,
    });

    const url = `https://outlook.office365.com/calendar/0/deeplink/compose?${params.toString()}`;

    window.open(url, '_blank');
  };

  const handleICSDownload = () => {
    const { start, end } = formatForOutlookCalendar(date, timeRange);

    const formatICSDate = (value: string) => value.replace(/[-:]/g, '');

    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const uid = `${Date.now()}@yourapp.com`;

    const cleanPlainDescription = description.replace(/\n/g, '\\n');

    const cleanHtmlDescription = description.replace(/\n/g, '').replace(/"/g, "'");

    const icsContent =
      'BEGIN:VCALENDAR\n' +
      'VERSION:2.0\n' +
      'PRODID:-//YourApp//Booking Calendar//EN\n' +
      'BEGIN:VEVENT\n' +
      `UID:${uid}\n` +
      `DTSTAMP:${now}\n` +
      `SUMMARY:${title}\n` +
      `DESCRIPTION:${cleanPlainDescription}\n` +
      `X-ALT-DESC;FMTTYPE=text/html:<html><body>${cleanHtmlDescription}</body></html>\n` +
      `DTSTART:${formatICSDate(start)}\n` +
      `DTEND:${formatICSDate(end)}\n` +
      'END:VEVENT\n' +
      'END:VCALENDAR';

    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'event.ics');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  const widthClass = fullWidth ? 'w-full' : 'w-full md:w-68.75';
  const menuPositionClass = resolvedPlacement === 'top' ? 'bottom-full mb-1' : 'top-full mt-1';

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? 'w-full' : 'w-full lg:w-auto'} ${containerClassName}`}
    >
      <button
        type="button"
        className={`${
          isPrimaryBtn ? 'btn btn-primary' : 'btn btn-secondary'
        } ${widthClass} h-11 md:h-15 uppercase ${className}`}
        onClick={() => setToggleOpen(!toggleOpen)}
        disabled={disabled}
      >
        {label}
      </button>

      <ul
        className={`font-normal border border-lilac-300 rounded-lg overflow-hidden transition-default absolute z-50 left-0 ${widthClass} bg-white-pure shadow-[0_0_10.5px_2.1px_rgba(156,167,255,0.4)]
        ${menuPositionClass}
        ${
          toggleOpen
            ? 'max-h-60 opacity-100 pointer-events-auto'
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        {showGoogle && (
          <li
            onClick={() => runAction(handleGoogle)}
            className="px-6 py-4 flex justify-between items-center cursor-pointer hover:shadow-[0_0_10.5px_2.1px_rgba(156,167,255,0.4)]"
          >
            <span className="text-navy-500">Google</span>
            <ChevronRight className="w-5 h-5 text-lilac-500" />
          </li>
        )}

        {showOutlookWeb && (
          <li
            onClick={() => runAction(handleOutlookWeb)}
            className="px-6 py-4 flex justify-between items-center cursor-pointer hover:shadow-[0_0_10.5px_2.1px_rgba(156,167,255,0.4)]"
          >
            <span className="text-navy-500">Outlook Web App</span>
            <ChevronRight className="w-5 h-5 text-lilac-500" />
          </li>
        )}

        {showOutlookDesktop && (
          <li
            onClick={() => runAction(handleICSDownload)}
            className="px-6 py-4 flex justify-between items-center cursor-pointer hover:shadow-[0_0_10.5px_2.1px_rgba(156,167,255,0.4)]"
          >
            <span className="text-navy-500">Outlook</span>
            <ChevronRight className="w-5 h-5 text-lilac-500" />
          </li>
        )}
      </ul>
    </div>
  );
};

export default AddToCalendar;
