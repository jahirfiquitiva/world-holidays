export interface DefaultHoliday {
  name: string;
  holidayName: string;
  date: string;
  holiday: string;
  altName?: string;
}

export interface HolidayItem {
  index?: number;
  date: string;
  readableDate: string;
  name: string;
  altName?: string;
}

export interface HolidaysData {
  count: number;
  holidays: Array<HolidayItem>;
  nextHoliday?: HolidayItem | null;
  now?: string;
  serverOffset?: number;
}
