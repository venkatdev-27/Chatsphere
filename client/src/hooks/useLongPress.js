import { useRef, useCallback } from 'react';

const useLongPress = (onLongPress, delay = 500) => {
  const timeoutRef = useRef(null);
  const triggeredRef = useRef(false);

  const start = useCallback(
    (event) => {
      triggeredRef.current = false;

      timeoutRef.current = setTimeout(() => {
        triggeredRef.current = true;
        onLongPress(event);
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
  };
};

export default useLongPress;
