// Register form — creates a new account and redirects to login on success
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePost } from "@/hooks/useApi";
import { ROUTES } from "@/constants/routes";
import type { RegisterCredentials, User } from "@/types/auth";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterCredentials>({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutate, isPending } = usePost<User, RegisterCredentials>("/auth/register", {
    onSuccess: () => router.push(ROUTES.LOGIN),
    onError:   (msg) => setApiError(msg),
  });

  function set(field: keyof RegisterCredentials) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (form.password !== form.confirmPassword) {
      setApiError("Passwords do not match");
      return;
    }
    mutate(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input id="name"            type="text"     label="Name"             placeholder="Jane Doe"         value={form.name}            onChange={set("name")}            required />
      <Input id="email"           type="email"    label="Email"            placeholder="you@example.com"  value={form.email}           onChange={set("email")}           required />
      <Input id="password"        type="password" label="Password"         placeholder="••••••••"         value={form.password}        onChange={set("password")}        required />
      <Input id="confirmPassword" type="password" label="Confirm password" placeholder="••••••••"         value={form.confirmPassword} onChange={set("confirmPassword")} required />
      {apiError && <p className="text-sm text-red-500">{apiError}</p>}
      <Button type="submit" loading={isPending} className="w-full mt-2">
        Create account
      </Button>
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="font-medium text-zinc-900 underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
