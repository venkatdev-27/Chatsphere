import { useRef, useCallback } from 'react';

/**
 * Custom hook to detect long press events
 * Useful for mobile interactions where long-press opens context menus
 * 
 * @param {Function} onLongPress - Callback to execute on long press
 * @param {number} delay - Long press duration in milliseconds (default: 500ms)
 * @returns {Object} - Event handlers for touch and mouse events
 */
const useLongPress = (onLongPress, delay = 500) => {
  const timeoutRef = useRef(null);
  const isLongPressRef = useRef(false);

  const start = useCallback(
    (event) => {
      event.preventDefault();
      
      isLongPressRef.current = false;
      
      timeoutRef.current = setTimeout(() => {
        isLongPressRef.current = true;
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

  const handleClick = useCallback((event) => {
    if (isLongPressRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onClick: handleClick,
  };
};

export default useLongPress;
