import confetti from 'canvas-confetti';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useMemo } from 'react';

import { HolidaysForm } from './form/form';
import { Map } from './map/map';

import { Component } from '@/components/global/component';
import useRequest from '@/hooks/useRequest';
import { useHolidays } from '@/providers/holidays';
import { HolidaysData } from '@/types/holidays';

const particleOptions = {
  particleCount: 250,
  spread: 150,
  colors: ['#FCD116', '#003893', '#CE1126'],
  disableForReducedMotion: true,
};

export const Home: Component = () => {
  const { data: holidayData } = useHolidays();
  const { t, lang } = useTranslation('home');
  const { data, loading } = useRequest<HolidaysData>(
    `/api/holidays?lang=${lang}&country=${holidayData.countryCode}&year=${holidayData.year}`,
  );

  const showAltName = useMemo<boolean>(() => {
    if (!data) return false;
    const { holidays } = data;
    if (!holidays) return false;
    return holidays.every((holiday) => holiday.altName);
  }, [data]);

  useEffect(() => {
    if (data && data.isHolidayToday) {
      confetti(particleOptions);
    }
    return () => {
      try {
        confetti.reset();
      } catch (e) {}
    };
  }, [data]);

  const renderHolidayData = () => {
    if (loading || !data) return <p>{t('common:loading')}...</p>;
    if (!data.isHolidayToday) {
      return (
        <>
          <h4>{t('not-today')}</h4>
          <br />
          {data.nextHoliday && (
            <p>
              <Trans
                i18nKey={'home:next-holiday'}
                components={[
                  <b key={'holiday-date'} />,
                  <b key={'holiday-name'} />,
                ]}
                values={{
                  holidayDate: data.nextHoliday.readableDate,
                  holidayName: t(`holidays:${data.nextHoliday.index}`),
                }}
              />
            </p>
          )}
        </>
      );
    }
    return (
      <>
        <h4>{t('yes-it-is')}</h4>
        <br />
        {data.nextHoliday && (
          <p>
            <Trans
              i18nKey={'home:today-holiday'}
              components={[<b key={'holiday-name'} />]}
              values={{
                holidayName: t(`holidays:${data.nextHoliday.index}`),
              }}
            />
          </p>
        )}
      </>
    );
  };

  /* return (
    <div style={{ textAlign: 'center' }}>
      <Map />
      <h1>{t('its-holiday')}</h1>
      <br />
      {renderHolidayData()}
      <br />
      {/* eslint-disable-next-line @next/next/no-img-element }
      <img
        className={'photo'}
        alt={'random photo from Colombia'}
        src={
          'https://source.unsplash.com/collection/8308296?orientation=landscape'
        }
        decoding={'async'}
        loading={'lazy'}
      />
    </div>
  ); */

  return (
    <>
      <Map />
      <HolidaysForm />
      <br />
      {loading && <p>{t('loading')}...</p>}
      {!loading && data && (
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>{t('list:holiday')}</th>
              <th>{t('list:date')}</th>
              {showAltName && <th>{t('list:alt-name')}</th>}
            </tr>
          </thead>

          <tbody>
            {data?.holidays?.map((holiday) => {
              return (
                <tr key={holiday.index}>
                  <td>{holiday.name}</td>
                  <td>{holiday.readableDate}</td>
                  {showAltName && <td>{holiday.altName || '––'}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <pre>
        <code>{JSON.stringify(holidayData, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </>
  );
};
