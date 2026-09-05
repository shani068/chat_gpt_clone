import type { Metadata } from "next";

import { SettingsPageContent } from "@/components/settings/settings-page-content";

export const metadata: Metadata = {
  title: "Settings",
};

/** Route: /settings — the same sections the in-app dialog shows, full width. */
export default function SettingsPage() {
  return <SettingsPageContent />;
}
