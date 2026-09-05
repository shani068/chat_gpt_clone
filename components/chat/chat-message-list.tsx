"use client";

import { useMemo } from "react";

import { ErrorState } from "@/components/shared/error-state";
import { MessageListSkeleton } from "@/components/shared/loading-skeleton";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { useChat } from "@/hooks/use-chat";
import { useIsMobile } from "@/hooks/use-media-query";
import { useChatContext } from "@/providers/chat-provider";
import { usePreferences } from "@/providers/preferences-provider";

import { AssistantMessage } from "./assistant-message";
import { ScrollToBottom } from "./scroll-to-bottom";
import { UserMessage } from "./user-message";
import { WelcomeScreen } from "./welcome-screen";

export function ChatMessageList({
  onSelectPrompt,
}: {
  onSelectPrompt: (prompt: string) => void;
}) {
  const {
    messages,
    status,
    isStreaming,
    editMessage,
    regenerate,
    retryMessage,
    setFeedback,
    openConversation,
  } = useChat();
  const { activeId } = useChatContext();
  const { preferences } = usePreferences();
  const isMobile = useIsMobile();

  const lastAssistantId = useMemo(
    () => [...messages].reverse().find((m) => m.role === "assistant")?.id,
    [messages],
  );

  // Grows on every token, so the list follows the caret while pinned.
  const scrollSignal = useMemo(
    () => `${messages.length}:${messages[messages.length - 1]?.content.length ?? 0}`,
    [messages],
  );

  const { containerRef, showJumpToBottom, scrollToBottom } = useAutoScroll({
    enabled: preferences.chat.autoScroll,
    signal: scrollSignal,
    isStreaming,
  });

  const statusLabel = isStreaming
    ? "Generating response"
    : messages.length > 0
      ? "Response complete"
      : "";

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={containerRef}
        // Tokens are not announced; the status region below reports state
        // changes instead, so screen readers are not flooded mid-stream.
        role="log"
        aria-label="Conversation"
        aria-live="off"
        className="h-full overflow-y-auto overscroll-contain"
      >
        {status === "loading" ? (
          <MessageListSkeleton />
        ) : status === "error" ? (
          <div className="flex h-full items-center justify-center">
            <ErrorState
              title="Conversation not found"
              description="It may have been deleted, or the link points at a conversation stored in another browser."
              onRetry={() => openConversation(activeId)}
              retryLabel="Reload"
            />
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen onSelectPrompt={onSelectPrompt} />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-7 px-4 pt-6 pb-10 sm:gap-8 sm:px-6 sm:pt-8">
            {messages.map((message) =>
              message.role === "user" ? (
                <UserMessage
                  key={message.id}
                  message={message}
                  showActions={preferences.chat.showMessageActions}
                  touchLayout={isMobile}
                  disabled={isStreaming}
                  onEdit={(content) => editMessage(message.id, content)}
                />
              ) : (
                <AssistantMessage
                  key={message.id}
                  message={message}
                  showActions={preferences.chat.showMessageActions}
                  touchLayout={isMobile}
                  busy={isStreaming}
                  onRegenerate={() => {
                    if (message.id === lastAssistantId) regenerate();
                    else retryMessage(message.id);
                  }}
                  onRetry={() => retryMessage(message.id)}
                  onFeedback={(value) => setFeedback(message.id, value)}
                />
              ),
            )}
          </div>
        )}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {statusLabel}
      </p>

      <ScrollToBottom
        visible={showJumpToBottom}
        onClick={() => scrollToBottom("smooth")}
      />
    </div>
  );
}
