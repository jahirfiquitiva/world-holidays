import useTranslation from 'next-translate/useTranslation';
import { useMemo } from 'react';

import { Component, ComponentProps } from '@/components/global/component';
import { HolidayItem } from '@/types';
import { formatDate, serverDateToLocalDate } from '@/utils/get-holidays';

interface ResultsProps extends ComponentProps {
  loading?: boolean;
  holidays?: Array<HolidayItem>;
}

export const Results: Component<ResultsProps> = (props) => {
  const { loading, holidays } = props;
  const { t, lang } = useTranslation('home');

  const showAltName = useMemo<boolean>(() => {
    if (!holidays) return false;
    return holidays.some((holiday) => holiday.altName);
  }, [holidays]);

  const upcomingHolidays = useMemo<Array<HolidayItem>>(() => {
    if (!holidays) return [];
    const now = new Date();
    return holidays.filter(
      (it) =>
        serverDateToLocalDate(
          new Date(`${it.date}T00:00:00Z`),
          new Date().getTimezoneOffset(),
        ).getTime() >= now.getTime(),
    );
  }, [holidays]);

  if (loading) return <p>{t('common:loading')}...</p>;
  if (!holidays) return <p>{t('no-holidays')}</p>;

  return (
    <>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>{t('date')}</th>
            <th>{t('holiday')}</th>
            {showAltName && <th>{t('alt-name')}</th>}
          </tr>
        </thead>

        <tbody>
          {upcomingHolidays.map((holiday) => {
            return (
              <tr key={holiday.index}>
                <td>
                  {formatDate(
                    new Date(`${holiday.date}T00:00:00Z`),
                    new Date().getTimezoneOffset(),
                    lang,
                  )}
                </td>
                <td>{holiday.name}</td>
                {showAltName && <td>{holiday.altName || '––'}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
      <blockquote>
        <small>
          <em>
            <b>{t('disclaimer')}:</b>&nbsp;{t('holidays-weekend')}
          </em>
        </small>
      </blockquote>
    </>
  );
};
