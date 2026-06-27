// Profile settings form — lets the user update their name and email
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePatch } from "@/hooks/useApi";

interface SettingsPayload {
  name:  string;
  email: string;
}

export function SettingsForm() {
  const [form, setForm] = useState<SettingsPayload>({ name: "Jane Doe", email: "jane@example.com" });
  const [saved, setSaved] = useState(false);

  const { mutate, isPending } = usePatch<SettingsPayload, SettingsPayload>("/users/me", {
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border border-zinc-100 bg-white p-6 shadow-sm">
      <Input
        id="settings-name"
        label="Display name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        required
      />
      <Input
        id="settings-email"
        type="email"
        label="Email address"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        required
      />
      <div className="flex items-center gap-3">
        <Button type="submit" loading={isPending}>
          Save changes
        </Button>
        {saved && <p className="text-sm text-green-600">Saved!</p>}
      </div>
    </form>
  );
}
