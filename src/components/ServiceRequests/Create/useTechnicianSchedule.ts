import { useEffect, useMemo, useState } from 'react';
import { addDays } from 'date-fns';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';
import { SlotsMap, TechnicalScheduleHookProps, TechnicianSlot } from './createRequest.types';

const SCHEDULE_WINDOW_DAYS = 7; // today through next 6 days

const parseApiDate = (dateStr: string) => {
  const [m, d, y] = dateStr.split('/');
  return new Date(+y, +m - 1, +d);
};

const toKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getScheduleWindowKeys = () => {
  const keys = new Set<string>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < SCHEDULE_WINDOW_DAYS; i++) {
    keys.add(toKey(addDays(today, i)));
  }

  return keys;
};

const scheduleTimeSlotValues: TechnicianSlot[] = [
  { Slot: '8:30 AM - 10:00 AM', IsAvailable: true },
  { Slot: '10:00 AM - 11:30 AM', IsAvailable: true },
  { Slot: '11:30 AM - 1:00 PM', IsAvailable: true },
  { Slot: '2:00 PM - 3:30 PM', IsAvailable: true },
  { Slot: '3:30 PM - 5:00 PM', IsAvailable: true },
  { Slot: '5:00 PM - 6:30 PM', IsAvailable: true },
];

export const useTechnicianSchedule = ({
  templateCode,
  community,
  technicianSchedule,
  setTechnicianSchedule,
  selectedDate,
  setSlots,
  setSelectedSlot,
  manualMode,
  setManualMode,
}: TechnicalScheduleHookProps) => {
  const { tCode } = useUserStore();
  const [apiError, setApiError] = useState(false);

  /* ---------- API ---------- */

  const { mutate: fetchTechnicianSchedule, isPending: isTechnicianScheduleLoading } =
    useApiMutation<any, any>(
      `Maximo/GetTechnicianSchedule/${tCode}?templateCode=${templateCode}&source=Portal&community=${community}`,
      'GET',
      false
    );

  useEffect(() => {
    if (!tCode || !templateCode) return;

    fetchTechnicianSchedule(null, {
      onSuccess: (response) => {
        if (!response?.length) {
          setApiError(true);
          setManualMode(true);
          setTechnicianSchedule([]);
        } else {
          setApiError(false);
          setManualMode(false);
          setTechnicianSchedule(response);
        }
      },
      onError: () => {
        setApiError(true);
        setManualMode(true);
        setTechnicianSchedule([]);
      },
    });
  }, [tCode, templateCode]);

  /* ---------- Build date → slots map ---------- */

  const slotsMap: SlotsMap = useMemo(() => {
    const map: SlotsMap = {};
    const windowKeys = getScheduleWindowKeys();

    if (manualMode) {
      windowKeys.forEach((key) => {
        map[key] = scheduleTimeSlotValues;
      });
      return map;
    }

    // API mode — only today through next 6 days
    technicianSchedule.forEach((day) => {
      if (!day.IsDayAvailable) return;

      const key = toKey(parseApiDate(day.Date));
      if (!windowKeys.has(key)) return;

      const availableSlots = (day.TechnicianSlot || []).filter((slot) => slot.IsAvailable);

      // Only enable day if at least 1 slot available
      if (availableSlots.length > 0) {
        map[key] = day.TechnicianSlot || [];
      }
    });

    return map;
  }, [technicianSchedule, manualMode]);

  const availableDateKeys = useMemo(() => new Set(Object.keys(slotsMap)), [slotsMap]);

  /* ---------- Sync slots when date changes ---------- */

  useEffect(() => {
    if (!selectedDate) return;

    const key = toKey(selectedDate);
    setSlots(slotsMap[key] ?? []);
    setSelectedSlot(null);
  }, [selectedDate, slotsMap]);

  return {
    apiError,
    availableDateKeys,
    isTechnicianScheduleLoading,
  };
};
