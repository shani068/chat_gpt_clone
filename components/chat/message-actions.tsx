"use client";

import { Check, Copy, Pencil, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";

import { useToast } from "@/components/shared/toast-provider";
import { IconButton } from "@/components/ui/icon-button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import type { MessageFeedback } from "@/types/chat";
import { cn } from "@/utils/cn";

interface MessageActionsProps {
  content: string;
  /** Desktop reveals on hover; touch layouts keep the row visible. */
  alwaysVisible: boolean;
  disabled?: boolean;
  className?: string;
  onEdit?: () => void;
  onRegenerate?: () => void;
  feedback?: MessageFeedback;
  onFeedback?: (value: MessageFeedback) => void;
}

export function MessageActions({
  content,
  alwaysVisible,
  disabled = false,
  className,
  onEdit,
  onRegenerate,
  feedback,
  onFeedback,
}: MessageActionsProps) {
  const { isCopied, copy } = useCopyToClipboard();
  const { toast } = useToast();

  const handleCopy = async () => {
    const didCopy = await copy(content);
    toast(
      didCopy
        ? { title: "Copied to clipboard", variant: "success", duration: 1800 }
        : { title: "Could not copy", description: "Clipboard access was denied.", variant: "error" },
    );
  };

  return (
    <div
      className={cn(
        "flex items-center gap-0.5",
        "transition-opacity duration-[140ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        // Keyboard users get the row when anything inside takes focus, and the
        // group-hover reveal never hides it from touch devices.
        alwaysVisible
          ? "opacity-100"
          : "opacity-0 group-hover/message:opacity-100 focus-within:opacity-100",
        className,
      )}
    >
      <IconButton
        size="sm"
        label={isCopied ? "Copied" : "Copy message"}
        tooltipSide="bottom"
        showTooltip={!alwaysVisible}
        onClick={handleCopy}
        icon={
          isCopied ? (
            <Check size={14} strokeWidth={2.5} className="text-success" aria-hidden />
          ) : (
            <Copy size={14} strokeWidth={2} aria-hidden />
          )
        }
      />

      {onEdit ? (
        <IconButton
          size="sm"
          label="Edit message"
          tooltipSide="bottom"
          showTooltip={!alwaysVisible}
          disabled={disabled}
          onClick={onEdit}
          icon={<Pencil size={14} strokeWidth={2} aria-hidden />}
        />
      ) : null}

      {onRegenerate ? (
        <IconButton
          size="sm"
          label="Regenerate response"
          tooltipSide="bottom"
          showTooltip={!alwaysVisible}
          disabled={disabled}
          onClick={onRegenerate}
          icon={<RefreshCw size={14} strokeWidth={2} aria-hidden />}
        />
      ) : null}

      {onFeedback ? (
        <>
          <span className="bg-border mx-0.5 h-4 w-px" aria-hidden />

          <IconButton
            size="sm"
            label="Good response"
            tooltipSide="bottom"
            showTooltip={!alwaysVisible}
            active={feedback === "up"}
            disabled={disabled}
            onClick={() => onFeedback(feedback === "up" ? null : "up")}
            icon={
              <ThumbsUp
                size={14}
                strokeWidth={2}
                aria-hidden
                className={feedback === "up" ? "text-success fill-current" : undefined}
              />
            }
          />

          <IconButton
            size="sm"
            label="Poor response"
            tooltipSide="bottom"
            showTooltip={!alwaysVisible}
            active={feedback === "down"}
            disabled={disabled}
            onClick={() => onFeedback(feedback === "down" ? null : "down")}
            icon={
              <ThumbsDown
                size={14}
                strokeWidth={2}
                aria-hidden
                className={
                  feedback === "down" ? "text-destructive fill-current" : undefined
                }
              />
            }
          />
        </>
      ) : null}
    </div>
  );
}
