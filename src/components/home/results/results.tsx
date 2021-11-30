import confetti from 'canvas-confetti';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { useMemo, useEffect } from 'react';

import { Component, ComponentProps } from '@/components/global/component';
import { useHolidays } from '@/providers/holidays';
import { HolidayItem } from '@/types';
import { localeDate, isDateToday } from '@/utils/get-holidays';

interface ResultsProps extends ComponentProps {
  country: string;
  loading?: boolean;
  holidays?: Array<HolidayItem>;
  nextHoliday?: HolidayItem;
}

const particleOptions = {
  particleCount: 250,
  spread: 150,
  // colors: ['#FCD116', '#003893', '#CE1126'],
  disableForReducedMotion: true,
};

const renderHolidayData = (
  nextHoliday?: HolidayItem,
  readableDate?: string | null,
  isHolidayToday: boolean = false,
) => {
  if (!isHolidayToday) {
    return (
      <>
        <p>
          <Trans i18nKey={'home:not-today'} />
        </p>
        {nextHoliday && (
          <p>
            <Trans
              i18nKey={'home:next-holiday'}
              components={[
                <b key={'holiday-date'} />,
                <b key={'holiday-name'} />,
              ]}
              values={{
                holidayDate: readableDate || '',
                holidayName: nextHoliday.name,
              }}
            />
          </p>
        )}
      </>
    );
  }
  return (
    <>
      <p>
        <Trans i18nKey={'home:yes-it-is'} />
      </p>
      {nextHoliday && (
        <p>
          <Trans
            i18nKey={'home:today-holiday'}
            components={[<b key={'holiday-name'} />]}
            values={{
              holidayName: nextHoliday.name,
            }}
          />
        </p>
      )}
    </>
  );
};

export const Results: Component<ResultsProps> = (props) => {
  const { data } = useHolidays();
  const { loading, holidays, nextHoliday, country } = props;
  const { t, lang } = useTranslation('home');

  const localOffset = useMemo<number>(() => {
    return new Date().getTimezoneOffset();
  }, []);

  const isHolidayToday = useMemo<boolean>(() => {
    if (!nextHoliday) return false;
    return isDateToday(nextHoliday.date, localOffset);
  }, [nextHoliday, localOffset]);

  const showAltName = useMemo<boolean>(() => {
    if (!holidays) return false;
    return holidays.some((holiday) => holiday.altName);
  }, [holidays]);

  useEffect(() => {
    if (isHolidayToday) {
      confetti(particleOptions);
    }
    return () => {
      try {
        confetti.reset();
      } catch (e) {}
    };
  }, [isHolidayToday]);

  if (loading) return <p>{t('common:loading')}...</p>;
  if (!holidays) return <p>{t('no-holidays')}</p>;

  return (
    <section id={'results'}>
      <h5>
        <Trans i18nKey={'home:its-holiday'} values={{ country }} />
      </h5>
      {renderHolidayData(
        nextHoliday,
        localeDate(nextHoliday?.date, localOffset, lang),
        isHolidayToday,
      )}
      <br />
      <h5>{t('holidays-in', { year: data.year || 0 })}</h5>
      <br />
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>{t('date')}</th>
            <th>{t('holiday')}</th>
            {showAltName && <th>{t('alt-name')}</th>}
          </tr>
        </thead>

        <tbody>
          {(holidays || []).map((holiday) => {
            return (
              <tr key={holiday.index}>
                <td>{localeDate(holiday.date, localOffset, lang)}</td>
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
    </section>
  );
};
