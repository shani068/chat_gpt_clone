import type { Metadata } from "next";

import Link from "next/link";

import { AuthDivider, GoogleSignInButton } from "@/components/features/auth/google-sign-in-button";
import { RegisterForm } from "@/components/features/auth/register-form";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-h2 text-foreground">Create your account</h1>
        <p className="text-small text-muted-foreground mt-1.5">
          Conversations are stored in your browser — nothing leaves this device.
        </p>
      </header>

      <GoogleSignInButton label="Sign up with Google" />
      <AuthDivider />
      <RegisterForm />

      <p className="text-small text-muted-foreground mt-6 text-center">
        Already have an account?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="text-foreground decoration-accent/50 hover:decoration-accent rounded-sm font-medium underline underline-offset-4 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
