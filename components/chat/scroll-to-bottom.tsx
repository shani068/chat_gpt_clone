"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import { EASE_PREMIUM } from "@/constants/motion";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * Floating pill shown only when new content arrived while the user was reading
 * further up. It never appears merely because the user scrolled.
 */
export function ScrollToBottom({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.96 }}
          transition={{ duration: 0.18, ease: EASE_PREMIUM }}
          className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center"
        >
          <button
            type="button"
            onClick={onClick}
            className="border-border bg-popover text-caption text-foreground shadow-e2 hover:bg-muted focus-visible:outline-ring pointer-events-auto inline-flex items-center gap-1.5 rounded-full border py-1.5 pr-3 pl-2.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <ArrowDown size={13} strokeWidth={2.25} aria-hidden />
            Jump to latest
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
