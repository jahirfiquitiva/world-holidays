import { Component } from '@/components/global/component';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  Fragment,
  useReducer,
  Dispatch,
} from 'react';

interface HolidaysContextData {
  country?: string;
  countryCode?: string;
  year?: number;
  color?: string;
}

const defaultContextValue: HolidaysContextData = {
  country: 'Colombia',
  countryCode: 'CO',
  year: new Date().getFullYear(),
  color: '#79FFE1',
};

interface HolidaysContextValue {
  data: HolidaysContextData;
  dispatch?: Dispatch<
    ChangeCountryAction | ChangeYearAction | ChangeColorAction
  >;
}

const HolidaysContext = createContext<HolidaysContextValue>({
  data: defaultContextValue,
});

interface ChangeCountryPayload {
  country?: string;
  countryCode?: string;
}
interface ChangeCountryAction {
  type: 'country';
  payload: ChangeCountryPayload;
}

interface ChangeYearPayload {
  year?: number;
}
interface ChangeYearAction {
  type: 'year';
  payload: ChangeYearPayload;
}

interface ChangeColorPayload {
  color?: string;
}
interface ChangeColorAction {
  type: 'color';
  payload: ChangeColorPayload;
}

const reducer = (
  state: HolidaysContextData,
  action: ChangeCountryAction | ChangeYearAction | ChangeColorAction,
) => {
  if (action.payload) return { ...state, ...action.payload };
  return state;
};

export const HolidaysProvider: Component = (props) => {
  const [holidaysData, dispatch] = useReducer(reducer, defaultContextValue);
  const { children } = props;
  return (
    <HolidaysContext.Provider value={{ data: holidaysData, dispatch }}>
      {children}
    </HolidaysContext.Provider>
  );
};

interface UseHolidaysHookValue {
  data: HolidaysContextData;
  updateCountry: (payload: ChangeCountryPayload) => void;
  updateYear: (payload: ChangeYearPayload) => void;
  updateColor: (payload: ChangeColorPayload) => void;
}

export const useHolidays = (): UseHolidaysHookValue => {
  const { data, dispatch } = useContext(HolidaysContext) || {
    data: defaultContextValue,
  };

  const updateCountry = (payload: ChangeCountryPayload) => {
    if (dispatch) dispatch({ type: 'country', payload });
  };

  const updateYear = (payload: ChangeYearPayload) => {
    if (dispatch) dispatch({ type: 'year', payload });
  };

  const updateColor = (payload: ChangeColorPayload) => {
    if (dispatch) dispatch({ type: 'color', payload });
  };

  return {
    data,
    updateCountry,
    updateYear,
    updateColor,
  };
};
