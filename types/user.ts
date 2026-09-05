export interface User {
  id: string;
  name: string;
  email: string;
  /** Rendered as initials when absent — no stock avatars. */
  avatarUrl?: string;
  plan: "Free" | "Pro" | "Team";
}

export type ThemePreference = "light" | "dark" | "system";

/** Enter sends, or Enter inserts a newline and Cmd/Ctrl+Enter sends. */
export type EnterBehaviour = "send" | "newline";

export interface ChatSettings {
  enterBehaviour: EnterBehaviour;
  autoScroll: boolean;
  showMessageActions: boolean;
  /** Streaming can be turned off for users who prefer whole answers. */
  streamResponses: boolean;
}

/**
 * Theme is deliberately absent: next-themes owns and persists it, and a second
 * copy here would be a second source of truth to keep in sync.
 */
export interface UserPreferences {
  chat: ChatSettings;
  sidebarCollapsed: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  chat: {
    enterBehaviour: "newline",
    autoScroll: true,
    showMessageActions: true,
    streamResponses: true,
  },
  sidebarCollapsed: false,
};
