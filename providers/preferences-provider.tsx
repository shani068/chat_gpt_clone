"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { loadPreferences, savePreferences } from "@/lib/chat/mock-chat-service";
import type { ChatSettings, UserPreferences } from "@/types/user";
import { DEFAULT_PREFERENCES } from "@/types/user";

interface PreferencesContextValue {
  preferences: UserPreferences;
  /** False until localStorage has been read — guards a settings flash. */
  isHydrated: boolean;
  updateChatSettings: (patch: Partial<ChatSettings>) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  // Defaults render on the server; the stored values arrive after mount.
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setPreferences(loadPreferences());
    setIsHydrated(true);
  }, []);

  const commit = useCallback((next: UserPreferences) => {
    setPreferences(next);
    savePreferences(next);
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      isHydrated,
      updateChatSettings: (patch) =>
        commit({ ...preferences, chat: { ...preferences.chat, ...patch } }),
      setSidebarCollapsed: (sidebarCollapsed) =>
        commit({ ...preferences, sidebarCollapsed }),
      resetPreferences: () => commit(DEFAULT_PREFERENCES),
    }),
    [preferences, isHydrated, commit],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used inside <PreferencesProvider>");
  }
  return context;
}
