/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HolidaysData, HolidayItem, DefaultHoliday } from '@/types/holidays';

const hoursInADay = 24;
const minutesInAnHour = 60;
const secondsInAMinute = 60;
const millisInASecond = 1000;
const millisInADay =
  hoursInADay * minutesInAnHour * secondsInAMinute * millisInASecond;

export const serverDateToLocalDate = (
  serverDate: Date,
  offset: number,
): Date => {
  const localOffsetMillis = 60 * 1000 * offset;
  return new Date(serverDate.getTime() + localOffsetMillis);
};

export const formatDate = (
  date: Date,
  offset: number,
  language: string = 'es-CO',
): string => {
  return serverDateToLocalDate(date, offset).toLocaleString(language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getHolidayNameForLanguage = (
  holiday: DefaultHoliday,
  lang?: string,
): string => {
  const { holidayName } = holiday;
  if (!lang) return holidayName;
  try {
    // @ts-ignore
    if (lang.includes('en')) return holiday.altName || holidayName;
  } catch (e) {}
  return holidayName;
};

const getIfDateIsToday = (timeInMillis?: number): boolean => {
  if (typeof timeInMillis === 'undefined') return false;
  const isInTheFuture = (timeInMillis || -1) < 0;
  if (isInTheFuture) return false;
  const isWithinToday = (timeInMillis || -1) <= millisInADay;
  return isWithinToday && timeInMillis >= 0;
};

export const isDateToday = (date?: Date): boolean => {
  if (!date) return false;
  const now = new Date();
  const timeDifference = now.getTime() - date.getTime();
  return getIfDateIsToday(timeDifference);
};

export const getColombianHolidays = (
  holidaysList: Array<DefaultHoliday>,
  language: string = 'es-CO',
): HolidaysData => {
  const now = new Date();

  holidaysList.sort((a, b) => {
    const holidayDateA = new Date(a.holiday.replace(/\//g, '-'));
    const holidayDateB = new Date(b.holiday.replace(/\//g, '-'));
    return holidayDateA.getTime() - holidayDateB.getTime();
  });

  const mappedHolidays: Array<HolidayItem> = holidaysList.map(
    (holiday, index) => {
      const holidayDate = new Date(holiday.holiday.replace(/\//g, '-'));
      return {
        index,
        readableDate: formatDate(holidayDate, new Date().getTimezoneOffset(), language),
        // @ts-ignore
        date: holiday.holiday,
        name: getHolidayNameForLanguage(holiday, language),
        altName: holiday.altName,
      };
    },
  );

  return {
    count: mappedHolidays.length,
    holidays: mappedHolidays,
    now: now.toISOString(),
    serverOffset: new Date().getTimezoneOffset(),
  };
};
