/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextApiRequest, NextApiResponse } from 'next';

import { NextApiFunc, DefaultHoliday } from '@/types';
import { getHolidaysList } from '@/utils/get-holidays';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<NextApiFunc> => {
  const { lang, country, year } = req.query;
  const actualLang = Array.isArray(lang) ? lang[0] : lang;
  const actualCountry = Array.isArray(country) ? country[0] : country;
  const actualYear = parseInt(Array.isArray(year) ? year[0] : year);

  const request = await fetch(
    `https://api.world-holidays.info/holidays?country=${actualCountry}&year=${
      actualYear || new Date().getFullYear()
    }`,
  );
  const response = await request.json();
  const { status } = request;
  const { holidays } = response;

  if (!holidays) {
    return res.status(status).json(response);
  }

  const holidaysList = holidays.map((item: DefaultHoliday) => {
    if (item.altName?.includes('Discovery of America')) {
      const newItem: DefaultHoliday = {
        ...item,
        name: 'Día de la Raza',
        altName: 'Columbus Day',
      };
      return {
        ...newItem,
        holiday: newItem.date,
        holidayName: newItem.name,
      };
    }
    return { ...item, holiday: item.date, holidayName: item.name };
  });

  try {
    return res
      .status(200)
      .json(getHolidaysList(holidaysList, 0, actualLang || 'es-CO'));
  } catch (e: unknown) {
    return res.status(500).json({
      // @ts-ignore
      error: e?.message || 'Unexpected error',
    });
  }
};

export default handler;
