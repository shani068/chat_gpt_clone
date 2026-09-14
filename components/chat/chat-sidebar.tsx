"use client";

import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen, Plus, Search , MessageSquarePlus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ConversationListSkeleton } from "@/components/shared/loading-skeleton";
import { LogoMark } from "@/components/shared/logo";
import { ConversationGroup } from "@/components/sidebar/conversation-group";
import { UserMenu } from "@/components/sidebar/user-menu";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Kbd } from "@/components/ui/primitives";
import { EASE_PREMIUM } from "@/constants/motion";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useIsAppleDevice } from "@/hooks/use-keyboard-shortcuts";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/utils/cn";

const EXPANDED_WIDTH = 268;
const COLLAPSED_WIDTH = 64;

interface ChatSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
  /** Drawer mode skips the width animation and the collapse control. */
  variant?: "docked" | "drawer";
  onNavigate?: () => void;
}

export function ChatSidebar({
  collapsed,
  onToggleCollapse,
  onOpenSearch,
  onOpenSettings,
  onOpenShortcuts,
  variant = "docked",
  onNavigate,
}: ChatSidebarProps) {
  const {
    groups,
    pinned,
    status,
    isEmpty,
    activeId,
    startNewChat,
    rename,
    remove,
    leaveIfActive,
    refreshHistory,
    conversations,
  } = useChatHistory();
  const isApple = useIsAppleDevice();
  const shouldReduceMotion = usePrefersReducedMotion();

  const isDrawer = variant === "drawer";
  const isCollapsed = !isDrawer && collapsed;

  const handleNewChat = () => {
    startNewChat();
    onNavigate?.();
  };

  return (
    <motion.aside
      aria-label="Conversation history"
      initial={false}
      animate={{ width: isDrawer ? "100%" : isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: EASE_PREMIUM }}
      className={cn(
        "flex h-full shrink-0 flex-col overflow-hidden border-r border-border bg-sunken",
        isDrawer && "w-full",
      )}
    >
      {/* Identity + collapse */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center gap-2 px-3",
          isCollapsed && "justify-center px-0",
        )}
      >
        <Link
          href="/"
          aria-label="ChatGPT home"
          className="text-foreground hover:bg-muted focus-visible:outline-ring inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <LogoMark size={19} />
        </Link>

        <AnimatePresence initial={false}>
          {!isCollapsed ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="text-foreground text-[0.9375rem] font-semibold tracking-[-0.02em]"
            >
              ChatGPT
            </motion.span>
          ) : null}
        </AnimatePresence>

        {isDrawer ? null : (
          <IconButton
            size="md"
            label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            shortcut={[isApple ? "⌘" : "Ctrl", "B"]}
            tooltipSide="right"
            onClick={onToggleCollapse}
            aria-expanded={!collapsed}
            aria-controls="conversation-history"
            icon={
              collapsed ? (
                <PanelLeftOpen size={16} strokeWidth={1.9} aria-hidden />
              ) : (
                <PanelLeftClose size={16} strokeWidth={1.9} aria-hidden />
              )
            }
            className={cn("ml-auto", isCollapsed && "hidden")}
          />
        )}
      </div>

      {/* Primary actions */}
      <div className={cn("flex flex-col gap-1 px-3 pb-2", isCollapsed && "items-center px-2")}>
        {isCollapsed ? (
          <>
            <IconButton
              size="lg"
              variant="outline"
              label="New chat"
              shortcut={[isApple ? "⌘" : "Ctrl", "⇧", "O"]}
              tooltipSide="right"
              onClick={handleNewChat}
              icon={<Plus size={17} strokeWidth={2} aria-hidden />}
            />
            <IconButton
              size="lg"
              label="Search conversations"
              shortcut={[isApple ? "⌘" : "Ctrl", "K"]}
              tooltipSide="right"
              onClick={onOpenSearch}
              icon={<Search size={16} strokeWidth={1.9} aria-hidden />}
            />
            <IconButton
              size="lg"
              label="Expand sidebar"
              tooltipSide="right"
              onClick={onToggleCollapse}
              aria-expanded={false}
              aria-controls="conversation-history"
              icon={<PanelLeftOpen size={16} strokeWidth={1.9} aria-hidden />}
            />
          </>
        ) : (
          <>
            <Button variant="secondary" size="md" block onClick={handleNewChat} className="justify-start">
              <MessageSquarePlus size={15} strokeWidth={2} aria-hidden />
              New chat
              <Kbd className="ml-auto">{isApple ? "⌘⇧O" : "Ctrl+⇧O"}</Kbd>
            </Button>

            <button
              type="button"
              onClick={onOpenSearch}
              className={cn(
                "flex h-9 w-full items-center gap-2 rounded-lg px-3 text-small",
                "text-muted-foreground transition-colors duration-[120ms] hover:bg-muted hover:text-foreground",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              <Search size={15} strokeWidth={1.9} aria-hidden />
              Search
              <Kbd className="ml-auto">{isApple ? "⌘K" : "Ctrl+K"}</Kbd>
            </button>
          </>
        )}
      </div>

      {/* History */}
      <div
        id="conversation-history"
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-2",
          isCollapsed && "invisible",
        )}
      >
        {status === "loading" || status === "idle" ? (
          <ConversationListSkeleton />
        ) : status === "error" ? (
          <ErrorState
            compact
            title="Could not load history"
            description="Check your connection and try again."
            onRetry={() => void refreshHistory()}
          />
        ) : isEmpty ? (
          <EmptyState
            compact
            title="No conversations yet"
            description="Your chats will appear here once you send a first message."
          />
        ) : groups.length === 0 && pinned.length === 0 ? (
          <EmptyState compact title="No matches" description="Try a different search." />
        ) : (
          <>
            {pinned.length > 0 ? (
              <ConversationGroup
                heading="Pinned"
                group={{ bucket: "Today", conversations: pinned }}
                activeId={activeId}
                alwaysShowActions={isDrawer}
                onRename={(id, title) => void rename(id, title)}
                onDelete={(id) => void remove(id)}
                onArchived={leaveIfActive}
                onNavigate={onNavigate}
              />
            ) : null}
            {groups.map((group) => (
              <ConversationGroup
                key={group.bucket}
                group={group}
                activeId={activeId}
                alwaysShowActions={isDrawer}
                onRename={(id, title) => void rename(id, title)}
                onDelete={(id) => void remove(id)}
                onArchived={leaveIfActive}
                onNavigate={onNavigate}
              />
            ))}
          </>
        )}
      </div>

      {/* Account */}
      <div className={cn("shrink-0 border-t border-border p-2", isCollapsed && "px-2")}>
        {!isCollapsed && conversations.length > 0 ? (
          <p className="text-muted-foreground/70 px-1.5 pb-1.5 text-[0.6875rem]">
            {conversations.length}{" "}
            {conversations.length === 1 ? "conversation" : "conversations"}
          </p>
        ) : null}

        <UserMenu
          collapsed={isCollapsed}
          onOpenSettings={onOpenSettings}
          onOpenShortcuts={onOpenShortcuts}
        />
      </div>
    </motion.aside>
  );
}
