import { useEffect, useState } from "react";
import { mediaMax } from "../../constants/breakpoints";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => {
      setMatches(media.matches);
    };
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    media.addEventListener("change", listener);
    return () => {
      media.removeEventListener('change', listener)
    }
  }, [matches, query]);

  return matches;
}

export const useIsTablet = () => useMediaQuery(`${mediaMax.tablet}`);
