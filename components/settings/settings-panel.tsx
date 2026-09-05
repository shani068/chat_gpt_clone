"use client";

import { useState } from "react";

import {
  Download,
  Keyboard,
  MessageSquare,
  Palette,
  Settings2,
  Trash2,
} from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useToast } from "@/components/shared/toast-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Kbd, Switch } from "@/components/ui/primitives";
import {
  renderKey,
  SHORTCUT_HINTS,
  useIsAppleDevice,
} from "@/hooks/use-keyboard-shortcuts";
import { clearAllConversations, exportConversations } from "@/lib/chat/mock-chat-service";
import { useChatContext } from "@/providers/chat-provider";
import { usePreferences } from "@/providers/preferences-provider";
import type { EnterBehaviour } from "@/types/user";

import { SettingsChoice, SettingsRow, SettingsSection } from "./settings-section";

export type SettingsSectionId = "appearance" | "general" | "chat" | "shortcuts";

export const SETTINGS_SECTIONS: {
  id: SettingsSectionId;
  label: string;
  icon: typeof Palette;
}[] = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "general", label: "General", icon: Settings2 },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "shortcuts", label: "Shortcuts", icon: Keyboard },
];

/* ── Appearance ─────────────────────────────────────────────────────────── */

export function AppearanceSettings() {
  return (
    <SettingsSection
      title="Appearance"
      description="ChatGPT is designed dark-first; both themes use the same tokens."
    >
      <SettingsRow
        label="Theme"
        description="System follows your operating system setting."
        control={<ThemeToggle />}
        stacked
      />
    </SettingsSection>
  );
}

/* ── General ────────────────────────────────────────────────────────────── */

export function GeneralSettings() {
  const { toast } = useToast();
  const { refreshHistory, conversations } = useChatContext();
  const { resetPreferences } = usePreferences();
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const handleExport = async () => {
    setIsBusy(true);
    try {
      const json = await exportConversations();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `chatgpt-conversations-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast({ title: "Conversations exported", variant: "success" });
    } catch {
      toast({ title: "Export failed", variant: "error" });
    } finally {
      setIsBusy(false);
    }
  };

  const handleClear = async () => {
    setIsConfirmingClear(false);
    await clearAllConversations();
    await refreshHistory();
    toast({ title: "All conversations deleted", variant: "default" });
  };

  return (
    <>
      <SettingsSection title="General">
        <SettingsRow
          label="Export data"
          description={`Download all ${conversations.length} conversations as JSON.`}
          control={
            <Button
              variant="secondary"
              size="sm"
              loading={isBusy}
              onClick={() => void handleExport()}
              disabled={conversations.length === 0}
            >
              <Download size={14} strokeWidth={2} aria-hidden />
              Export
            </Button>
          }
        />

        <SettingsRow
          label="Reset preferences"
          description="Restores every setting on this page to its default."
          control={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                resetPreferences();
                toast({ title: "Preferences reset", variant: "success" });
              }}
            >
              Reset
            </Button>
          }
        />

        <SettingsRow
          label="Delete all conversations"
          description="Removes every conversation stored in this browser. Cannot be undone."
          control={
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsConfirmingClear(true)}
              disabled={conversations.length === 0}
            >
              <Trash2 size={14} strokeWidth={2} aria-hidden />
              Delete all
            </Button>
          }
        />
      </SettingsSection>

      <Dialog open={isConfirmingClear} onOpenChange={setIsConfirmingClear}>
        <DialogContent className="sm:w-[26rem]">
          <DialogHeader
            title="Delete all conversations?"
            description={`${conversations.length} conversations will be permanently removed from this browser.`}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsConfirmingClear(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => void handleClear()}>
              Delete everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ── Chat ───────────────────────────────────────────────────────────────── */

export function ChatSettings() {
  const { preferences, updateChatSettings } = usePreferences();
  const { toast } = useToast();
  const isApple = useIsAppleDevice();
  const { chat } = preferences;

  const update = (patch: Parameters<typeof updateChatSettings>[0], message: string) => {
    updateChatSettings(patch);
    toast({ title: message, variant: "success", duration: 1800 });
  };

  return (
    <SettingsSection title="Chat">
      <SettingsRow
        label="Enter key"
        description="How the composer treats the Enter key."
        control={
          <SettingsChoice<EnterBehaviour>
            label="Enter key behaviour"
            value={chat.enterBehaviour}
            onChange={(value) =>
              update({ enterBehaviour: value }, "Enter behaviour updated")
            }
            options={[
              {
                value: "newline",
                label: "New line",
                hint: `${isApple ? "⌘↵" : "Ctrl+Enter"} sends`,
              },
              { value: "send", label: "Send", hint: "⇧↵ for a new line" },
            ]}
          />
        }
        stacked
      />

      <SettingsRow
        label="Stream responses"
        description="Show the answer as it is generated instead of all at once."
        htmlFor="setting-stream"
        control={
          <Switch
            id="setting-stream"
            checked={chat.streamResponses}
            onCheckedChange={(value) =>
              update({ streamResponses: value }, "Streaming updated")
            }
          />
        }
      />

      <SettingsRow
        label="Auto-scroll"
        description="Follow new content while you are at the bottom of the transcript."
        htmlFor="setting-autoscroll"
        control={
          <Switch
            id="setting-autoscroll"
            checked={chat.autoScroll}
            onCheckedChange={(value) => update({ autoScroll: value }, "Auto-scroll updated")}
          />
        }
      />

      <SettingsRow
        label="Message actions"
        description="Copy, edit, regenerate and rating controls on each message."
        htmlFor="setting-actions"
        control={
          <Switch
            id="setting-actions"
            checked={chat.showMessageActions}
            onCheckedChange={(value) =>
              update({ showMessageActions: value }, "Message actions updated")
            }
          />
        }
      />
    </SettingsSection>
  );
}

/* ── Shortcuts ──────────────────────────────────────────────────────────── */

export function ShortcutSettings() {
  const isApple = useIsAppleDevice();

  return (
    <SettingsSection
      title="Keyboard shortcuts"
      description="Modifier keys follow the platform automatically."
    >
      {SHORTCUT_HINTS.map((hint) => (
        <div key={hint.id} className="flex items-center justify-between gap-4 px-3.5 py-2.5">
          <span className="text-small text-foreground">{hint.label}</span>
          <span className="flex shrink-0 items-center gap-1">
            {hint.keys.map((key) => (
              <Kbd key={key}>{renderKey(key, isApple)}</Kbd>
            ))}
          </span>
        </div>
      ))}
    </SettingsSection>
  );
}

/* ── Composition ────────────────────────────────────────────────────────── */

export function SettingsSectionContent({ section }: { section: SettingsSectionId }) {
  if (section === "appearance") return <AppearanceSettings />;
  if (section === "general") return <GeneralSettings />;
  if (section === "chat") return <ChatSettings />;
  return <ShortcutSettings />;
}

/** Every section stacked — used by the full-page settings route. */
export function AllSettings() {
  return (
    <div className="space-y-8">
      <AppearanceSettings />
      <GeneralSettings />
      <ChatSettings />
      <ShortcutSettings />
    </div>
  );
}
