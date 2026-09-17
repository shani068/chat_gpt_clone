"use client";

import { ChevronsUpDown, Keyboard, LogOut, Settings2, User2 } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, Badge } from "@/components/ui/primitives";
import { useIsAppleDevice } from "@/hooks/use-keyboard-shortcuts";
import { useSession } from "@/providers/session-provider";
import { cn } from "@/utils/cn";

/**
 * Account control at the foot of the sidebar. Theme lives inside it as a
 * segmented control rather than a submenu — one click instead of two, and the
 * current choice stays visible.
 */
export function UserMenu({
  collapsed = false,
  onOpenSettings,
  onOpenShortcuts,
}: {
  collapsed?: boolean;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
}) {
  const { user, signOut } = useSession();
  const isApple = useIsAppleDevice();

  const name = user?.name ?? "Guest";
  const email = user?.email ?? "Not signed in";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className={cn(
            "group/user flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left",
            "transition-colors duration-[120ms] hover:bg-muted",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            collapsed && "justify-center",
          )}
        >
          <Avatar name={name} src={user?.avatarUrl} size={26} />

          {collapsed ? null : (
            <>
              <span className="min-w-0 flex-1">
                <span className="text-small text-foreground block truncate font-medium">
                  {name}
                </span>
                <span className="text-caption text-muted-foreground block truncate">
                  {email}
                </span>
              </span>
              <ChevronsUpDown
                size={14}
                strokeWidth={2}
                aria-hidden
                className="text-muted-foreground shrink-0"
              />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-64">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <Avatar name={name} src={user?.avatarUrl} size={32} />
          <div className="min-w-0 flex-1">
            <p className="text-small text-foreground truncate font-medium">{name}</p>
            <p className="text-caption text-muted-foreground truncate">{email}</p>
          </div>
          {user ? <Badge tone="accent">{user.plan}</Badge> : null}
        </div>

        <DropdownMenuSeparator />

        <div className="flex flex-col gap-1.5 px-2 py-1.5">
          <span className="text-small text-foreground">Theme</span>
          <ThemeToggle size="sm" className="w-full" />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={onOpenSettings}>
          <User2 size={14} strokeWidth={2} aria-hidden />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={onOpenSettings}>
          <Settings2 size={14} strokeWidth={2} aria-hidden />
          Settings
          <DropdownMenuShortcut>{isApple ? "⌘," : "Ctrl+,"}</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={onOpenShortcuts}>
          <Keyboard size={14} strokeWidth={2} aria-hidden />
          Keyboard shortcuts
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem tone="destructive" onSelect={signOut}>
          <LogOut size={14} strokeWidth={2} aria-hidden />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
