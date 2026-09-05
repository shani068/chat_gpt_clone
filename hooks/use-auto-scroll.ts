"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BOTTOM_THRESHOLD = 96;

interface Options {
  /** User preference — when false the list never scrolls on its own. */
  enabled: boolean;
  /** Changes whenever content grows (message count, streamed length). */
  signal: unknown;
  /** True while tokens are arriving; suppresses smooth scrolling. */
  isStreaming: boolean;
}

/**
 * Sticky-bottom scrolling.
 *
 * The list follows new content only while the user is already at the bottom.
 * Scrolling up detaches it — the pill takes over from there — and reaching the
 * bottom again re-attaches. Programmatic scrolls are flagged so they are not
 * mistaken for the user scrolling away.
 */
export function useAutoScroll({ enabled, signal, isStreaming }: Options) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPinned, setIsPinned] = useState(true);
  const [hasNewContent, setHasNewContent] = useState(false);
  const programmatic = useRef(false);
  // Distinguishes "content changed" from "the effect re-ran for another reason".
  const lastSignal = useRef(signal);
  const hasScrolled = useRef(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const node = containerRef.current;
    if (!node) return;

    programmatic.current = true;
    node.scrollTo({ top: node.scrollHeight, behavior });
    setIsPinned(true);
    setHasNewContent(false);

    // Release the flag after the scroll settles.
    window.setTimeout(() => {
      programmatic.current = false;
    }, behavior === "smooth" ? 420 : 60);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const onScroll = () => {
      const distance =
        node.scrollHeight - node.scrollTop - node.clientHeight;
      const isAtBottom = distance <= BOTTOM_THRESHOLD;

      if (programmatic.current && !isAtBottom) return;

      setIsPinned(isAtBottom);
      if (isAtBottom) setHasNewContent(false);
    };

    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Only *new content* drives this effect. Without the guard, merely
    // scrolling up re-runs it and raises the pill when nothing has arrived.
    if (lastSignal.current === signal) return;
    lastSignal.current = signal;

    if (!isPinned) {
      setHasNewContent(true);
      return;
    }

    if (!enabled) return;

    // Instant while streaming — smooth scrolling cannot keep pace with tokens
    // and visibly lags the caret. Also instant on the first paint of a loaded
    // transcript, which should simply open at the latest message.
    const isFirstPaint = !hasScrolled.current;
    hasScrolled.current = true;
    scrollToBottom(isStreaming || isFirstPaint ? "auto" : "smooth");
  }, [signal, isPinned, enabled, isStreaming, scrollToBottom]);

  return {
    containerRef,
    isPinned,
    /** Show the jump pill only when content arrived while detached. */
    showJumpToBottom: !isPinned && hasNewContent,
    scrollToBottom,
  };
}
