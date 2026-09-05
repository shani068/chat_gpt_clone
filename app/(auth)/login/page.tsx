import type { Metadata } from "next";

import Link from "next/link";

import { LoginForm } from "@/components/features/auth/login-form";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-h2 text-foreground">Sign in</h1>
        <p className="text-small text-muted-foreground mt-1.5">
          Pick up where you left off.
        </p>
      </header>

      <LoginForm />

      <p className="text-small text-muted-foreground mt-6 text-center">
        No account yet?{" "}
        <Link
          href={ROUTES.REGISTER}
          className="text-foreground decoration-accent/50 hover:decoration-accent rounded-sm font-medium underline underline-offset-4 transition-colors"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
