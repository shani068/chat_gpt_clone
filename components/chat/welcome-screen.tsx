"use client";

import { motion } from "framer-motion";

import { LogoMark } from "@/components/shared/logo";
import { EASE_PREMIUM } from "@/constants/motion";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

import { PromptSuggestions } from "./prompt-suggestions";

/**
 * The zero-state. Content is centred in the available space above the
 * composer rather than in the viewport, so nothing sits behind the input.
 */
export function WelcomeScreen({
  onSelectPrompt,
}: {
  onSelectPrompt: (prompt: string) => void;
}) {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-10 sm:px-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: EASE_PREMIUM }}
        className="w-full max-w-[34rem]"
      >
        <div className="flex flex-col items-center text-center">
          <span className="border-border bg-card shadow-e1 mb-5 inline-flex size-11 items-center justify-center rounded-xl border">
            <LogoMark size={22} />
          </span>

          <h1 className="text-h1 text-foreground text-balance">How can I help?</h1>

          <p className="text-small text-muted-foreground mt-2.5 max-w-[42ch] text-pretty">
            Ask anything, attach a file, or start from one of the prompts below.
          </p>
        </div>

        <PromptSuggestions onSelect={onSelectPrompt} className="mt-8" />
      </motion.div>
    </div>
  );
}
