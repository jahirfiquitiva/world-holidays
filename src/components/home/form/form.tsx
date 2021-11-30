import useTranslation from 'next-translate/useTranslation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import countries from 'react-svg-worldmap/dist/countries.geo';

import { useHolidays } from '@/providers/holidays';

import styles from './form.module.css';

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
  const { t } = useTranslation('common');
  const { data, updateCountry, updateYear } = useHolidays();

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
      <div className={styles.formFieldGroup}>
        <label htmlFor={'country'}>Choose a country from the list:</label>
        <input
          id={'country'}
          name={'country'}
          list={'countries'}
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
        <label htmlFor={'year-select'}>
          {t('list:select-year')}:&nbsp;&nbsp;
        </label>
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
      <button>Update</button>
    </form>
  );
};
