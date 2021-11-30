import useTranslation from 'next-translate/useTranslation';
import { useCallback, useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import countries from 'react-svg-worldmap/dist/countries.geo';

import styles from './form.module.css';

import { useHolidays } from '@/providers/holidays';

interface Country {
  country: string;
  countryCode: string;
}

const countriesList: Array<Country> = countries.features.map((country) => {
  return { countryCode: country.I, country: country.N };
});

const buildYearsList = (upcomingYears: number = 5): Array<number> => {
  const years = [new Date().getFullYear()];
  const [thisYear] = years;
  for (let i = thisYear + 1; i < thisYear + upcomingYears; i++) {
    years.push(i);
  }
  return years;
};

export const HolidaysForm = () => {
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

  const [inputValue, setInputValue] = useState(
    getLocalizedCountryName(data.countryCode, data.country),
  );
  const yearsList = buildYearsList();
  const [currentYear, setCurrentYear] = useState(`${yearsList[0]}`);
  const [currentColor, setCurrentColor] = useState(data.color);

  const onCountrySelected = useCallback(
    (country: string) => {
      const selectedCountry = countriesList.filter(
        (it) => it.country === country,
      )?.[0];
      if (selectedCountry) updateCountry(selectedCountry);
    },
    [updateCountry],
  );

  const onFormSubmit = () => {
    if (inputValue) onCountrySelected(inputValue);
    if (currentYear) updateYear({ year: Number(currentYear) });
    if (currentColor) updateColor({ color: currentColor });
  };

  useEffect(() => {
    if (data.country && data.countryCode) {
      setInputValue(getLocalizedCountryName(data.countryCode, data.country));
    }
  }, [data.country, data.countryCode, getLocalizedCountryName]);

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
          <label htmlFor={'country'}>{t('select-country')}:&nbsp;&nbsp;</label>
          <input
            id={'country'}
            name={'country'}
            list={'countries'}
            type={'text'}
            autoComplete={'off'}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />

          <datalist id={'countries'}>
            {countriesList.map((country) => {
              return (
                <option
                  key={country.countryCode}
                  value={getLocalizedCountryName(
                    country.countryCode,
                    country.country,
                  )}
                >
                  {country.countryCode}
                </option>
              );
            })}
          </datalist>
        </div>
        <div className={styles.formFieldGroup}>
          <label htmlFor={'year-select'}>{t('select-year')}:&nbsp;&nbsp;</label>
          <select
            defaultValue={'2021'}
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
        <br />
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
