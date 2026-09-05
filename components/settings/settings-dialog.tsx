"use client";

import { useEffect, useState } from "react";

import { SettingsSkeleton } from "@/components/shared/loading-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePreferences } from "@/providers/preferences-provider";
import { cn } from "@/utils/cn";

import {
  SETTINGS_SECTIONS,
  SettingsSectionContent,
  type SettingsSectionId,
} from "./settings-panel";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Lets the shortcuts menu item deep-link straight to that section. */
  initialSection?: SettingsSectionId;
}

export function SettingsDialog({
  open,
  onOpenChange,
  initialSection = "appearance",
}: SettingsDialogProps) {
  const [section, setSection] = useState<SettingsSectionId>(initialSection);
  const { isHydrated } = usePreferences();

  useEffect(() => {
    if (open) setSection(initialSection);
  }, [open, initialSection]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[86vh] overflow-hidden p-0 sm:h-[34rem] sm:w-[46rem]">
        <div className="border-border border-b px-5 py-4 pr-12">
          <DialogTitle className="text-h3 text-foreground">Settings</DialogTitle>
          <DialogDescription className="text-small text-muted-foreground mt-1">
            Preferences are stored in this browser.
          </DialogDescription>
        </div>

        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          {/* Section nav: a rail on desktop, a scrolling strip on mobile. */}
          <nav
            aria-label="Settings sections"
            className={cn(
              "shrink-0 border-border p-2",
              "flex gap-1 overflow-x-auto border-b no-scrollbar",
              "sm:w-[11rem] sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r",
            )}
          >
            {SETTINGS_SECTIONS.map(({ id, label, icon: Icon }) => {
              const isSelected = id === section;
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={isSelected ? "page" : undefined}
                  onClick={() => setSection(id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1.5 text-small transition-colors duration-[120ms]",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    isSelected
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon size={15} strokeWidth={1.9} aria-hidden />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
            {isHydrated ? (
              <SettingsSectionContent section={section} />
            ) : (
              <SettingsSkeleton />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
