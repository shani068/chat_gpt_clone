"use client";

import { useRouter } from "next/navigation";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useToast } from "@/components/shared/toast-provider";
import { toSummary } from "@/lib/chat/chat-utils";
import * as service from "@/lib/chat/mock-chat-service";
import { usePreferences } from "@/providers/preferences-provider";
import type {
  Conversation,
  ConversationSummary,
  Message,
  MessageFeedback,
  StreamHandle,
} from "@/types/chat";
import type { Attachment } from "@/types/file";

type LoadStatus = "idle" | "loading" | "ready" | "error";

interface ChatContextValue {
  /* history */
  conversations: ConversationSummary[];
  historyStatus: LoadStatus;
  refreshHistory: () => Promise<void>;

  /* active conversation */
  activeId: string | null;
  conversation: Conversation | null;
  messages: Message[];
  conversationStatus: LoadStatus;
  openConversation: (id: string | null) => void;

  /* generation */
  isStreaming: boolean;
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
  stopGeneration: () => void;
  regenerate: () => void;
  retryMessage: (messageId: string) => void;
  editMessage: (messageId: string, content: string) => void;
  setFeedback: (messageId: string, feedback: MessageFeedback) => void;

  /* conversation management */
  startNewChat: () => void;
  rename: (id: string, title: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const { preferences } = usePreferences();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [historyStatus, setHistoryStatus] = useState<LoadStatus>("loading");

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversationStatus, setConversationStatus] = useState<LoadStatus>("idle");
  const [activeId, setActiveId] = useState<string | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);

  // Live handle on the running stream so Stop is instantaneous.
  const streamRef = useRef<StreamHandle | null>(null);
  // Regeneration counter per assistant message, so repeats differ.
  const variants = useRef(new Map<string, number>());
  // Mirrors `conversation` for callbacks that must not re-create on every token.
  const conversationRef = useRef<Conversation | null>(null);
  conversationRef.current = conversation;

  /* ── history ─────────────────────────────────────────────────────────── */

  const refreshHistory = useCallback(async () => {
    setHistoryStatus("loading");
    try {
      setConversations(await service.getConversations());
      setHistoryStatus("ready");
    } catch {
      setHistoryStatus("error");
    }
  }, []);

  useEffect(() => {
    void refreshHistory();
  }, [refreshHistory]);

  /** Keeps the sidebar summary in step without re-reading storage. */
  const syncSummary = useCallback((next: Conversation) => {
    setConversations((current) => {
      const summary = toSummary(next);
      const without = current.filter((entry) => entry.id !== next.id);
      return [summary, ...without].sort((a, b) => b.updatedAt - a.updatedAt);
    });
  }, []);

  /** Single write path: state, storage and sidebar move together. */
  const commitConversation = useCallback(
    (next: Conversation, persist = true) => {
      setConversation(next);
      syncSummary(next);
      if (persist) void service.saveConversation(next);
    },
    [syncSummary],
  );

  /* ── routing ─────────────────────────────────────────────────────────── */

  const openConversation = useCallback(
    (id: string | null) => {
      if (id === null) {
        setActiveId(null);
        setConversation(null);
        setConversationStatus("idle");
        return;
      }

      // Already open (e.g. we just created it) — do not clobber live state.
      if (conversationRef.current?.id === id) {
        setActiveId(id);
        setConversationStatus("ready");
        return;
      }

      setActiveId(id);
      setConversationStatus("loading");

      void service
        .getConversation(id)
        .then((found) => {
          if (!found) {
            setConversation(null);
            setConversationStatus("error");
            return;
          }
          // A stream can only belong to a conversation we are still viewing.
          setConversation({
            ...found,
            messages: found.messages.map((message) =>
              message.status === "streaming"
                ? { ...message, status: "idle" as const }
                : message,
            ),
          });
          setConversationStatus("ready");
        })
        .catch(() => setConversationStatus("error"));
    },
    [],
  );

  const startNewChat = useCallback(() => {
    streamRef.current?.stop();
    streamRef.current = null;
    setIsStreaming(false);
    openConversation(null);
    router.push("/chat");
  }, [openConversation, router]);

  /* ── generation ──────────────────────────────────────────────────────── */

  const runStream = useCallback(
    (target: Conversation, assistantId: string, prompt: string, variant: number) => {
      setIsStreaming(true);

      const attachmentNames =
        target.messages
          .filter((message) => message.role === "user")
          .at(-1)
          ?.attachments?.map((file) => file.name) ?? [];

      const patch = (updater: (message: Message) => Message) => {
        setConversation((current) => {
          if (current?.id !== target.id) return current;
          return {
            ...current,
            messages: current.messages.map((message) =>
              message.id === assistantId ? updater(message) : message,
            ),
          };
        });
      };

      streamRef.current = service.streamAssistantResponse(
        {
          prompt,
          variant,
          attachmentNames,
          shouldStream: preferences.chat.streamResponses,
        },
        {
          onToken: (_chunk, full) => patch((message) => ({ ...message, content: full })),

          onDone: (full) => {
            streamRef.current = null;
            setIsStreaming(false);
            setConversation((current) => {
              if (current?.id !== target.id) return current;
              const next: Conversation = {
                ...current,
                updatedAt: Date.now(),
                messages: current.messages.map((message) =>
                  message.id === assistantId
                    ? { ...message, content: full, status: "idle" as const }
                    : message,
                ),
              };
              syncSummary(next);
              void service.saveConversation(next);
              return next;
            });
          },

          onError: (reason) => {
            streamRef.current = null;
            setIsStreaming(false);
            setConversation((current) => {
              if (current?.id !== target.id) return current;
              const next: Conversation = {
                ...current,
                messages: current.messages.map((message) =>
                  message.id === assistantId
                    ? { ...message, status: "error" as const, error: reason }
                    : message,
                ),
              };
              void service.saveConversation(next);
              return next;
            });
          },
        },
      );
    },
    [preferences.chat.streamResponses, syncSummary],
  );

  const sendMessage = useCallback(
    async (content: string, attachments: Attachment[] = []) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;

      let target = conversationRef.current;

      // First message of a brand-new chat creates the conversation. The URL is
      // updated through the History API rather than router.push, so the shell
      // is not torn down and remounted in the middle of a stream.
      if (!target) {
        target = await service.createConversation();
        setActiveId(target.id);
        setConversationStatus("ready");
        window.history.replaceState(null, "", `/chat/${target.id}`);
      }

      const userMessage = service.buildUserMessage(trimmed, attachments);
      const assistantMessage = service.buildAssistantMessage();

      const next: Conversation = {
        ...target,
        title:
          target.messages.length === 0
            ? service.titleForFirstMessage(trimmed)
            : target.title,
        updatedAt: Date.now(),
        messages: [...target.messages, userMessage, assistantMessage],
      };

      commitConversation(next);
      variants.current.set(assistantMessage.id, 0);
      runStream(next, assistantMessage.id, trimmed, 0);
    },
    [commitConversation, isStreaming, runStream],
  );

  const stopGeneration = useCallback(() => {
    streamRef.current?.stop();
    streamRef.current = null;
    setIsStreaming(false);

    setConversation((current) => {
      if (!current) return current;
      const next: Conversation = {
        ...current,
        messages: current.messages.map((message) =>
          message.status === "streaming"
            ? {
                ...message,
                status: "idle" as const,
                // A stop with nothing generated should not leave an empty bubble.
                content: message.content || "_Generation stopped._",
              }
            : message,
        ),
      };
      void service.saveConversation(next);
      return next;
    });
  }, []);

  /** Re-runs generation for an assistant message already in the transcript. */
  const regenerateAt = useCallback(
    (assistantId: string) => {
      const current = conversationRef.current;
      if (!current || isStreaming) return;

      const index = current.messages.findIndex((message) => message.id === assistantId);
      if (index < 1) return;

      const prompt = [...current.messages.slice(0, index)]
        .reverse()
        .find((message) => message.role === "user");
      if (!prompt) return;

      const variant = (variants.current.get(assistantId) ?? 0) + 1;
      variants.current.set(assistantId, variant);

      const next: Conversation = {
        ...current,
        updatedAt: Date.now(),
        messages: current.messages.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content: "",
                status: "streaming" as const,
                error: undefined,
                feedback: null,
                createdAt: Date.now(),
              }
            : message,
        ),
      };

      commitConversation(next, false);
      runStream(next, assistantId, prompt.content, variant);
    },
    [commitConversation, isStreaming, runStream],
  );

  const regenerate = useCallback(() => {
    const current = conversationRef.current;
    const last = [...(current?.messages ?? [])]
      .reverse()
      .find((message) => message.role === "assistant");
    if (last) regenerateAt(last.id);
  }, [regenerateAt]);

  const retryMessage = useCallback(
    (messageId: string) => regenerateAt(messageId),
    [regenerateAt],
  );

  /**
   * Editing a user message rewrites history from that point: the edited turn
   * stays, everything after it is replaced by a fresh response.
   */
  const editMessage = useCallback(
    (messageId: string, content: string) => {
      const current = conversationRef.current;
      const trimmed = content.trim();
      if (!current || !trimmed || isStreaming) return;

      const index = current.messages.findIndex((message) => message.id === messageId);
      if (index === -1) return;

      const assistantMessage = service.buildAssistantMessage();
      const kept = current.messages.slice(0, index);
      const edited: Message = {
        ...current.messages[index],
        content: trimmed,
        edited: true,
      };

      const next: Conversation = {
        ...current,
        title: index === 0 ? service.titleForFirstMessage(trimmed) : current.title,
        updatedAt: Date.now(),
        messages: [...kept, edited, assistantMessage],
      };

      commitConversation(next);
      variants.current.set(assistantMessage.id, 0);
      runStream(next, assistantMessage.id, trimmed, 0);
    },
    [commitConversation, isStreaming, runStream],
  );

  const setFeedback = useCallback(
    (messageId: string, feedback: MessageFeedback) => {
      const current = conversationRef.current;
      if (!current) return;

      const next: Conversation = {
        ...current,
        messages: current.messages.map((message) =>
          message.id === messageId
            ? { ...message, feedback: message.feedback === feedback ? null : feedback }
            : message,
        ),
      };
      commitConversation(next);
    },
    [commitConversation],
  );

  /* ── management ──────────────────────────────────────────────────────── */

  const rename = useCallback(
    async (id: string, title: string) => {
      try {
        const updated = await service.renameConversation(id, title);
        setConversations((current) =>
          current.map((entry) =>
            entry.id === id
              ? { ...entry, title: updated.title, updatedAt: updated.updatedAt }
              : entry,
          ),
        );
        setConversation((current) =>
          current?.id === id ? { ...current, title: updated.title } : current,
        );
        toast({ title: "Conversation renamed", variant: "success" });
      } catch (error) {
        toast({
          title: "Could not rename",
          description: error instanceof Error ? error.message : undefined,
          variant: "error",
        });
      }
    },
    [toast],
  );

  const remove = useCallback(
    async (id: string) => {
      const removed = conversations.find((entry) => entry.id === id);
      setConversations((current) => current.filter((entry) => entry.id !== id));

      try {
        await service.deleteConversation(id);
      } catch {
        void refreshHistory();
        toast({ title: "Could not delete conversation", variant: "error" });
        return;
      }

      if (conversationRef.current?.id === id) {
        streamRef.current?.stop();
        streamRef.current = null;
        setIsStreaming(false);
        openConversation(null);
        router.push("/chat");
      }

      toast({
        title: "Conversation deleted",
        description: removed?.title,
        variant: "default",
      });
    },
    [conversations, openConversation, refreshHistory, router, toast],
  );

  // A navigation away mid-stream must not leave a timer running.
  useEffect(() => () => streamRef.current?.stop(), []);

  const value = useMemo<ChatContextValue>(
    () => ({
      conversations,
      historyStatus,
      refreshHistory,
      activeId,
      conversation,
      messages: conversation?.messages ?? [],
      conversationStatus,
      openConversation,
      isStreaming,
      sendMessage,
      stopGeneration,
      regenerate,
      retryMessage,
      editMessage,
      setFeedback,
      startNewChat,
      rename,
      remove,
    }),
    [
      conversations,
      historyStatus,
      refreshHistory,
      activeId,
      conversation,
      conversationStatus,
      openConversation,
      isStreaming,
      sendMessage,
      stopGeneration,
      regenerate,
      retryMessage,
      editMessage,
      setFeedback,
      startNewChat,
      rename,
      remove,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used inside <ChatProvider>");
  }
  return context;
}
