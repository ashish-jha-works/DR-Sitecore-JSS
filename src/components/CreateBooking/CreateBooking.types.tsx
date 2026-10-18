import { Field } from '@sitecore-jss/sitecore-jss-nextjs';

export interface CreateBookingFields {
  fields: {
    title: Field<string>;
    description: Field<string>;
    facilitySectionTitle: string;
    facilityDescription: string;
    facilityLabel: string;
    dateSelectionWarning: string;
    bookAmenityCTA: string;
    confirmCTALabel: string;
    cancelBookingCTALabel: string;
    addToCalendarLabel: string;
    cancelCTALabel: string;
    createAnotherBookingLabel: string;
    backToAmenityBookingsLabel: Field<string>;

    bookingDetailsSectionTitle: string;
    bookingReferenceLabel: string;
    upcomingLabel: string;
    cancelledLabel: string;
    amenityLabel: string;
    locationLabel: string;
    durationLabel: string;
    reservationCancelInfoText: string;
    cancellationPolicy: string;
    tncText: string;
    shareYourBookingLabel: string;
  };
}

export interface AmenityPhoto {
  Path: string;
  Title: string;
}

export interface Amenity {
  Id: number;
  Name: string;
  Description: string;
  Type: string;
  Community: string;
  MapUrl: string;
  Gps_Coords: string; // format: "latitude,longitude"
  Photos: AmenityPhoto[];
}

export type ShareType = 'email' | 'whatsapp';

export interface Location {
  Name: string;
  MapUrl: string;
}

export interface BookingData {
  Reservation_Id: string;
}

export interface BookingShareProps {
  selectedLocation: Location;
  bookingData: BookingData;
  getDuration: () => string;
}

export interface BookAmenityProps {
  fields: any;
  isLoadingAmenities: boolean;
  uniqueAmenityTypes: Amenity[];
  selectedAmenity: Amenity | null;
  setSelectedAmenity: (amenity: Amenity) => void;

  locations: any[];
  selectedLocation: number | null;
  setSelectedLocation: (id: number | null) => void;

  isLoaded: boolean;
  mapCenter: { lat: number; lng: number };

  selectedDate: Date | null;
  handleDateChange: (date: Date) => void;

  availableTimeOptions: { value: string; label: string }[];
  selectedTime: string;
  setSelectedTime: (time: string) => void;

  calendarDates: any[];
  baseSlotsOfDay: any[];
  isLoadingTimeslots: boolean;

  isBookingSlot: (day: any, slot: any) => boolean;
  handleSelectSlotFromCalendarGrid: (dateIndex: number, slotIndex: number) => void;
  handleSubmitBookingAmenity: () => void;
}

export interface AmenityBookingDetailsProps {
  fields: any;
  step: number;
  bookingData: any;
  isBookingCancelled: boolean;
  selectedAmenity: any;
  selectedLocationData: any;
  selectedDate: Date | null;
  selectedTime: string;
  handleCreateBooking?: () => void;
  addCalendarEventDetails: { title: string; description: string };
  bookingStatus: 'Upcoming' | 'Cancelled' | 'Previous' | '';
  bannerImage: string | undefined;
}
