"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { MessageSquare, Plus, Search, Settings2 } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/primitives";
import { formatRelativeTime, searchConversations } from "@/lib/chat/chat-utils";
import type { ConversationSummary } from "@/types/chat";
import { cn } from "@/utils/cn";

type Item =
  | { kind: "action"; id: string; label: string; icon: typeof Plus; run: () => void }
  | { kind: "conversation"; id: string; conversation: ConversationSummary };

interface ConversationSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversations: ConversationSummary[];
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
}

/**
 * Command-menu search over the conversation history.
 *
 * Keyboard-first: the list is driven entirely by arrow keys and Enter, with
 * `aria-activedescendant` pointing at the highlighted row so focus can stay in
 * the input where typing belongs.
 */
export function ConversationSearch({
  open,
  onOpenChange,
  conversations,
  onSelect,
  onNewChat,
  onOpenSettings,
}: ConversationSearchProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(
    () => searchConversations(conversations, query).slice(0, 40),
    [conversations, query],
  );

  const items = useMemo<Item[]>(() => {
    const actions: Item[] =
      query.trim().length === 0
        ? [
            {
              kind: "action",
              id: "action-new",
              label: "Start a new chat",
              icon: Plus,
              run: onNewChat,
            },
            {
              kind: "action",
              id: "action-settings",
              label: "Open settings",
              icon: Settings2,
              run: onOpenSettings,
            },
          ]
        : [];

    return [
      ...actions,
      ...results.map<Item>((conversation) => ({
        kind: "conversation",
        id: conversation.id,
        conversation,
      })),
    ];
  }, [onNewChat, onOpenSettings, query, results]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  // Keeps the highlighted row inside the scroll viewport.
  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const choose = (item: Item) => {
    onOpenChange(false);
    if (item.kind === "action") item.run();
    else onSelect(item.conversation.id);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (items.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + items.length) % items.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = items[activeIndex];
      if (item) choose(item);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(items.length - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="command" hideClose className="overflow-hidden p-0">
        <DialogTitle className="sr-only">Search conversations</DialogTitle>

        <div className="border-border flex items-center gap-2.5 border-b px-3.5">
          <Search size={15} strokeWidth={2} aria-hidden className="text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search conversations…"
            aria-label="Search conversations"
            aria-controls="command-results"
            aria-activedescendant={
              items[activeIndex] ? `command-item-${items[activeIndex].id}` : undefined
            }
            className="text-body text-foreground placeholder:text-muted-foreground/70 h-12 w-full bg-transparent outline-none"
          />
          <Kbd className="shrink-0">Esc</Kbd>
        </div>

        <ul
          ref={listRef}
          id="command-results"
          role="listbox"
          aria-label="Results"
          className="max-h-[min(24rem,50vh)] overflow-y-auto overscroll-contain p-1.5"
        >
          {items.length === 0 ? (
            <li className="px-3 py-8 text-center">
              <p className="text-small text-foreground">No conversations found</p>
              <p className="text-caption text-muted-foreground mt-1">
                Nothing matches “{query.trim()}”.
              </p>
            </li>
          ) : (
            items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    id={`command-item-${item.id}`}
                    role="option"
                    aria-selected={isActive}
                    data-active={isActive}
                    tabIndex={-1}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => choose(item)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors duration-75",
                      isActive ? "bg-muted" : "bg-transparent",
                    )}
                  >
                    {item.kind === "action" ? (
                      <>
                        <item.icon
                          size={15}
                          strokeWidth={2}
                          aria-hidden
                          className="text-muted-foreground shrink-0"
                        />
                        <span className="text-small text-foreground">{item.label}</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare
                          size={15}
                          strokeWidth={1.75}
                          aria-hidden
                          className="text-muted-foreground shrink-0"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="text-small text-foreground block truncate">
                            {item.conversation.title}
                          </span>
                          {item.conversation.preview ? (
                            <span className="text-caption text-muted-foreground block truncate">
                              {item.conversation.preview}
                            </span>
                          ) : null}
                        </span>
                        <span className="text-muted-foreground shrink-0 text-[0.6875rem]">
                          {formatRelativeTime(item.conversation.updatedAt)}
                        </span>
                      </>
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="border-border text-muted-foreground flex items-center gap-3 border-t px-3.5 py-2 text-[0.6875rem]">
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd> open
          </span>
          <span className="ml-auto">
            {results.length} {results.length === 1 ? "conversation" : "conversations"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
