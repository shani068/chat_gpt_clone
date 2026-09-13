"use client";

import { useRouter } from "next/navigation";

import { createContext, useCallback, useContext, useMemo } from "react";

import { authClient } from "@/lib/auth-client";
import type { User } from "@/types/user";

/**
 * Session backed by Better Auth. The session lives in an httpOnly cookie set by
 * the auth server; this provider only mirrors it for the UI. Route access is
 * enforced server-side in proxy.ts, not here.
 */
interface SessionContextValue {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  error: Error | null;
  signIn: (input: { email: string; password: string }) => Promise<User>;
  signUp: (input: { email: string; password: string; name: string }) => Promise<User>;
  signOut: () => Promise<void>;
  refetch: () => void;
}

/** Thrown with Better Auth's error code so forms can pick their own copy. */
export class AuthError extends Error {
  constructor(public code: string | undefined, message?: string) {
    super(message ?? code ?? "Authentication failed");
  }
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, isPending, error, refetch } = authClient.useSession();

  const user = useMemo(() => (data?.user ? toAppUser(data.user) : null), [data?.user]);

  const status: SessionContextValue["status"] = isPending
    ? "loading"
    : user
      ? "authenticated"
      : "unauthenticated";

  const signIn = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const { data: result, error: signInError } = await authClient.signIn.email({
      email,
      password,
    });
    if (signInError || !result) {
      throw new AuthError(signInError?.code, signInError?.message);
    }
    return toAppUser(result.user);
  }, []);

  const signUp = useCallback(
    async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const { data: result, error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
      });
      if (signUpError || !result) {
        throw new AuthError(signUpError?.code, signUpError?.message);
      }
      return toAppUser(result.user);
    },
    [],
  );

  const signOut = useCallback(async () => {
    await authClient.signOut();
    router.push("/");
    // Drop any server-rendered output cached for the signed-in user.
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({ user, status, error: error ?? null, signIn, signUp, signOut, refetch }),
    [user, status, error, signIn, signUp, signOut, refetch],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

function toAppUser(user: { id: string; name: string; email: string; image?: string | null }): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.image ?? undefined,
    plan: "Free",
  };
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside <SessionProvider>");
  }
  return context;
}
