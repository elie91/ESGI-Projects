import { useState, useEffect, useCallback } from "react";

const useInfiniteScroll = (callback) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;
    setIsFetching(true);
  }, [isFetching])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);


  useEffect(() => {
    if (!isFetching) return;
    callback(() => {});
  }, [isFetching]);

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
