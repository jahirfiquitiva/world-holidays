import useTranslation from 'next-translate/useTranslation';
import { useCallback, useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import countries from 'react-svg-worldmap/dist/countries.geo';

import styles from './form.module.css';

import { Component } from '@/components/global/component';
import { useHolidays } from '@/providers/holidays';

interface Country {
  country: string;
  countryCode: string;
}

const countriesList: Array<Country> = countries.features
  .map((country) => {
    return { countryCode: country.I, country: country.N };
  })
  .sort((a, b) => a.country.localeCompare(b.country));

const buildYearsList = (upcomingYears: number = 5): Array<number> => {
  const years = [new Date().getFullYear()];
  const [thisYear] = years;
  for (let i = thisYear + 1; i < thisYear + upcomingYears; i++) {
    years.push(i);
  }
  return years;
};

export const HolidaysForm: Component = () => {
  const { t } = useTranslation('home');
  const { data, updateCountry, updateYear, updateColor } = useHolidays();

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

  const [currentCountry, setCurrentCountry] = useState(data.countryCode);
  const yearsList = buildYearsList();
  const [currentYear, setCurrentYear] = useState(`${yearsList[0]}`);
  const [currentColor, setCurrentColor] = useState(data.color);

  const onCountrySelected = useCallback(
    (country: string) => {
      const selectedCountry = countriesList.filter(
        (it) => it.countryCode === country,
      )?.[0];
      if (selectedCountry) updateCountry(selectedCountry);
    },
    [updateCountry],
  );

  const onFormSubmit = () => {
    if (currentCountry) onCountrySelected(currentCountry);
    if (currentYear) updateYear({ year: Number(currentYear) });
    if (currentColor) updateColor({ color: currentColor });
  };

  useEffect(() => {
    if (data.countryCode) {
      setCurrentCountry(data.countryCode);
    }
  }, [data.countryCode]);

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onFormSubmit();
      }}
    >
      <div>
        <div className={styles.formFieldGroup}>
          <label htmlFor={'country-select'}>
            {t('select-country')}:&nbsp;&nbsp;
          </label>
          <select
            id={'country-select'}
            value={currentCountry}
            onChange={(e) => {
              setCurrentCountry(e.target.value);
            }}
          >
            {countriesList.map((country) => {
              return (
                <option key={country.countryCode} value={country.countryCode}>
                  {getLocalizedCountryName(
                    country.countryCode,
                    country.country,
                  )}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles.formFieldGroup}>
          <label htmlFor={'year-select'}>{t('select-year')}:&nbsp;&nbsp;</label>
          <select
            name={'year-select'}
            value={currentYear}
            onChange={(e) => {
              setCurrentYear(e.target.value);
            }}
          >
            {yearsList.map((it) => {
              return (
                <option key={it} value={`${it}`}>
                  {it}
                </option>
              );
            })}
          </select>
        </div>
        <button>{t('update')}</button>
      </div>
      <div className={styles.formFieldGroup}>
        <label htmlFor={'color-picker'}>{t('select-color')}:&nbsp;&nbsp;</label>
        <ChromePicker
          color={currentColor}
          onChange={(color) => {
            setCurrentColor(color.hex);
          }}
          disableAlpha
        />
      </div>
    </form>
  );
};
