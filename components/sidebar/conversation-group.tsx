"use client";

import type { ConversationGroupModel } from "@/types/chat";

import { ConversationItem } from "./conversation-item";

/**
 * One dated bucket of conversations. The heading is a real list caption, so
 * screen readers get the same grouping the eye does.
 */
export function ConversationGroup({
  group,
  activeId,
  alwaysShowActions,
  onRename,
  onDelete,
  onNavigate,
}: {
  group: ConversationGroupModel;
  activeId: string | null;
  alwaysShowActions: boolean;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onNavigate?: () => void;
}) {
  return (
    <section aria-labelledby={`group-${group.bucket.replace(/\s+/g, "-")}`}>
      <h3
        id={`group-${group.bucket.replace(/\s+/g, "-")}`}
        className="text-caption text-muted-foreground/80 px-3 pt-3 pb-1 font-medium tracking-[0.07em] uppercase"
      >
        {group.bucket}
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
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
