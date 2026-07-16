import { ReactElement, useEffect, useState } from 'react';
import type { CountryContext, Data } from 'react-svg-worldmap';
import WorldMap from 'react-svg-worldmap';

import countries from '@/data/countries';
import useTranslation from '@/hooks/useTranslation';
import { useHolidays } from '@/providers/holidays';
import { CountryItemData } from '@/types';

const data: Data = countries.objects.countries.geometries.map(
  (country: { properties: CountryItemData }) => {
    return { country: country.properties.I, value: 0 };
  },
);

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
          ? 'var(--nc-ac-1)' // holidaysData?.color || 
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
