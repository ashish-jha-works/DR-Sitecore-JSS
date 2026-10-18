export interface CategoryResponse {
  Id: number;
  CategoryName: string;
  ServiceRequestType: number;
}

export interface SubCategoryResponse {
  CategoryId: number;
  Id: number;
  SubCategoryDesc: string;
  SubCategoryName: string;
  TemplateCode: string;
  isEmergency: boolean;
}

export type CreateRequestProps = {
  phoneNumber: string | undefined;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;

  serviceRequestType: string | null;

  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;

  phoneNumberError: string | null | undefined;
  setPhoneNumberError: React.Dispatch<React.SetStateAction<string | null | undefined>>;

  categories: CategoryResponse[];
  selectedCategory: CategoryResponse | null | undefined;
  setSelectedCategory: React.Dispatch<React.SetStateAction<CategoryResponse | null | undefined>>;

  subCategories: SubCategoryResponse[];
  selectedSubCategory: SubCategoryResponse | null | undefined;
  setSelectedSubCategory: React.Dispatch<
    React.SetStateAction<SubCategoryResponse | null | undefined>
  >;

  issue: string;
  setIssue: React.Dispatch<React.SetStateAction<string>>;

  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  SERVICE_REQUEST_CONFIG: any;
  isLoadingCategories: boolean;
};

// Schedule Visit types
export interface TechnicianSlot {
  Slot: string;
  IsAvailable: boolean;
  PersonId?: string | null;
  SCHEDSTART?: string | null;
  SCHEDFINISH?: string | null;
}
export interface TechnicianDaySchedule {
  Date: string;
  Day: string;
  DayInWords: string;
  IsDayAvailable: boolean;
  TechnicianSlot: TechnicianSlot[];
}

export interface TechnicalScheduleHookProps {
  templateCode: string;
  community: string;
  technicianSchedule: TechnicianDaySchedule[];
  setTechnicianSchedule: (data: TechnicianDaySchedule[]) => void;
  selectedDate?: Date;
  setSlots: (slots: TechnicianSlot[]) => void;
  setSelectedSlot: (slot: TechnicianSlot | null) => void;
  manualMode: boolean;
  setManualMode: (value: boolean) => void;
}

export type SlotsMap = Record<string, TechnicianSlot[]>;

export const normalizeSlotSpacing = (slot: string) => slot.replace(/\s*-\s*/, ' - ').trim();

export const isPastTechnicianSlot = (
  selectedDate: Date,
  slotLabel: string,
  now = new Date()
): boolean => {
  const slotStartStr = normalizeSlotSpacing(slotLabel).split(' - ')[0];
  const isTodaySelected = selectedDate.toDateString() === now.toDateString();
  if (!isTodaySelected) return false;

  const match = slotStartStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return false;

  let hours = parseInt(match[1], 10) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;

  const slotStartTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    parseInt(match[2], 10)
  );

  return now >= slotStartTime;
};

export const isTechnicianSlotSelectable = (slot: TechnicianSlot, selectedDate?: Date): boolean => {
  if (!slot?.IsAvailable || !selectedDate) return false;
  return !isPastTechnicianSlot(selectedDate, slot.Slot);
};

export const areAllSlotsBookedForDate = (slots: TechnicianSlot[], selectedDate?: Date) =>
  slots.length > 0 && slots.every((slot) => !isTechnicianSlotSelectable(slot, selectedDate));
