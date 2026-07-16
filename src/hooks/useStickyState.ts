import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const useStickyState = <T>(
  defaultValue: T,
  key: string,
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  // Read the persisted value after mount so the initial render matches the
  // server output and avoids a hydration mismatch.
  useEffect(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      if (stickyValue !== null) setValue(JSON.parse(stickyValue));
    } catch (e) {
      /* ignore unavailable/corrupt storage */
    }
    setHydrated(true);
  }, [key]);

  // Only persist once we've read the stored value, otherwise the default would
  // overwrite the persisted value before it is loaded.
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, hydrated]);

  return [value, setValue];
};

export default useStickyState;
