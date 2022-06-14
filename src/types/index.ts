export * from './default';
export * from './holidays';

export interface CountryItemData {
  I: string;
  N: string;
}

export interface MappedCountryItem {
  countryCode: string;
  country: string;
}
