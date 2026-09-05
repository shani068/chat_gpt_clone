"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query. Returns false on the server and during the first
 * client render, then settles — so layout never flashes the wrong breakpoint.
 */
export function useMediaQuery(query: string): boolean {
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    setIsMatch(list.matches);

    const onChange = (event: MediaQueryListEvent) => setIsMatch(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return isMatch;
}

/** Breakpoints match the Tailwind scale the layout is designed against. */
export const useIsMobile = () => !useMediaQuery("(min-width: 768px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
