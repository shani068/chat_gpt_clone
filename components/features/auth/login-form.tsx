// Login form — calls the login endpoint and redirects to dashboard on success
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePost } from "@/hooks/useApi";
import { setSession } from "@/lib/auth";
import { ROUTES } from "@/constants/routes";
import type { AuthSession } from "@/types/auth";
import type { LoginCredentials } from "@/types/auth";

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<LoginCredentials>({ email: "", password: "" });
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutate, isPending } = usePost<AuthSession, LoginCredentials>("/auth/login", {
    onSuccess: (session) => {
      setSession(session);
      router.push(ROUTES.DASHBOARD);
    },
    onError: (msg) => setApiError(msg),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    mutate(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        required
      />
      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        required
      />
      {apiError && <p className="text-sm text-red-500">{apiError}</p>}
      <Button type="submit" loading={isPending} className="w-full mt-2">
        Sign in
      </Button>
      <p className="text-center text-sm text-zinc-500">
        No account?{" "}
        <Link href={ROUTES.REGISTER} className="font-medium text-zinc-900 underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
