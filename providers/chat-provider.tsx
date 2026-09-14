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
import { CONVERSATIONS_API, MESSAGES_API, ROUTES, conversationRoute } from "@/constants/routes";
import { useDelete, usePost } from "@/hooks/useApi";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import {
  apiConversationToSummary,
  apiMessageToMessage,
  deriveTitle,
} from "@/lib/chat/chat-utils";
import * as service from "@/lib/chat/mock-chat-service";
import { usePreferences } from "@/providers/preferences-provider";
import { useSession } from "@/providers/session-provider";
import type { ApiConversation, ApiEnvelope, ApiMessage } from "@/types/api";
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
  /** Clear the active thread if it was archived/deleted from the sidebar. */
  leaveIfActive: (id: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const { preferences } = usePreferences();
  const { status: sessionStatus } = useSession();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [conversationStatus, setConversationStatus] = useState<LoadStatus>("idle");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const streamRef = useRef<StreamHandle | null>(null);
  const variants = useRef(new Map<string, number>());
  const conversationRef = useRef<Conversation | null>(null);
  conversationRef.current = conversation;

  /* ── history (Conversation API) ──────────────────────────────────────── */

  const {
    data: listResponse,
    isLoading: historyLoading,
    isError: historyError,
    invalidate: invalidateConversations,
  } = useFetch<ApiEnvelope<ApiConversation[]>>(
    sessionStatus === "authenticated" ? CONVERSATIONS_API : null,
    ["conversations"],
    { enabled: sessionStatus === "authenticated" },
  );

  const conversations = useMemo(() => {
    const rows = listResponse?.data ?? [];
    return rows
      .filter((row) => !row.isArchived)
      .map(apiConversationToSummary)
      .sort(
        (a, b) =>
          Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned)) ||
          b.updatedAt - a.updatedAt,
      );
  }, [listResponse]);

  const historyStatus: LoadStatus =
    sessionStatus !== "authenticated"
      ? "idle"
      : historyLoading
        ? "loading"
        : historyError
          ? "error"
          : "ready";

  const refreshHistory = useCallback(async () => {
    invalidateConversations();
  }, [invalidateConversations]);

  const { mutateAsync: createConversationApi } = usePost<
    ApiEnvelope<ApiConversation>,
    { title?: string }
  >(CONVERSATIONS_API, {
    invalidateKeys: [["conversations"]],
  });

  const { mutateAsync: createMessageApi } = usePost<
    ApiEnvelope<ApiMessage>,
    { conversationId: string; role: "USER" | "ASSISTANT"; content: string; status?: "COMPLETE" | "PENDING" | "ERROR" }
  >(MESSAGES_API);

  const { mutateAsync: deleteConversationApi } = useDelete<ApiEnvelope<null>>(
    CONVERSATIONS_API,
    { invalidateKeys: [["conversations"]] },
  );

  /* ── routing ─────────────────────────────────────────────────────────── */

  const openConversation = useCallback((id: string | null) => {
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

    void (async () => {
      try {
        const [conversationRes, messagesRes] = await Promise.all([
          api.get<ApiEnvelope<ApiConversation>>(`${CONVERSATIONS_API}/${id}`),
          api.get<ApiEnvelope<ApiMessage[]>>(MESSAGES_API, {
            params: { conversationId: id },
          }),
        ]);

        const found = conversationRes.data.data;
        const messages = (messagesRes.data.data ?? []).map(apiMessageToMessage);

        setConversation({
          id: found.id,
          title: found.title,
          createdAt: new Date(found.createdAt).getTime(),
          updatedAt: new Date(found.updatedAt).getTime(),
          messages,
        });
        setConversationStatus("ready");
      } catch {
        setConversation(null);
        setConversationStatus("error");
      }
    })();
  }, []);

  const startNewChat = useCallback(() => {
    streamRef.current?.stop();
    streamRef.current = null;
    setIsStreaming(false);
    openConversation(null);
    router.push(ROUTES.CHAT);
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
              return {
                ...current,
                updatedAt: Date.now(),
                messages: current.messages.map((message) =>
                  message.id === assistantId
                    ? { ...message, content: full, status: "idle" as const }
                    : message,
                ),
              };
            });

            void createMessageApi({
              conversationId: target.id,
              role: "ASSISTANT",
              content: full,
              status: "COMPLETE",
            }).catch(() => {
              /* Sidebar history already exists; assistant persistence is best-effort. */
            });
          },

          onError: (reason) => {
            streamRef.current = null;
            setIsStreaming(false);
            setConversation((current) => {
              if (current?.id !== target.id) return current;
              return {
                ...current,
                messages: current.messages.map((message) =>
                  message.id === assistantId
                    ? { ...message, status: "error" as const, error: reason }
                    : message,
                ),
              };
            });
          },
        },
      );
    },
    [createMessageApi, preferences.chat.streamResponses],
  );

  const sendMessage = useCallback(
    async (content: string, attachments: Attachment[] = []) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;

      let target = conversationRef.current;

      // First message of a brand-new chat creates the conversation via the API.
      // History API replaceState avoids remounting the shell mid-stream.
      if (!target) {
        try {
          const created = await createConversationApi({
            title: deriveTitle(trimmed),
          });
          const row = created.data;
          target = {
            id: row.id,
            title: row.title,
            createdAt: new Date(row.createdAt).getTime(),
            updatedAt: new Date(row.updatedAt).getTime(),
            messages: [],
          };
          setActiveId(target.id);
          setConversationStatus("ready");
          window.history.replaceState(null, "", conversationRoute(target.id));
        } catch (error) {
          toast({
            title: "Could not start conversation",
            description: error instanceof Error ? error.message : undefined,
            variant: "error",
          });
          return;
        }
      }

      const userMessage = service.buildUserMessage(trimmed, attachments);
      const assistantMessage = service.buildAssistantMessage();

      const next: Conversation = {
        ...target,
        title:
          target.messages.length === 0
            ? deriveTitle(trimmed)
            : target.title,
        updatedAt: Date.now(),
        messages: [...target.messages, userMessage, assistantMessage],
      };

      setConversation(next);
      conversationRef.current = next;

      void createMessageApi({
        conversationId: next.id,
        role: "USER",
        content: trimmed,
        status: "COMPLETE",
      }).catch(() => {
        toast({
          title: "Message may not have been saved",
          variant: "error",
        });
      });

      variants.current.set(assistantMessage.id, 0);
      runStream(next, assistantMessage.id, trimmed, 0);
    },
    [createConversationApi, createMessageApi, isStreaming, runStream, toast],
  );

  const stopGeneration = useCallback(() => {
    streamRef.current?.stop();
    streamRef.current = null;
    setIsStreaming(false);

    setConversation((current) => {
      if (!current) return current;
      return {
        ...current,
        messages: current.messages.map((message) =>
          message.status === "streaming"
            ? {
                ...message,
                status: "idle" as const,
                content: message.content || "_Generation stopped._",
              }
            : message,
        ),
      };
    });
  }, []);

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

      setConversation(next);
      runStream(next, assistantId, prompt.content, variant);
    },
    [isStreaming, runStream],
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
        title: index === 0 ? deriveTitle(trimmed) : current.title,
        updatedAt: Date.now(),
        messages: [...kept, edited, assistantMessage],
      };

      setConversation(next);
      variants.current.set(assistantMessage.id, 0);
      runStream(next, assistantMessage.id, trimmed, 0);
    },
    [isStreaming, runStream],
  );

  const setFeedback = useCallback((messageId: string, feedback: MessageFeedback) => {
    setConversation((current) => {
      if (!current) return current;
      return {
        ...current,
        messages: current.messages.map((message) =>
          message.id === messageId
            ? { ...message, feedback: message.feedback === feedback ? null : feedback }
            : message,
        ),
      };
    });
  }, []);

  /* ── management ──────────────────────────────────────────────────────── */

  const updateConversationFields = useCallback(
    async (
      id: string,
      body: { title?: string; isPinned?: boolean; isArchived?: boolean },
    ) => {
      const res = await api.put<ApiEnvelope<ApiConversation>>(
        `${CONVERSATIONS_API}/${id}`,
        body,
      );
      invalidateConversations();
      return res.data.data;
    },
    [invalidateConversations],
  );

  const rename = useCallback(
    async (id: string, title: string) => {
      try {
        const updated = await updateConversationFields(id, { title });
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
    [toast, updateConversationFields],
  );

  const leaveIfActive = useCallback(
    (id: string) => {
      if (conversationRef.current?.id !== id) return;
      streamRef.current?.stop();
      streamRef.current = null;
      setIsStreaming(false);
      openConversation(null);
      router.push(ROUTES.CHAT);
    },
    [openConversation, router],
  );

  const remove = useCallback(
    async (id: string) => {
      const removed = conversations.find((entry) => entry.id === id);

      try {
        await deleteConversationApi(id);
      } catch {
        toast({ title: "Could not delete conversation", variant: "error" });
        return;
      }

      leaveIfActive(id);

      toast({
        title: "Conversation deleted",
        description: removed?.title,
        variant: "default",
      });
    },
    [conversations, deleteConversationApi, leaveIfActive, toast],
  );

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
      leaveIfActive,
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
      leaveIfActive,
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
