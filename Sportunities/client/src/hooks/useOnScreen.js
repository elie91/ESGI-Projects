import { useEffect, useRef, useState } from "react";

const useOnScreen = (options) => {

  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!isCancelled)
          setVisible(entry.isIntersecting);
      },
      options,
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
      isCancelled = true;
    };

  }, [ref, options]);

  return [ref, visible];
};

export default useOnScreen;
