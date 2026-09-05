"use client";

import { PanelLeft, Plus, Settings2 } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import { useChat } from "@/hooks/use-chat";
import { useIsAppleDevice } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/utils/cn";


interface ChatHeaderProps {
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
  onNewChat: () => void;
  /** True when the docked sidebar is hidden, so the title needs no indent. */
  sidebarCollapsed: boolean;
}

export function ChatHeader({
  onOpenDrawer,
  onOpenSettings,
  onNewChat,
  sidebarCollapsed,
}: ChatHeaderProps) {
  const { conversation, isStreaming, messages } = useChat();
  const isApple = useIsAppleDevice();

  const title = conversation?.title ?? "New conversation";

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-2 border-b border-border px-2.5 sm:px-4",
        // A translucent header keeps the transcript visible as it scrolls under.
        "bg-background/85 backdrop-blur-md",
      )}
    >
      <IconButton
        size="md"
        label="Open conversations"
        showTooltip={false}
        onClick={onOpenDrawer}
        icon={<PanelLeft size={17} strokeWidth={1.9} aria-hidden />}
        className="md:hidden"
      />

      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <h1
          title={title}
          className={cn(
            "truncate text-small font-medium text-foreground",
            sidebarCollapsed && "md:pl-1",
          )}
        >
          {title}
        </h1>

        {isStreaming ? (
          <span className="text-caption text-muted-foreground hidden shrink-0 items-center gap-1.5 sm:flex">
            <span className="bg-accent size-1.5 animate-pulse rounded-full" aria-hidden />
            Generating
          </span>
        ) : messages.length > 0 ? (
          <span className="text-caption text-muted-foreground hidden shrink-0 lg:block">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </span>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <IconButton
          size="md"
          label="New chat"
          shortcut={[isApple ? "⌘" : "Ctrl", "⇧", "O"]}
          onClick={onNewChat}
          icon={<Plus size={17} strokeWidth={2} aria-hidden />}
          className="hidden sm:inline-flex"
        />

        <IconButton
          size="md"
          label="Settings"
          shortcut={[isApple ? "⌘" : "Ctrl", ","]}
          onClick={onOpenSettings}
          icon={<Settings2 size={16} strokeWidth={1.9} aria-hidden />}
        />
      </div>
    </header>
  );
}
