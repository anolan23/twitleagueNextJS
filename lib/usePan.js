import { useCallback, useRef, useState } from "react";

/**
 * Track the user's intended panning offset by listening to `mousemove` events
 * once the user has started panning.
 */
export default function usePan() {
  const [panState, setPanState] = useState({ x: 0, y: 0 });

  // Track the last observed mouse position on pan.
  const lastPointRef = useRef({ x: 0, y: 0 });

  const pan = useCallback((e) => {
    const lastPoint = lastPointRef.current;
    const point = { x: e.pageX, y: e.pageY };
    lastPointRef.current = point;

    // Find the delta between the last mouse position on `mousemove` and the
    // current mouse position.
    //
    // Then, apply that delta to the current pan offset and set that as the new
    // state.
    setPanState((panState) => {
      const delta = {
        x: lastPoint.x - point.x,
        y: lastPoint.y - point.y,
      };
      const offset = {
        x: panState.x + delta.x,
        y: panState.y + delta.y,
      };

      return offset;
    });
  }, []);

  // Tear down listeners.
  const endPan = useCallback(() => {
    document.removeEventListener("mousemove", pan);
    document.removeEventListener("mouseup", endPan);
  }, [pan]);

  // Set up listeners.
  const startPan = useCallback(
    (e) => {
      document.addEventListener("mousemove", pan);
      document.addEventListener("mouseup", endPan);
      lastPointRef.current = { x: e.pageX, y: e.pageY };
    },
    [pan, endPan]
  );

  return [panState, startPan];
}
