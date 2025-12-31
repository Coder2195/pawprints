import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* eslint-disable react-hooks/set-state-in-effect */
/**
 * hook for mounted state. eslint disable despite react recommending it this way
 * @returns mounted state
 */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

export function useClickAway<T extends Element>(
  callback: (e: MouseEvent | TouchEvent) => void
) {
  const ref = useRef<T>(null);
  const refCb = useRef(callback);

  useLayoutEffect(() => {
    refCb.current = callback;
  });

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (element && !element.contains(e.target as Node)) {
        refCb.current(e);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return ref;
}
