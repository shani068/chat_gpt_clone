"use client";

import { motion } from "framer-motion";

import { InlineErrorState } from "@/components/shared/error-state";
import { LogoMark } from "@/components/shared/logo";
import { EASE_PREMIUM } from "@/constants/motion";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import type { Message, MessageFeedback } from "@/types/chat";
import { cn } from "@/utils/cn";

import { MarkdownRenderer } from "./markdown-renderer";
import { MessageActions } from "./message-actions";
import { StreamingMessage } from "./streaming-message";

interface AssistantMessageProps {
  message: Message;
  showActions: boolean;
  touchLayout: boolean;
  /** True while any generation is running — actions must not stack. */
  busy: boolean;
  onRegenerate: () => void;
  onRetry: () => void;
  onFeedback: (value: MessageFeedback) => void;
}

export function AssistantMessage({
  message,
  showActions,
  touchLayout,
  busy,
  onRegenerate,
  onRetry,
  onFeedback,
}: AssistantMessageProps) {
  const shouldReduceMotion = usePrefersReducedMotion();
  const isStreaming = message.status === "streaming";
  const hasError = message.status === "error";

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: EASE_PREMIUM }}
      aria-label="Assistant response"
      className="group/message flex gap-3 sm:gap-3.5"
    >
      <span
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground",
          isStreaming && "border-accent/40",
        )}
        aria-hidden
      >
        <LogoMark size={15} showDot={false} />
      </span>

      <div className="min-w-0 flex-1">
        {isStreaming ? (
          <StreamingMessage content={message.content} />
        ) : message.content ? (
          <MarkdownRenderer content={message.content} />
        ) : null}

        {hasError ? (
          <div className={cn(message.content && "mt-3")}>
            <InlineErrorState
              message={message.error ?? "The response could not be completed."}
              onRetry={onRetry}
            />
          </div>
        ) : null}

        {!isStreaming && !hasError && showActions ? (
          <div className="mt-2.5">
            <MessageActions
              content={message.content}
              alwaysVisible={touchLayout}
              disabled={busy}
              onRegenerate={onRegenerate}
              feedback={message.feedback ?? null}
              onFeedback={onFeedback}
            />
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}
