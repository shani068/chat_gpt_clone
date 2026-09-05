"use client";

import { useRouter } from "next/navigation";

import { useCallback, useEffect, useRef, useState } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { SettingsDialog } from "@/components/settings/settings-dialog";
import type { SettingsSectionId } from "@/components/settings/settings-panel";
import { ConversationSearch } from "@/components/sidebar/conversation-search";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useIsMobile } from "@/hooks/use-media-query";
import { useChatContext } from "@/providers/chat-provider";
import { usePreferences } from "@/providers/preferences-provider";


import { ChatComposer } from "./chat-composer";
import { ChatHeader } from "./chat-header";
import { ChatMessageList } from "./chat-message-list";
import { ChatSidebar } from "./chat-sidebar";

/**
 * The application frame: sidebar, header, transcript and composer, plus the
 * three overlays (search, settings, mobile drawer) and every global shortcut.
 *
 * Route synchronisation happens here — the page components are thin wrappers
 * that pass the conversation id from the URL.
 */
export function ChatShell({ chatId }: { chatId?: string }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { preferences, setSidebarCollapsed, isHydrated } = usePreferences();
  const {
    conversations,
    openConversation,
    startNewChat,
    sendMessage,
    stopGeneration,
    isStreaming,
    conversationStatus,
  } = useChatContext();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] =
    useState<SettingsSectionId>("appearance");

  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  // The URL is the source of truth for which conversation is open.
  useEffect(() => {
    openConversation(chatId ?? null);
  }, [chatId, openConversation]);

  const focusComposer = useCallback(() => {
    requestAnimationFrame(() => composerRef.current?.focus());
  }, []);

  const handleNewChat = useCallback(() => {
    startNewChat();
    setIsDrawerOpen(false);
    focusComposer();
  }, [focusComposer, startNewChat]);

  const openSettings = useCallback((section: SettingsSectionId = "appearance") => {
    setSettingsSection(section);
    setIsSettingsOpen(true);
  }, []);

  useKeyboardShortcuts([
    { key: "k", meta: true, allowInInput: true, handler: () => setIsSearchOpen(true) },
    { key: "o", meta: true, shift: true, allowInInput: true, handler: handleNewChat },
    { key: ",", meta: true, allowInInput: true, handler: () => openSettings() },
    {
      key: "b",
      meta: true,
      allowInInput: true,
      enabled: !isMobile,
      handler: () => setSidebarCollapsed(!preferences.sidebarCollapsed),
    },
    { key: "/", handler: focusComposer },
  ]);

  const handleSend = useCallback(
    (content: string, attachments: Parameters<typeof sendMessage>[1]) => {
      void sendMessage(content, attachments);
    },
    [sendMessage],
  );

  const isCollapsed = isHydrated ? preferences.sidebarCollapsed : false;

  return (
    <div className="bg-background flex h-dvh w-full overflow-hidden">
      {/* Docked sidebar — tablet and up */}
      <div className="hidden md:flex">
        <ChatSidebar
          collapsed={isCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!isCollapsed)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => openSettings()}
          onOpenShortcuts={() => openSettings("shortcuts")}
        />
      </div>

      {/* Mobile drawer */}
      <DialogPrimitive.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="anim-fade fixed inset-0 z-50 bg-black/50 md:hidden" />
          <DialogPrimitive.Content
            className="anim-drawer shadow-e3 fixed inset-y-0 left-0 z-50 flex w-[84vw] max-w-[19rem] flex-col focus:outline-none md:hidden"
            aria-label="Conversations"
          >
            <DialogPrimitive.Title className="sr-only">
              Conversations
            </DialogPrimitive.Title>
            <ChatSidebar
              variant="drawer"
              collapsed={false}
              onToggleCollapse={() => undefined}
              onOpenSearch={() => {
                setIsDrawerOpen(false);
                setIsSearchOpen(true);
              }}
              onOpenSettings={() => {
                setIsDrawerOpen(false);
                openSettings();
              }}
              onOpenShortcuts={() => {
                setIsDrawerOpen(false);
                openSettings("shortcuts");
              }}
              onNavigate={() => setIsDrawerOpen(false)}
            />
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenSettings={() => openSettings()}
          onNewChat={handleNewChat}
          sidebarCollapsed={isCollapsed}
        />

        <ChatMessageList
          onSelectPrompt={(prompt) => {
            void sendMessage(prompt);
            focusComposer();
          }}
        />

        <ChatComposer
          onSend={handleSend}
          onStop={stopGeneration}
          isStreaming={isStreaming}
          textareaRef={composerRef}
          disabled={conversationStatus === "loading"}
        />
      </div>

      <ConversationSearch
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        conversations={conversations}
        onSelect={(id) => router.push(`/chat/${id}`)}
        onNewChat={handleNewChat}
        onOpenSettings={() => openSettings()}
      />

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        initialSection={settingsSection}
      />
    </div>
  );
}
