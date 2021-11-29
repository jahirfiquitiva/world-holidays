import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useState } from 'react';
import WorldMap, { CountryContext, Data } from 'react-svg-worldmap';
import countries from 'react-svg-worldmap/dist/countries.geo';

const data: Data = countries.features.map((country) => {
  return { country: country.I, value: 0 };
});

export const Map = (): ReactElement => {
  const { t } = useTranslation('countries');
  const [selectedCountry, setSelectedCountry] = useState<CountryContext | null>(
    null,
  );

  const stylingFunction = (context: CountryContext) => {
    const { countryCode } = context;
    return {
      backgroundColor: 'var(--nc-bg-2)',
      fill:
        countryCode === selectedCountry?.countryCode
          ? 'var(--nc-ac-1)'
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

  return (
    <WorldMap
      size={'responsive'}
      data={data}
      backgroundColor={'var(--nc-bg-2)'}
      styleFunction={stylingFunction}
      onClickFunction={setSelectedCountry}
      tooltipTextFunction={getTooltipText}
    />
  );
};
