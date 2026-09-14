"use client";

import type { ConversationGroupModel } from "@/types/chat";

import { ConversationItem } from "./conversation-item";

/**
 * One dated bucket of conversations. The heading is a real list caption, so
 * screen readers get the same grouping the eye does.
 */
export function ConversationGroup({
  group,
  heading,
  activeId,
  alwaysShowActions,
  onRename,
  onDelete,
  onArchived,
  onNavigate,
}: {
  group: ConversationGroupModel;
  /** Optional override for the section caption (e.g. "Pinned"). */
  heading?: string;
  activeId: string | null;
  alwaysShowActions: boolean;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onArchived?: (id: string) => void;
  onNavigate?: () => void;
}) {
  const label = heading ?? group.bucket;
  const headingId = `group-${label.replace(/\s+/g, "-")}`;

  return (
    <section aria-labelledby={headingId}>
      <h3
        id={headingId}
        className="text-caption text-muted-foreground/80 px-3 pt-3 pb-1 font-medium tracking-[0.07em] uppercase"
      >
        {label}
      </h3>

      <ul className="space-y-px">
        {group.conversations.map((conversation) => (
          <li key={conversation.id}>
            <ConversationItem
              conversation={conversation}
              isActive={conversation.id === activeId}
              alwaysShowActions={alwaysShowActions}
              onRename={onRename}
              onDelete={onDelete}
              onArchived={onArchived}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
