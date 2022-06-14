import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useState, useEffect } from 'react';
import type { CountryContext, Data } from 'react-svg-worldmap';
import WorldMap from 'react-svg-worldmap';
// import countries from 'react-svg-worldmap/dist/countries.geo';

import countries from '@/data/countries';
import { useHolidays } from '@/providers/holidays';
import { CountryItemData } from '@/types';

const data: Data = countries.features.map((country: CountryItemData) => {
  return { country: country.I, value: 0 };
});

export const Map = (): ReactElement | null => {
  const [mounted, setMounted] = useState(false);
  const { data: holidaysData, update: updateHolidaysData } = useHolidays();
  const { countryCode: selectedCountryCode } = holidaysData;
  const { t } = useTranslation('countries');

  const stylingFunction = (context: CountryContext) => {
    const { countryCode } = context;
    return {
      backgroundColor: 'var(--nc-bg-2)',
      fill:
        countryCode === selectedCountryCode
          ? holidaysData?.color || 'var(--nc-ac-1)'
          : 'var(--nc-bg-3)',
      fillOpacity: 1,
      stroke: 'var(--nc-tx-1)',
      strokeWidth: 1,
      strokeOpacity: 0.2,
      cursor: 'pointer',
    };
  };

  const getTooltipText = (context: CountryContext) => {
    const localizedCountryName = t(
      context.countryCode.toLowerCase(),
      {},
      { default: context.countryName },
    );
    return localizedCountryName;
  };

  const onCountryClicked = (context: CountryContext) => {
    updateHolidaysData({
      country: context.countryName,
      countryCode: context.countryCode,
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={'map-container'}>
      <WorldMap
        size={'responsive'}
        data={data}
        backgroundColor={'var(--nc-bg-1)'}
        styleFunction={stylingFunction}
        onClickFunction={onCountryClicked}
        tooltipTextFunction={getTooltipText}
      />
    </div>
  );
};
