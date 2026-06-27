// Settings page — route: /settings
import { SettingsForm } from "@/components/features/dashboard/settings-form";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <SettingsForm />
    </div>
  );
}
