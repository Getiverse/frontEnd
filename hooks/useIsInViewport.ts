import { useEffect, useMemo, useState } from "react";

function useIsInViewport(ref: any) {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.8, // Adjust this value to change the scroll trigger point
  };
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(
        ([entry]) => setIsIntersecting(entry.isIntersecting),
        observerOptions
      ),
    []
  );

  useEffect(() => {
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isIntersecting;
}
export default useIsInViewport;
