import useTranslation from 'next-translate/useTranslation';
import { useMemo, useCallback } from 'react';

import { HolidaysForm } from './form/form';
import { Map } from './map/map';
import { Results } from './results/results';

import { Component } from '@/components/global/component';
import useRequest from '@/hooks/useRequest';
import { useHolidays } from '@/providers/holidays';
import { HolidaysData } from '@/types/holidays';

export const Home: Component = () => {
  const { data: holidayData } = useHolidays();
  const { t, lang } = useTranslation('home');
  const { data, loading } = useRequest<HolidaysData>(
    `/api/holidays?lang=${lang}&country=${holidayData.countryCode}&year=${holidayData.year}`,
  );

  const getLocalizedCountryName = useCallback(
    (countryCode?: string, countryName?: string) => {
      const localizedCountryName = t(
        `countries:${countryCode?.toLowerCase()}`,
        {},
        { default: countryName },
      );
      return localizedCountryName;
    },
    [t],
  );

  const localizedCountryName = useMemo<string>(() => {
    return getLocalizedCountryName(
      holidayData.countryCode,
      holidayData.country,
    );
  }, [getLocalizedCountryName, holidayData]);

  const imageUrl = useMemo<string>(() => {
    return `https://source.unsplash.com/daily?${localizedCountryName},nature,architecture&orientation=landscape`;
  }, [localizedCountryName]);

  const renderCountryImage = () => {
    if (loading) return null;
    return (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={'photo'}
          alt={t('photo-alt', { country: localizedCountryName || 'Somewhere' })}
          src={imageUrl}
          decoding={'async'}
          loading={'lazy'}
        />
        <figcaption style={{ textAlign: 'center' }}>
          <small>
            <em>
              {t('photo-alt', { country: localizedCountryName || 'Somewhere' })}
              {'. '}
              {t('source')}
              {': '}
              <a href={imageUrl} target={'_blank'} rel={'noopener noreferrer'}>
                Unsplash
              </a>
            </em>
          </small>
        </figcaption>
      </figure>
    );
  };

  return (
    <>
      <Map />
      <div style={{ maxWidth: 768, margin: '0 auto' }}>
        <HolidaysForm />
        <br />
        <Results
          loading={loading}
          holidays={data?.holidays}
          nextHoliday={data?.nextHoliday}
          country={localizedCountryName}
        />
        {renderCountryImage()}
      </div>
    </>
  );
};
