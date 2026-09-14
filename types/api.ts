// Shared API response shapes used across all service calls

/** Shared envelope returned by the Express `ApiResponse` helper. */
export interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  data: T;
  message: string;
}

/** Alias used by the chat Conversation API integration. */
export type ApiEnvelope<T> = ApiResponse<T>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/** Conversation row from `GET/POST/PUT /api/v1/conversations`. */
export interface ApiConversation {
  id: string;
  userId: string;
  title: string;
  model: string | null;
  systemPrompt: string | null;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

export type ApiMessageRole = "USER" | "ASSISTANT" | "SYSTEM" | "TOOL";
export type ApiMessageStatus = "PENDING" | "COMPLETE" | "ERROR";

/** Message row from `/api/v1/messages`. */
export interface ApiMessage {
  id: string;
  conversationId: string;
  role: ApiMessageRole;
  status: ApiMessageStatus;
  content: string;
  parts: unknown;
  metadata: unknown;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}
