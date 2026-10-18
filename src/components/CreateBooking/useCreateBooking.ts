import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import {
  convertTo12Hour,
  convertDateToLocalString,
  formatToYYYYMMDD,
  formatTo24Hour,
  formatEventDate,
} from 'lib/utils/helper';
import { Amenity } from './CreateBooking.types';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';
import { useUIStore } from 'src/store/useUIStore';

const DEFAULT_CENTER = { lat: 25.218306, lng: 55.429164 };

const weekday = [
  { shortDay: 'Sun', fullDay: 'Sunday' },
  { shortDay: 'Mon', fullDay: 'Monday' },
  { shortDay: 'Tue', fullDay: 'Tuesday' },
  { shortDay: 'Wed', fullDay: 'Wednesday' },
  { shortDay: 'Thu', fullDay: 'Thursday' },
  { shortDay: 'Fri', fullDay: 'Friday' },
  { shortDay: 'Sat', fullDay: 'Saturday' },
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const useCreateBooking = (fields: any) => {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();

  const [step, setStep] = useState(1);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [calendarDates, setCalendarDates] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [baseSlotsOfDay, setBaseSlotsOfDay] = useState<any>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [bookingData, setBookingData] = useState<any>(null);
  const [isBookingCancelled, setIsBookingCancelled] = useState<boolean>(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  });

  // Fetch amenities API
  const { mutate: getAllAmenities, isPending: isLoadingAmenities } = useApiMutation<any, any>(
    () => `/Amenities/${tCode}/Resources`,
    'GET',
    false
  );

  // Fetch timeslots API
  const { mutate: getTimeslots, isPending: isLoadingTimeslots } = useApiMutation<any, any>(
    (params) => `/Amenities/${tCode}/Timeslots?resourceId=${params.resourceId}`,
    'GET',
    true
  );

  // Fetch timeslots API
  const { mutate: getStatusForBookingAvailability } = useApiMutation<any, any>(
    () =>
      `/Amenities/${tCode}/Bookable/?resourceId=${selectedLocation}&startTime=${formatToYYYYMMDD(
        selectedDate as Date
      )}`,
    'GET',
    true
  );

  // Create Booking API
  const { mutate: createBooking } = useApiMutation<any, any>(
    () => `Amenities/${tCode}/Book`,
    'POST',
    true
  );

  const manualDateChange = useRef(false);

  // Get unique amenity types
  const uniqueAmenityTypes = useMemo(() => {
    const map = new Map<string, Amenity>();
    amenities.forEach((a) => {
      if (!map.has(a.Type)) map.set(a.Type, a);
    });
    return Array.from(map.values()).sort((a, b) => a.Type.localeCompare(b.Type));
  }, [amenities]);

  // Get filtered locations based on selected amenity
  const locations = useMemo(() => {
    if (!selectedAmenity) return [];

    return amenities
      .filter((a) => a.Type === selectedAmenity.Type)
      .sort((a, b) => a.Name.localeCompare(b.Name));
  }, [selectedAmenity, amenities]);

  // Generate hourly slots
  const generateTimeSlots = (start: number, end: number) => {
    const slots = [];
    for (let i = start; i < end; i++) {
      const startHour = `${String(i).padStart(2, '0')}:00`;
      const endHour = `${String(i + 1).padStart(2, '0')}:00`;
      slots.push({ time: `${startHour}-${endHour}`, status: 'available' });
    }
    return slots;
  };

  // Disable past time slots for today
  const disablePastTodaySlots = useCallback((dates: any[]) => {
    const now = new Date();
    const currentHour = now.getHours();
    const todayDate = now.getDate();

    return dates.map((day) => {
      if (Number(day.date.split(' ')[1]) !== todayDate) return day;

      return {
        ...day,
        timeSlots: day.timeSlots.map((slot: any) => {
          const hour = parseInt(slot.time.split(':')[0]);
          return hour <= currentHour ? { ...slot, status: 'taken' } : slot;
        }),
      };
    });
  }, []);

  // Get available slots for selected date
  const availableTimeOptions = useMemo(() => {
    if (!selectedDate) return [];

    const matched = calendarDates.find(
      (d) =>
        d.year === selectedDate.getFullYear() &&
        d.month === selectedDate.getMonth() &&
        Number(d.date.split(' ')[1]) === selectedDate.getDate()
    );

    if (!matched) return [];

    return matched.timeSlots
      .filter((slot: any) => slot.status === 'available')
      .map((slot: any) => {
        const formatted = convertTo12Hour(slot.time);
        return { value: formatted, label: formatted };
      });
  }, [selectedDate, calendarDates]);

  // Reset Time ONLY On Manual Date Change
  useEffect(() => {
    if (!selectedDate) return;

    if (manualDateChange.current) {
      setSelectedTime('');
      manualDateChange.current = false; // reset the flag
    }
  }, [selectedDate]);

  // Handle Manual Date Change
  const handleDateChange = (date: Date) => {
    manualDateChange.current = true; // mark as manual
    setSelectedDate(date);
  };

  // Select Slot From Calendar Grid
  const handleSelectSlotFromCalendarGrid = (dateIndex: number, slotIndex: number) => {
    const date = calendarDates[dateIndex];
    const selectedTimeSlot = date.timeSlots[slotIndex].time;

    if (date.timeSlots[slotIndex].status !== 'available') {
      return;
    }

    const dateString = `${date.year}-${String(date.month + 1).padStart(2, '0')}-${date.date
      .split(' ')[1]
      .padStart(2, '0')}`;
    const convertedTime = convertTo12Hour(selectedTimeSlot);

    manualDateChange.current = false;
    setSelectedDate(convertDateToLocalString(dateString));
    setSelectedTime(convertedTime);
  };

  const isBookingSlot = (day: any, slot: any) => {
    if (!selectedDate || !selectedTime) return false;

    const dateString = `${day.year}-${String(day.month + 1).padStart(2, '0')}-${day.date
      .split(' ')[1]
      .padStart(2, '0')}`;

    const convertedDate = convertDateToLocalString(dateString);

    return (
      convertedDate.toDateString() === selectedDate.toDateString() &&
      convertTo12Hour(slot.time) === selectedTime
    );
  };

  const handleSubmitBookingAmenity = () => {
    getStatusForBookingAvailability(null, {
      onSuccess: (res) => {
        if (res.Code === 200) {
          setStep(2);
        } else {
          openModal('booking-error-modal');
        }
      },
      onError: () => openModal('error-modal'),
    });
  };

  const handleCreateBooking = () => {
    const reqData = {
      RefCode: 'Portal',
      ResourceId: selectedLocation,
      StartDate:
        formatToYYYYMMDD(selectedDate as Date) +
        ' ' +
        formatTo24Hour(selectedTime.split('-')[0])?.slice(0, 5),
    };
    createBooking(reqData, {
      onSuccess: (res) => {
        if (res?.Data !== null) {
          setBookingData(res.Data);
          openModal('booking-success-modal');
          setStep(3);
        } else {
          openModal('error-modal');
        }
      },
      onError: () => openModal('error-modal'),
    });
  };

  // Fetch Amenities
  useEffect(() => {
    if (!tCode) return;

    getAllAmenities(null, {
      onSuccess: (res) => {
        const data: Amenity[] = res?.Amenities || [];
        setAmenities(data);

        if (res?.CommunityCoordinates) {
          const [lat, lng] = res.CommunityCoordinates.split(',');
          setMapCenter({ lat: Number(lat), lng: Number(lng) });
        }
      },
      onError: () => openModal('error-modal'),
    });
  }, [tCode]);

  // Auto-select Location
  useEffect(() => {
    if (locations.length === 1) {
      setSelectedLocation(locations[0].Id);
    } else {
      setSelectedLocation(null);
    }
  }, [locations]);

  // Fetch Timeslots
  useEffect(() => {
    if (!selectedLocation) {
      setMapCenter(DEFAULT_CENTER);
      return;
    }

    const locationObj = locations.find((l) => l.Id === selectedLocation);

    if (locationObj?.Gps_Coords) {
      const [lat, lng] = locationObj.Gps_Coords.split(',');
      setMapCenter({ lat: Number(lat), lng: Number(lng) });
    }

    getTimeslots(
      { resourceId: selectedLocation },
      {
        onSuccess: (res) => {
          if (res.Code !== 404) {
            const booked = res?.BookedTimings || [];
            const start = parseInt(res?.StartTime);
            const end = parseInt(res?.EndTime);

            const baseSlots = generateTimeSlots(start, end);
            setBaseSlotsOfDay(baseSlots);

            const today = new Date();
            const dates = [];

            for (let i = 0; i < 3; i++) {
              const temp = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);

              const daySlots = baseSlots.map((slot) => ({ ...slot }));

              daySlots.forEach((slot) => {
                const month = String(temp.getMonth() + 1).padStart(2, '0');
                const day = String(temp.getDate()).padStart(2, '0');
                const time = slot.time.split('-')[0] + ':00';
                const iso = `${temp.getFullYear()}-${month}-${day}T${time}`;

                if (booked.includes(iso)) slot.status = 'taken';
              });

              dates.push({
                date: `${weekday[temp.getDay()].shortDay} ${temp.getDate()}`,
                month: temp.getMonth(),
                monthName: months[temp.getMonth()],
                year: temp.getFullYear(),
                timeSlots: daySlots,
              });
            }

            setCalendarDates(disablePastTodaySlots(dates));
          }
        },
        onError: () => openModal('error-modal'),
      }
    );
  }, [selectedLocation]);

  const backButtonOptions = (() => {
    if (step === 1) {
      return {
        href: '/community?activeTab=BookAmenities',
        onClick: undefined,
        label: fields.backToAmenityBookingsLabel,
      };
    }
    if (step === 2) {
      return { href: '#', onClick: () => setStep(1), label: fields.backToAmenityBookingsLabel };
    }
    return {
      href: '#',
      onClick: () => window.location.replace('/booking-amenities/create-booking'),
      label: fields.createAnotherBookingLabel,
    };
  })();

  const addCalendarEventDetails = useMemo(() => {
    const selectedLocationData = locations.find((l) => l.Id === selectedLocation);

    const duration = formatEventDate(
      formatToYYYYMMDD(selectedDate as Date) as string,
      selectedTime
    );
    const description = `<b>Booking Details:</b>\n\n<b>Facility:</b> ${selectedLocationData?.Name}\n<b>Location:</b> <a href="${selectedLocationData?.MapUrl}">${selectedLocationData?.MapUrl}</a>\n<b>Duration:</b> ${duration}\n<b>Booking Reference:</b> ${bookingData?.Reservation_Id}`;

    return {
      title: `${selectedAmenity?.Type} at ${selectedLocationData?.Name}`,
      description: description,
    };
  }, [selectedLocation, selectedAmenity, locations, bookingData]);

  return {
    step,
    setStep,
    amenities,
    selectedAmenity,
    setSelectedAmenity,
    selectedLocation,
    setSelectedLocation,
    calendarDates,
    selectedDate,
    setSelectedDate,
    baseSlotsOfDay,
    selectedTime,
    setSelectedTime,
    mapCenter,
    bookingData,
    isBookingCancelled,
    setIsBookingCancelled,
    isLoaded,
    isLoadingAmenities,
    isLoadingTimeslots,
    uniqueAmenityTypes,
    locations,
    availableTimeOptions,
    handleDateChange,
    handleSelectSlotFromCalendarGrid,
    isBookingSlot,
    handleSubmitBookingAmenity,
    handleCreateBooking,
    backButtonOptions,
    addCalendarEventDetails,
    formatEventDate,
  };
};
