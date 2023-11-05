import { useRef, useLayoutEffect, useEffect } from "react";

const isBrowser = typeof window !== `undefined`;

function getScrollPosition({
  element,
  useWindow,
}: {
  element: any;
  useWindow: any;
}) {
  if (!isBrowser) return { x: 0, y: 0 };

  const target = element ? element.current : document.body;
  const position = target.getBoundingClientRect();

  return useWindow
    ? { x: window.scrollX, y: window.scrollY }
    : { x: position.left, y: position.top };
}

export function useScrollPosition(
  effect: ({
    prevPos,
    currPos,
  }: {
    prevPos: { x: number; y: number };
    currPos: { x: number; y: number };
  }) => void,
  deps: any,
  element: any,
  useWindow: any,
  wait: any
) {
  /**
   * @ts-ignore */
  const position = useRef(getScrollPosition({ useWindow }));

  let throttleTimeout: any = null;

  const callBack = () => {
    const currPos = getScrollPosition({ element, useWindow });
    effect({ prevPos: position.current, currPos });
    position.current = currPos;
    throttleTimeout = null;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (wait) {
        if (throttleTimeout === null) {
          throttleTimeout = setTimeout(callBack, wait);
        }
      } else {
        callBack();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, deps);
}
