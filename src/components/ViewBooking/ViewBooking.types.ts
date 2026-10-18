export interface Reservation {
  reservation_id: string;
  name: string;
  start_time: string;
  end_time: string;
  status: number | string;
  resource_properties?: {
    Type?: string;
    MapUrl?: string;
    GpsCoords?: string;
    Description?: string;
  };
  resource_photos?: { title: string; path: string }[];
}

export interface MonthViewProps {
  reservations: Reservation[];
  fields: any;
  setSelectedDateForDayView: (date: Date) => void;
  getReservationStatus: (
    status: string | number,
    start_time: string
  ) => 'Cancelled' | 'Upcoming' | 'Previous' | '';
  selectedReservation: Reservation | null;
  setSelectedReservation: (reservation: Reservation | null) => void;
  setIsViewingBookingDetails: (status: boolean) => void;
}

export interface CalendarCellData {
  index: number;
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  reservations: Reservation[];
}

export interface ReservationDetailsCardProps {
  reservation: Reservation;
  position: 'left' | 'right';
  onClose: () => void;
  reservationStatus: string;
  isMobileView?: boolean;
  handleViewBookingClick?: () => void;
}

export interface DayViewProps {
  fields: any;
  reservations: Reservation[];
  date?: Date | null; // optional, defaults to today
  getReservationStatus: (
    status: string | number,
    start_time: string
  ) => 'Cancelled' | 'Upcoming' | 'Previous' | '';
  selectedReservation: Reservation | null;
  setSelectedReservation: (reservation: Reservation | null) => void;
  setIsViewingBookingDetails: (status: boolean) => void;
}
