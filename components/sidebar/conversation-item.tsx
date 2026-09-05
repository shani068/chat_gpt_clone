"use client";

import Link from "next/link";

import { useEffect, useRef, useState } from "react";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime } from "@/lib/chat/chat-utils";
import type { ConversationSummary } from "@/types/chat";
import { cn } from "@/utils/cn";

interface ConversationItemProps {
  conversation: ConversationSummary;
  isActive: boolean;
  /** Touch layouts keep the row menu visible instead of revealing on hover. */
  alwaysShowActions: boolean;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onNavigate?: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  alwaysShowActions,
  onRename,
  onDelete,
  onNavigate,
}: ConversationItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [draft, setDraft] = useState(conversation.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRenaming]);

  const commitRename = () => {
    const trimmed = draft.trim();
    setIsRenaming(false);
    if (trimmed && trimmed !== conversation.title) onRename(conversation.id, trimmed);
    else setDraft(conversation.title);
  };

  if (isRenaming) {
    return (
      <div className="px-1">
        <label htmlFor={`rename-${conversation.id}`} className="sr-only">
          Rename conversation
        </label>
        <input
          id={`rename-${conversation.id}`}
          ref={inputRef}
          value={draft}
          maxLength={80}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitRename}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitRename();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              setDraft(conversation.title);
              setIsRenaming(false);
            }
          }}
          className="border-ring/60 bg-card text-small text-foreground ring-ring/20 h-8 w-full rounded-md border px-2 ring-[3px] outline-none"
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "group/row relative flex items-center rounded-md px-1",
          "transition-colors duration-[120ms]",
        )}
      >
        {isActive ? (
          <span
            aria-hidden
            className="bg-accent absolute top-1/2 left-0 h-4 w-[2px] -translate-y-1/2 rounded-full"
          />
        ) : null}

        <Link
          href={`/chat/${conversation.id}`}
          onClick={onNavigate}
          aria-current={isActive ? "page" : undefined}
          title={conversation.title}
          className={cn(
            "flex h-8 min-w-0 flex-1 items-center rounded-md pl-2 pr-1 text-small",
            "transition-colors duration-[120ms]",
            isActive
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
          )}
        >
          <span className="truncate">{conversation.title}</span>
        </Link>

        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Actions for ${conversation.title}`}
              className={cn(
                "inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground",
                "transition-[opacity,background-color,color] duration-[120ms]",
                "hover:bg-border/70 hover:text-foreground",
                "focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
                alwaysShowActions || isMenuOpen
                  ? "opacity-100"
                  : "opacity-0 group-hover/row:opacity-100",
              )}
            >
              <MoreHorizontal size={14} strokeWidth={2} aria-hidden />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="min-w-[11rem]">
            <div className="px-2 pt-1 pb-1.5">
              <p className="text-caption text-foreground truncate font-medium">
                {conversation.title}
              </p>
              <p className="text-muted-foreground text-[0.6875rem]">
                {conversation.messageCount} messages ·{" "}
                {formatRelativeTime(conversation.updatedAt)}
              </p>
            </div>

            <DropdownMenuItem
              onSelect={() => {
                setDraft(conversation.title);
                // Defer so the menu can close before focus moves to the input.
                setTimeout(() => setIsRenaming(true), 0);
              }}
            >
              <Pencil size={14} strokeWidth={2} aria-hidden />
              Rename
            </DropdownMenuItem>

            <DropdownMenuItem
              tone="destructive"
              onSelect={() => setTimeout(() => setIsConfirmingDelete(true), 0)}
            >
              <Trash2 size={14} strokeWidth={2} aria-hidden />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent className="sm:w-[26rem]">
          <DialogHeader
            title="Delete conversation?"
            description={`"${conversation.title}" and its ${conversation.messageCount} messages will be removed. This cannot be undone.`}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmingDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsConfirmingDelete(false);
                onDelete(conversation.id);
              }}
            >
              Delete conversation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
