/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { Component } from '@/components/global/component';
import useTranslation from '@/hooks/useTranslation';
import useRequest from '@/hooks/useRequest';
import { PhotoData } from '@/types';
import Image from 'next/image';

export const NotFound: Component = () => {
  const { t } = useTranslation('not-found');

  const { data: photoData, loading: photoLoading } = useRequest<PhotoData>(
    `/api/photo?country=Colombia`,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      refreshInterval: 4320000,
    },
  );

  const renderCountryImage = () => {
    if (photoLoading || !photoData || !photoData.url) return null;
    const photoDescription =
      photoData?.description ||
      t('photo-alt', { country: 'Colombia' });
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
        <figcaption style={{ textAlign: 'center', marginTop: '0.8rem' }}>
          <small>
            <em>
              {photoDescription}
              <br />
              {t('source')}{' '}
              <a
                href={photoData?.author?.link || 'https://unsplash.com/'}
                target={'_blank'}
                rel={'noopener noreferrer'}
              >
                {photoData?.author?.name || 'Unknown'}
              </a>
              {' on '}
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
      <h1>{t('not-found')}</h1>
      <p>{t('not-found-content')}</p>
      <br />
      <Link href={'/'}>
        <button role={'presentation'}>{t('not-found-button')}</button>
      </Link>
      <br />
      {renderCountryImage()}
    </>
  );
};
