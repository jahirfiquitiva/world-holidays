import useTranslation from 'next-translate/useTranslation';
import { useMemo, useCallback } from 'react';
import Image from 'next/image';

import { HolidaysForm } from './form/form';
import { Map } from './map/map';
import { Results } from './results/results';

import { Component } from '@/components/global/component';
import useRequest from '@/hooks/useRequest';
import { useHolidays } from '@/providers/holidays';
import { HolidaysData, PhotoData } from '@/types/holidays';

export const Home: Component = () => {
  const { data: holidayData } = useHolidays();
  const { t, lang } = useTranslation('home');
  const { data, loading } = useRequest<HolidaysData>(
    `/api/holidays?lang=${lang}&country=${holidayData.countryCode}&year=${holidayData.year}`,
    { refreshInterval: 4320000 },
  );
  const { data: photoData, loading: photoLoading } = useRequest<PhotoData>(
    `/api/photo?country=${holidayData.country}`,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      refreshInterval: 4320000,
    },
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

  const renderCountryImage = () => {
    if (loading || photoLoading || !photoData || !photoData.url) return null;
    const photoDescription =
      photoData?.description ||
      t('photo-alt', { country: localizedCountryName || 'Somewhere' });
    return (
      <figure>
        <Image
          src={photoData?.url || ''}
          alt={photoData?.alt_description || photoDescription}
          layout={'responsive'}
          width={photoData?.width || 1080}
          height={photoData?.height || 608}
          placeholder={'blur'}
          blurDataURL={photoData?.blur_hash || ''}
          loading={'lazy'}
          decoding={'async'}
          style={{ backgroundColor: photoData?.color || 'rgba(0,0,0,0)' }}
        />
        <figcaption style={{ textAlign: 'center' }}>
          <small>
            <em>
              {photoDescription}
              {'. '}
              {t('source')}
              {': '}
              <a
                href={photoData?.link}
                target={'_blank'}
                rel={'noopener noreferrer'}
              >
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
