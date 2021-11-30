import { Component } from '@/components/global/component';
import useStickyState from '@/hooks/useStickyState';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  Fragment,
  useReducer,
  Dispatch,
  SetStateAction,
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
  dispatch?: Dispatch<SetStateAction<Partial<HolidaysContextData>>>;
}

const HolidaysContext = createContext<HolidaysContextValue>({
  data: defaultContextValue,
});

export const HolidaysProvider: Component = (props) => {
  const [data, dispatch] = useStickyState<Partial<HolidaysContextData>>(
    defaultContextValue,
    'holidays',
  );

  const { children } = props;
  return (
    <HolidaysContext.Provider value={{ data, dispatch }}>
      {children}
    </HolidaysContext.Provider>
  );
};

interface UseHolidaysHookValue {
  data: HolidaysContextData;
  update: (payload: Partial<HolidaysContextData>) => void;
}

export const useHolidays = (): UseHolidaysHookValue => {
  const { data, dispatch } = useContext(HolidaysContext) || {
    data: defaultContextValue,
  };

  const update = (payload: Partial<HolidaysContextData>) => {
    if (dispatch) dispatch({ ...data, ...payload });
  };

  return {
    data,
    update,
  };
};
