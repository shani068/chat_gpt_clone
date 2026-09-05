import type { Attachment } from "./file";

export type MessageRole = "user" | "assistant";

/**
 * idle      — settled, fully rendered
 * streaming — tokens still arriving
 * error     — generation failed; the message holds the failure, not a toast
 */
export type MessageStatus = "idle" | "streaming" | "error";

export type MessageFeedback = "up" | "down" | null;

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  status: MessageStatus;
  attachments?: Attachment[];
  feedback?: MessageFeedback;
  /** Set when status is "error"; drives the inline retry affordance. */
  error?: string;
  /** True once a user message has been edited in place. */
  edited?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

/** Sidebar list item — avoids shipping every message into the sidebar. */
export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  /** First ~90 chars of the last message, for search result context. */
  preview: string;
}

export type ConversationBucket =
  | "Today"
  | "Yesterday"
  | "Previous 7 days"
  | "Older";

export interface ConversationGroupModel {
  bucket: ConversationBucket;
  conversations: ConversationSummary[];
}

export interface StreamHandle {
  /** Halts the stream; the partial text stays on screen. */
  stop: () => void;
}

export interface StreamCallbacks {
  onToken: (chunk: string, full: string) => void;
  onDone: (full: string) => void;
  onError: (message: string) => void;
}
