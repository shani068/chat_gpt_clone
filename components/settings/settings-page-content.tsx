"use client";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { SettingsSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { usePreferences } from "@/providers/preferences-provider";

import { AllSettings } from "./settings-panel";

/**
 * Full-page settings. Shares every section component with the dialog, so the
 * two can never drift apart.
 */
export function SettingsPageContent() {
  const { isHydrated } = usePreferences();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href={ROUTES.CHAT}>
          <ArrowLeft size={15} strokeWidth={2} aria-hidden />
          Back to chat
        </Link>
      </Button>

      <header className="mb-8">
        <h1 className="text-h1 text-foreground">Settings</h1>
        <p className="text-body text-muted-foreground mt-2">
          Preferences apply to this browser. Nothing is sent to a server.
        </p>
      </header>

      {isHydrated ? <AllSettings /> : <SettingsSkeleton />}
    </div>
  );
}
