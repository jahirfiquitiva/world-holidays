/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextApiRequest, NextApiResponse } from 'next';

import { NextApiFunc, DefaultHoliday } from '@/types';
import { getColombianHolidays } from '@/utils/get-holidays';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<NextApiFunc> => {
  const { lang, country, year } = req.query;
  const actualLang = Array.isArray(lang) ? lang[0] : lang;
  const actualCountry = Array.isArray(country) ? country[0] : country;
  const actualYear = parseInt(Array.isArray(year) ? year[0] : year);

  const request = await fetch(
    `https://holidays-api-jf.herokuapp.com/holidays?country=${actualCountry}&year=${
      actualYear || new Date().getFullYear()
    }`,
  );
  const response = await request.json();
  const holidays = response.holidays.map((item: DefaultHoliday) => {
    return { ...item, holiday: item.date, holidayName: item.name };
  });

  try {
    return res
      .status(200)
      .json(getColombianHolidays(holidays, actualLang || 'es-CO'));
  } catch (e: unknown) {
    return res.status(500).json({
      // @ts-ignore
      error: e?.message || 'Unexpected error',
    });
  }
};

export default handler;
