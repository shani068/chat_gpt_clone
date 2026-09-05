"use client";

import { useChatContext } from "@/providers/chat-provider";

/**
 * The active conversation and everything that mutates it. Narrow view over the
 * chat context so message components never see history-list concerns.
 */
export function useChat() {
  const {
    conversation,
    messages,
    conversationStatus,
    isStreaming,
    sendMessage,
    stopGeneration,
    regenerate,
    retryMessage,
    editMessage,
    setFeedback,
    openConversation,
  } = useChatContext();

  return {
    conversation,
    messages,
    status: conversationStatus,
    isEmpty: messages.length === 0,
    isStreaming,
    sendMessage,
    stopGeneration,
    regenerate,
    retryMessage,
    editMessage,
    setFeedback,
    openConversation,
  };
}
