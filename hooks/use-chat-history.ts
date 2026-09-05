"use client";

import { useMemo, useState } from "react";

import { groupConversations, searchConversations } from "@/lib/chat/chat-utils";
import { useChatContext } from "@/providers/chat-provider";

/**
 * Sidebar view of the conversation list: grouping, filtering and the CRUD
 * operations the list rows need. Grouping is memoised against the raw list so
 * typing in the filter does not re-bucket every conversation on each keystroke.
 */
export function useChatHistory() {
  const {
    conversations,
    historyStatus,
    refreshHistory,
    activeId,
    startNewChat,
    rename,
    remove,
  } = useChatContext();

  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => searchConversations(conversations, query),
    [conversations, query],
  );

  const groups = useMemo(() => groupConversations(filtered), [filtered]);

  return {
    conversations,
    groups,
    query,
    setQuery,
    isFiltering: query.trim().length > 0,
    resultCount: filtered.length,
    status: historyStatus,
    isEmpty: historyStatus === "ready" && conversations.length === 0,
    refreshHistory,
    activeId,
    startNewChat,
    rename,
    remove,
  };
}
