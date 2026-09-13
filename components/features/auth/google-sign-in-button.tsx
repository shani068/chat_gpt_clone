"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { authClient, authErrorMessage } from "@/lib/auth-client";

/**
 * Starts Better Auth's Google flow. The browser leaves for Google on success,
 * so the loading state is only cleared when the request itself fails.
 */
export function GoogleSignInButton({
  initialError,
  label = "Continue with Google",
}: {
  /** Error code from the OAuth callback redirect (?error=…). */
  initialError?: string;
  label?: string;
}) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(() => authErrorMessage(initialError));

  const onClick = async () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    setError(null);

    try {
      const { error: signInError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: ROUTES.CHAT,
        newUserCallbackURL: ROUTES.CHAT,
        errorCallbackURL: ROUTES.LOGIN,
      });
      if (signInError) {
        setError(authErrorMessage(signInError.code ?? "unknown"));
        setIsRedirecting(false);
      }
    } catch {
      setError("We could not reach the sign-in service. Check your connection and try again.");
      setIsRedirecting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="secondary"
        size="lg"
        block
        loading={isRedirecting}
        onClick={onClick}
      >
        {isRedirecting ? null : <GoogleIcon />}
        {isRedirecting ? "Redirecting to Google…" : label}
      </Button>

      {error ? (
        <p role="alert" className="text-caption text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Google "G" mark — brand colours are required by Google's guidelines. */
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden focusable="false">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

/** "or" rule between social sign-in and the email form. */
export function AuthDivider() {
  return (
    <div className="my-5 flex items-center gap-3" aria-hidden>
      <span className="bg-border h-px flex-1" />
      <span className="text-caption text-muted-foreground">or</span>
      <span className="bg-border h-px flex-1" />
    </div>
  );
}
