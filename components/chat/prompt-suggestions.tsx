"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Bug, Code2, Database, Network } from "lucide-react";

import { EASE_PREMIUM } from "@/constants/motion";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/utils/cn";

interface Suggestion {
  icon: typeof Network;
  label: string;
  /** What actually gets sent — longer and more specific than the label. */
  prompt: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    icon: Network,
    label: "Explain distributed systems simply",
    prompt:
      "Explain distributed systems simply — what actually changes once state lives on more than one machine?",
  },
  {
    icon: Code2,
    label: "Review this TypeScript architecture",
    prompt:
      "Review this TypeScript architecture and tell me what you would change first, in priority order.",
  },
  {
    icon: Bug,
    label: "Help me debug this API",
    prompt:
      "Help me debug this API — it returns 500 intermittently and I cannot reproduce it locally.",
  },
  {
    icon: Database,
    label: "Create a PostgreSQL schema",
    prompt:
      "Create a PostgreSQL schema for a chat product, and explain the indexing choices.",
  },
];

export function PromptSuggestions({
  onSelect,
  className,
}: {
  onSelect: (prompt: string) => void;
  className?: string;
}) {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <ul
      className={cn(
        "grid w-full gap-1.5 sm:grid-cols-2",
        className,
      )}
    >
      {SUGGESTIONS.map(({ icon: Icon, label, prompt }, index) => (
        <motion.li
          key={label}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.24,
            delay: shouldReduceMotion ? 0 : 0.04 * index,
            ease: EASE_PREMIUM,
          }}
        >
          <button
            type="button"
            onClick={() => onSelect(prompt)}
            className={cn(
              "group/suggestion flex w-full items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-left",
              "transition-[border-color,background-color,transform] duration-[140ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              "hover:border-foreground/20 hover:bg-muted/60 active:scale-[0.99]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            <Icon
              size={15}
              strokeWidth={1.75}
              aria-hidden
              className="text-muted-foreground group-hover/suggestion:text-accent-strong shrink-0 transition-colors"
            />
            <span className="text-small text-foreground min-w-0 flex-1 truncate">
              {label}
            </span>
            <ArrowUpRight
              size={14}
              strokeWidth={2}
              aria-hidden
              className="text-muted-foreground/0 group-hover/suggestion:text-muted-foreground shrink-0 transition-colors"
            />
          </button>
        </motion.li>
      ))}
    </ul>
  );
}
