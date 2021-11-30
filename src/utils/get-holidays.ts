/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HolidaysData, HolidayItem, DefaultHoliday } from '@/types/holidays';

const hoursInADay = 24;
const minutesInAnHour = 60;
const secondsInAMinute = 60;
const millisInASecond = 1000;
const millisInADay =
  hoursInADay * minutesInAnHour * secondsInAMinute * millisInASecond;

const isValidDate = (date: string): boolean => {
  return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date);
};

const parseDate = (date?: string | null): Date | null => {
  if (!date || !isValidDate(date)) return null;
  return new Date(`${date}T00:00:00Z`);
};

export const getExactDate = (
  date?: string | null,
  localOffset: number = 0,
): Date | null => {
  const dateFromServer = parseDate(date);
  if (!dateFromServer) return null;
  const localOffsetMillis = secondsInAMinute * millisInASecond * localOffset;
  return new Date(dateFromServer.getTime() + localOffsetMillis);
};

export const localeDate = (
  date?: string | null,
  localOffset: number = 0,
  language: string = 'es-CO',
): string | null => {
  const exactDate = getExactDate(date, localOffset);
  if (!exactDate) return null;
  return exactDate.toLocaleString(language, {
    weekday: 'long',
    year: undefined,
    month: 'long',
    day: 'numeric',
  });
};

const getIfDateIsToday = (timeInMillis?: number): boolean => {
  if (typeof timeInMillis === 'undefined') return false;
  const isInTheFuture = (timeInMillis || -1) < 0;
  if (isInTheFuture) return false;
  const isWithinToday = (timeInMillis || -1) <= millisInADay;
  return isWithinToday && timeInMillis >= 0;
};

export const isDateToday = (date: string, localOffset: number = 0): boolean => {
  if (!date) return false;
  const now = new Date();
  const timeDifference =
    now.getTime() - (getExactDate(date, localOffset)?.getTime() || 0);
  return getIfDateIsToday(timeDifference);
};

export const getHolidaysList = (
  holidaysList: Array<DefaultHoliday>,
  localOffset: number = 0,
  language: string = 'es-CO',
): HolidaysData => {
  const now = new Date();

  holidaysList.sort((a, b) => {
    const holidayDateA = getExactDate(a.holiday, localOffset);
    const holidayDateB = getExactDate(b.holiday, localOffset);
    return (holidayDateA?.getTime() || 0) - (holidayDateB?.getTime() || 0);
  });

  const mappedHolidays: Array<HolidayItem> = holidaysList.map(
    (holiday, index) => {
      const holidayDate = getExactDate(holiday.holiday, localOffset);
      const timeDifference = now.getTime() - (holidayDate?.getTime() || 0);
      return {
        index,
        readableDate: localeDate(holiday.holiday, localOffset, language),
        // @ts-ignore
        date: holiday.holiday,
        exactDate: holidayDate,
        name: holiday.name,
        altName: holiday.altName,
        timeDifference,
        itsToday: getIfDateIsToday(timeDifference),
      };
    },
  );

  const [nextHoliday] = mappedHolidays.filter((it) => {
    return (
      typeof it !== 'undefined' && (it.itsToday || (it.timeDifference || 0) < 0)
    );
  });

  return {
    count: mappedHolidays.length,
    holidays: mappedHolidays.map((it) => ({
      ...it,
      timeDifference: undefined,
    })),
    nextHoliday: nextHoliday
      ? { ...nextHoliday, timeDifference: undefined }
      : undefined,
    isHolidayToday: nextHoliday?.itsToday,
    now: now.toISOString(),
    serverOffset: new Date().getTimezoneOffset(),
  };
};
