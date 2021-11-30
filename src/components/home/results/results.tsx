import useTranslation from 'next-translate/useTranslation';
import { useMemo } from 'react';

import { Component, ComponentProps } from '@/components/global/component';
import { HolidayItem } from '@/types';

interface ResultsProps extends ComponentProps {
  loading?: boolean;
  holidays?: Array<HolidayItem>;
}

export const Results: Component<ResultsProps> = (props) => {
  const { loading, holidays } = props;
  const { t } = useTranslation('home');

  const showAltName = useMemo<boolean>(() => {
    if (!holidays) return false;
    return holidays.some((holiday) => holiday.altName);
  }, [holidays]);

  if (loading) return <p>{t('loading')}...</p>;
  if (!holidays) return <p>No holidays!</p>;

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
          {(holidays || []).map((holiday) => {
            return (
              <tr key={holiday.index}>
                <td>{holiday.readableDate}</td>
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
            <b>Disclaimer:</b>&nbsp;Certain holidays might not be listed if they
            happen in a weekend day
          </em>
        </small>
      </blockquote>
    </>
  );
};
