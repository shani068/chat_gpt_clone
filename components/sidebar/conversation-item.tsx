"use client";

import Link from "next/link";

import { useEffect, useRef, useState } from "react";

import { Archive, MoreHorizontal, Pencil, Pin, PinOff, Trash2 } from "lucide-react";

import { useToast } from "@/components/shared/toast-provider";
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
import { CONVERSATIONS_API, conversationRoute } from "@/constants/routes";
import { usePut } from "@/hooks/useApi";
import { formatRelativeTime } from "@/lib/chat/chat-utils";
import type { ApiConversation, ApiEnvelope } from "@/types/api";
import type { ConversationSummary } from "@/types/chat";
import { cn } from "@/utils/cn";

interface ConversationItemProps {
  conversation: ConversationSummary;
  isActive: boolean;
  /** Touch layouts keep the row menu visible instead of revealing on hover. */
  alwaysShowActions: boolean;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onArchived?: (id: string) => void;
  onNavigate?: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  alwaysShowActions,
  onRename,
  onDelete,
  onArchived,
  onNavigate,
}: ConversationItemProps) {
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [draft, setDraft] = useState(conversation.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateConversation, isPending: isUpdating } = usePut<
    ApiEnvelope<ApiConversation>,
    { title?: string; isPinned?: boolean; isArchived?: boolean }
  >(`${CONVERSATIONS_API}/${conversation.id}`, {
    invalidateKeys: [["conversations"]],
    onSuccess: (res) => {
      const updated = res.data;
      if (updated.isArchived) {
        onArchived?.(conversation.id);
        toast({ title: "Chat archived", variant: "success" });
        return;
      }
      toast({
        title: updated.isPinned ? "Chat pinned" : "Chat unpinned",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({ title: error, variant: "error" });
    },
  });

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

  const isPinned = Boolean(conversation.isPinned);

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
          href={conversationRoute(conversation.id)}
          onClick={onNavigate}
          aria-current={isActive ? "page" : undefined}
          title={conversation.title}
          className={cn(
            "flex h-8 min-w-0 flex-1 items-center gap-1.5 rounded-md pl-2 pr-1 text-small",
            "transition-colors duration-[120ms]",
            isActive
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
          )}
        >
              {isPinned ? (
                <Pin
                  size={12}
                  strokeWidth={2}
                  className="text-muted-foreground shrink-0"
                  aria-hidden
                />
              ) : null}
              <span className="truncate">{conversation.title}</span>
            </Link>

            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Actions for ${conversation.title}`}
                  disabled={isUpdating}
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
                    {formatRelativeTime(conversation.updatedAt)}
                  </p>
                </div>

                <DropdownMenuItem
                  disabled={isUpdating}
                  onSelect={() => updateConversation({ isPinned: !isPinned })}
                >
                  {isPinned ? (
                    <PinOff size={14} strokeWidth={2} aria-hidden />
                  ) : (
                    <Pin size={14} strokeWidth={2} aria-hidden />
                  )}
                  {isPinned ? "Unpin Chat" : "Pin Chat"}
                </DropdownMenuItem>

                <DropdownMenuItem
                  disabled={isUpdating}
                  onSelect={() => updateConversation({ isArchived: true })}
                >
                  <Archive size={14} strokeWidth={2} aria-hidden />
                  Archive
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => {
                    setDraft(conversation.title);
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
                  Delete Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent className="sm:w-[26rem]">
          <DialogHeader
            title="Delete conversation?"
            description={`"${conversation.title}" will be permanently deleted. This cannot be undone.`}
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
              Delete Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
