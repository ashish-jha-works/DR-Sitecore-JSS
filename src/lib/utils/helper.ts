interface ValidationResult {
  isValid: boolean;
  message?: string;
}

type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonArray | JsonObject;

/* EMAIL VALIDATION */
export const validateEmail = (value: string, onlyEmail = false): ValidationResult => {
  const trimmed = value.trim();

  // Phone number validation
  if (!onlyEmail && /^\d(\s?\d)*$/.test(trimmed)) {
    const phoneRegex = /^05\d \d{7}$/;
    return phoneRegex.test(trimmed)
      ? { isValid: true }
      : {
          isValid: false,
          message:
            'Invalid Mobile Number<br>Please use the mobile number registered with Dubai Residential in the correct format (05X XXXXXXX).',
        };
  }

  // Email validation
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message:
      'Invalid Email<br>Please use the email registered with Dubai Residential in the correct format (username@mail.com).',
  };
};

/* PASSWORD VALIDATION */
export const validatePassword = (value: string): ValidationResult => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?])/;

  if (!value) {
    return { isValid: false };
  }

  if (!regex.test(value)) {
    return {
      isValid: false,
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character from @$!%*?',
    };
  }

  if (value.length < 8) {
    return {
      isValid: false,
      message: 'Password should be minimum of 8 characters',
    };
  }

  return { isValid: true };
};

export const validateChangePasswordNewPassword = (value: string): ValidationResult => {
  if (!value) {
    return { isValid: false };
  }

  const uppercase = /[A-Z]/;
  const lowercase = /[a-z]/;
  const number = /[0-9]/;
  const allowedOnly = /^[a-zA-Z0-9!@$%*?]+$/;
  const tooShort = value.length < 8;

  const rulesOk =
    uppercase.test(value) &&
    lowercase.test(value) &&
    number.test(value) &&
    /[!@$%*?]/.test(value) &&
    allowedOnly.test(value);

  if (!rulesOk) {
    return {
      isValid: false,
      message:
        'Password must contain at least 8 characters with one uppercase letter, one lowercase letter, one number and one special character from @$!%*?',
    };
  }

  if (tooShort) {
    return {
      isValid: false,
      message: 'Password should be minimum of 8 characters',
    };
  }

  return { isValid: true };
};

/* EMAIL INPUT FORMAT & MASKING */
export const formatEmailInput = (value: string) => {
  const inputValue = value.replace(/ /g, '');

  if (!inputValue) {
    return '';
  }

  // Check if the value is numeric (i.e., it may be a phone number)
  if (/^\d+$/.test(inputValue)) {
    // Starts with "05" → apply phone formatting
    if (inputValue.startsWith('05')) {
      const trimmed = inputValue.substring(0, 10);

      if (trimmed.length > 2 && trimmed.length <= 3) {
        return trimmed; // Keep as-is (05X)
      }

      if (trimmed.length > 3) {
        return trimmed.substring(0, 3) + ' ' + trimmed.substring(3); // 05X XXX...
      }

      return trimmed;
    }

    // Numeric but does not start with "05" → limit to 11 digits
    return inputValue.substring(0, 11);
  }
  // Non-numeric (email)
  return inputValue;
};

export const formatPhoneInput = (value: string): string => {
  let digits = value.replace(/\D/g, '');

  // Ensure prefix 05
  if (!digits.startsWith('05')) {
    digits = `05${digits.replace(/^0+/, '')}`;
  }
  digits = digits.slice(0, 10);
  return digits.length > 3 ? `${digits.slice(0, 3)} ${digits.slice(3)}` : digits;
};

export const formatLandlineInput = (value: string): string => {
  let digits = value.replace(/\D/g, '');
  if (!digits.startsWith('0')) {
    digits = `0${digits}`;
  }
  digits = digits.slice(0, 9);
  return digits.length > 2 ? `${digits.slice(0, 2)} ${digits.slice(2)}` : digits;
};

const UAE_MOBILE_REGEX = /^05\d \d{7}$/;
const UAE_LANDLINE_REGEX = /^0\d \d{7}$/;

export const validateUAEPhone = (value: string, allowEmpty = false): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '-') {
    return allowEmpty
      ? { isValid: true }
      : { isValid: false, message: 'Mobile number format is 05X XXXXXXX' };
  }
  return UAE_MOBILE_REGEX.test(trimmed)
    ? { isValid: true }
    : { isValid: false, message: 'Mobile number format is 05X XXXXXXX' };
};

export const validateUAELandline = (value: string, allowEmpty = true): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '-') {
    return allowEmpty
      ? { isValid: true }
      : { isValid: false, message: 'Landline number format is 0X XXXXXXX' };
  }
  return UAE_LANDLINE_REGEX.test(trimmed)
    ? { isValid: true }
    : { isValid: false, message: 'Landline number format is 0X XXXXXXX' };
};

export const validatePoBox = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, message: "PO Box can't be empty" };
  }
  return /^[0-9]+(\s)*$/.test(trimmed)
    ? { isValid: true }
    : { isValid: false, message: 'Invalid Format' };
};

export const validateOccupantFullName = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, message: "Field can't be empty" };
  }
  const regex = /^[a-zA-Z]+(\s?\.?'?\(?\)?[a-zA-Z]?)+$/;
  return regex.test(trimmed) ? { isValid: true } : { isValid: false, message: 'Invalid Format' };
};

export const validatePetName = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, message: "Fields can't be empty" };
  }
  const regex = /^[a-zA-Z0-9]+(\s?\.?[a-zA-Z0-9]?)+$/;
  return regex.test(trimmed) ? { isValid: true } : { isValid: false, message: 'Invalid Format' };
};

export const validatePetType = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, message: "Fields can't be empty" };
  }
  const regex = /^[a-zA-Z]+(\s?[a-zA-Z]?)+$/;
  return regex.test(trimmed) ? { isValid: true } : { isValid: false, message: 'Invalid Format' };
};

export const validatePetBreed = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: true };
  }
  const regex = /^[a-zA-Z]+(\s?[a-zA-Z]?)+$/;
  return regex.test(trimmed) ? { isValid: true } : { isValid: false, message: 'Invalid Format' };
};

export const validateCompanyNameOrAddress = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '-') {
    return { isValid: true };
  }
  const regex = /^[ A-Za-z0-9_!"#%'()*+./:;=?@\\[\]^_`{|}~\-"]*$/;
  return regex.test(trimmed) ? { isValid: true } : { isValid: false, message: 'Invalid format' };
};

export const formatAmount = (amount: number | string) => {
  const num = Number(amount);

  if (isNaN(num)) {
    return amount;
  }

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getLastDayOfMonthDate = (expiryDate: string) => {
  const date = new Date(expiryDate);
  const year = date.getFullYear();
  const month = date.getMonth();

  return new Date(year, month + 1, 0);
};

export const isExpired = (expiryDate: string) => {
  const expiry = getLastDayOfMonthDate(expiryDate);
  const now = new Date();

  return expiry < now;
};

export const getCardExpiry = (date: string) => {
  if (date === null || date === undefined || date === '') {
    return 'XX/XXXX';
  }
  const [year, month] = date.split('-');
  return `${month}/${year}`;
};

export const formatDateTime = (dateString: string) => {
  const [year, month, day] = dateString.split('T')[0].split('-');

  return `${month}/${day}/${year}`;
};

export const formatDate = (dateString: string) => {
  const [year, month, day] = dateString?.split('T')?.[0]?.split('-');

  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatLeaseDate = (dateString: string) => {
  const [day, month, year] = dateString?.split('T')[0].split('/');

  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatNumber = (amount: any) => {
  const num = Number(amount);

  if (isNaN(num)) {
    return amount;
  }

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const normalizeCategory = (name: string) =>
  name
    .replace(/\u00A0/g, ' ') // fix non-breaking spaces
    .trim()
    .toLowerCase()
    .replace(/(?:^\w|\s+\w)/g, (match) => match.replace(/\s/g, '').toUpperCase())
    .replace(/^\w/, (c) => c.toLowerCase());

export const formatTo24Hour = (time: string) => {
  const [timePart, modifier] = time.split(' ');
  const [hours, minutes] = timePart.split(':');

  let hrs = parseInt(hours, 10);

  if (modifier === 'PM' && hrs !== 12) hrs += 12;
  if (modifier === 'AM' && hrs === 12) hrs = 0;

  return `${String(hrs).padStart(2, '0')}:${minutes}:00`;
};

export const convertTo12Hour = (timeRange: string) => {
  const formatTime = (time: string) => {
    // eslint-disable-next-line prefer-const
    let [hour, minute] = time.split(':').map(Number);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;
  };

  const [start, end] = timeRange.split('-');
  return `${formatTime(start)} - ${formatTime(end)}`;
};

export const convertTimeSlotToSchedule = (dateValue: string | Date, timeRange: string) => {
  if (!dateValue || !timeRange) return null;

  let date: string;

  // ✅ If already YYYY-MM-DD string → use directly
  if (typeof dateValue === 'string') {
    date = dateValue.split('T')[0];
  } else {
    // ✅ Extract LOCAL date parts (no UTC conversion)
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    date = `${year}-${month}-${day}`;
  }

  const [startTime, endTime] = timeRange.split(' - ');

  const startFormatted = formatTo24Hour(startTime);
  const endFormatted = formatTo24Hour(endTime);

  return {
    ScheduleStart: `${date}T${startFormatted}+00:00`,
    ScheduleFinish: `${date}T${endFormatted}+00:00`,
  };
};

export const getFileMetaData = (file: any) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file provided');
      return;
    }

    const reader: any = new FileReader();

    reader.onload = () => {
      const base64 = reader?.result?.split(',')[1]; // remove prefix

      resolve({
        fileName: file.name, // keep as is
        base64: base64, // pure base64
        fileType: file.type,
        fileSize: file.size,
        lastModified: file.lastModified,
      });
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const formatToMMDDYYYY = (dateValue: any) => {
  const date = new Date(dateValue);

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

export function formatToYYYYMMDD(dateInput: Date | undefined) {
  if (!dateInput) return null;

  const date = new Date(dateInput);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function normalizePhone(input: string | number): string {
  if (!input) return '';

  // Convert to string (handles numbers like 971568899099.0)
  let phone = String(input);

  // Remove decimal part if exists (e.g. .0)
  phone = phone.replace(/\.0+$/, '');

  // Remove everything except digits
  phone = phone.replace(/\D/g, '');

  // Remove leading 00 if present
  if (phone.startsWith('00')) {
    phone = phone.slice(2);
  }

  // Remove leading 971 if present
  if (phone.startsWith('971')) {
    phone = phone.slice(3);
  }

  // UAE mobile without leading 0 after country code strip (e.g. 568899099)
  if (phone.length === 9 && phone.startsWith('5')) {
    phone = `0${phone}`;
  }

  return formatPhoneInput(phone);
}

// Get next 3 days from today in YYYY-MM-DD format
export const getNextThreeDays = () => {
  const today = new Date();

  const dates = new Set(
    Array.from({ length: 3 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    })
  );

  return dates;
};

// Convert YYYY-MM-DD to local timezone
export const convertDateToLocalString = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);

  // Creates date at 00:00:00 in the system's local timezone
  return new Date(year, month - 1, day);
};

// Converts
// 2025-10-17, 15:00 - 16:00
// 2025-10-17, 04:00 PM - 05:00 PM
// → Friday, 17-10-2025 15:00-16:00 (1 hour)

export function formatEventDate(_date: string, _time: string) {
  if (!_date || !_time) return;
  // _date expected: YYYY-MM-DD
  const [year, month, day] = _date.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  const weekday = date.toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: 'UTC',
  });

  // format date as DD-MM-YYYY
  const formattedDate = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;

  const [startRaw, endRaw] = _time.split(' - ');

  const normalizeTime = (t: string) => {
    t = t.trim();

    // Detect 12 hour format
    const is12h = /AM|PM/i.test(t);

    let hours: number;
    let minutes: number;

    if (is12h) {
      const [time, modifier] = t.split(' ');
      // eslint-disable-next-line prefer-const
      let [h, m] = time.split(':').map(Number);

      if (modifier.toUpperCase() === 'PM' && h !== 12) h += 12;
      if (modifier.toUpperCase() === 'AM' && h === 12) h = 0;

      hours = h;
      minutes = m;
    } else {
      const [h, m] = t.split(':').map(Number);
      hours = h;
      minutes = m;
    }

    return {
      hours,
      minutes,
      totalMinutes: hours * 60 + minutes,
      formatted: `${String(hours).padStart(2, '0')}.${String(minutes).padStart(2, '0')}`,
    };
  };

  const start = normalizeTime(startRaw);
  const end = normalizeTime(endRaw);

  const durationMinutes = end.totalMinutes - start.totalMinutes;
  const durationHours = durationMinutes / 60;

  const duration = durationHours === 1 ? '(1 hour)' : `(${durationHours} hours)`;

  return `${weekday} ${formattedDate}, ${start.formatted} - ${end.formatted} ${duration}`;
}

/**
 * Returns a set of dates (YYYY-MM-DD) between startDate and endDate (inclusive).
 * Optionally excludes Saturdays and Sundays if excludeWeekends is true.
 */
export function getDateRangeSet(
  startDate: string,
  endDate: string,
  excludeWeekends: boolean = false
): Set<string> {
  // Parse dates, ignoring time and timezone
  const start = new Date(startDate);
  const end = new Date(endDate);

  end.setDate(end.getDate() + 1); // To include last date into the Range Set

  // Ensure start <= end
  if (start > end) {
    throw new Error('startDate must be before or equal to endDate');
  }

  const result = new Set<string>();
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay(); // 0 = Sunday, 6 = Saturday

    if (
      !excludeWeekends ||
      (dayOfWeek !== 0 && dayOfWeek !== 6) // Not Sunday or Saturday
    ) {
      // Format as YYYY-MM-DD
      const formatted = current.toISOString().slice(0, 10);
      result.add(formatted);
    }

    // Move to next day
    current.setDate(current.getDate() + 1);
  }

  return result;
}

export function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
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
}

// Convert Date String 2026-03-12T10:54:00 or 2026-03-12 to 12th March, 2026
export function formatDateToReadable(input: string): string {
  const date = new Date(input);
  if (isNaN(date.getTime())) return '';
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const monthShort = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day}${suffix} ${monthShort}, ${year}`;
}

/** Monday 31st August, 2026 */
export function formatOfferValidUntil(input?: string): string {
  if (!input) return '';

  const raw = String(input).split('|')[0].trim();
  const isoDate = raw.split('T')[0];
  const ymd = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  let date: Date;
  if (ymd) {
    date = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
  } else {
    date = new Date(raw);
  }

  if (isNaN(date.getTime())) return raw;

  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' });
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  const year = date.getFullYear();

  return `${weekday} ${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
}

export const getItemStartDateTime = (item: any): number => {
  const raw = item?.fields?.StartDate?.value || item?.fields?.StartDate || 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export const sortItemsByStartDateDesc = <T>(items: T[] = []): T[] =>
  [...items].sort((a, b) => getItemStartDateTime(b) - getItemStartDateTime(a));

// Converts Date 15/08/2031 to 15 Aug 2031
export const formatDateToMonthReadable = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('/');

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const monthIndex = parseInt(month, 10) - 1;

  return `${day} ${months[monthIndex]} ${year}`;
};

// Extracts down disconnected mode sitecore data where each sub iterated value is present in the fields object and hoists it up to the parent level, removing the nested "fields" layer
export const flattenSiteCoreFields = (value: JsonValue, isRoot: boolean = true): any => {
  if (Array.isArray(value)) {
    return value.map((item) => flattenSiteCoreFields(item, false));
  }

  if (value !== null && typeof value === 'object') {
    const obj = value as JsonObject;
    const hasFields = 'fields' in obj;

    if (!isRoot && hasFields) {
      const { fields, ...rest } = obj;
      const hoisted = flattenSiteCoreFields(fields, false) as JsonObject;
      const restFlat = flattenSiteCoreFields(rest, false) as JsonObject;
      return { ...restFlat, ...hoisted };
    }

    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, flattenSiteCoreFields(v, false)])
    );
  }

  return value;
};

export const getYearMonthFromString: any = (inputDashSeparatedString: string) => {
  // Expected input is YYYY-MM
  const splitStrings = inputDashSeparatedString.split('-');
  const inputYear = splitStrings[0];
  const inputMonth = splitStrings[1];
  return { inputYear, inputMonth };
};
