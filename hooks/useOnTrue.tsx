import { useEffect, useRef } from "react";

export function useOnTrue(value: boolean, callback: () => void) {
  const previousValue = useRef(value);

  useEffect(() => {
    if (value && !previousValue.current) {
      callback();
    }

    previousValue.current = value;
  }, [value, callback]);
}
