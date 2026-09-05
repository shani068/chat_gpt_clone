"use client";

import { useRouter } from "next/navigation";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { USER_KEY } from "@/lib/chat/mock-chat-service";
import type { User } from "@/types/user";

/**
 * Mock session. There is no auth server, so the "session" is a stored user
 * record — but the surface (user, status, signIn, signOut) is the one a real
 * provider would expose, so swapping it out touches no component.
 */
const DEMO_USER: User = {
  id: "user_demo",
  name: "Alex Rivera",
  email: "alex@example.com",
  plan: "Pro",
};

interface SessionContextValue {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (input: { email: string; name?: string }) => Promise<User>;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<SessionContextValue["status"]>("loading");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(USER_KEY);
      const stored = raw ? (JSON.parse(raw) as User) : null;
      setUser(stored);
      setStatus(stored ? "authenticated" : "unauthenticated");
    } catch {
      setStatus("unauthenticated");
    }
  }, []);

  const signIn = useCallback(async ({ email, name }: { email: string; name?: string }) => {
    // Stand-in for a token exchange.
    await new Promise((resolve) => setTimeout(resolve, 600));

    const nextUser: User = {
      ...DEMO_USER,
      id: `user_${email.split("@")[0]}`,
      email,
      // A blank name must fall back to the handle, so `??` would not do.
      name: name?.trim() ? name.trim() : nameFromEmail(email),
    };

    try {
      window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } catch {
      /* Session still works for this tab without persistence. */
    }

    setUser(nextUser);
    setStatus("authenticated");
    return nextUser;
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(USER_KEY);
    } catch {
      /* nothing to clean up */
    }
    setUser(null);
    setStatus("unauthenticated");
    router.push("/");
  }, [router]);

  const value = useMemo(
    () => ({ user, status, signIn, signOut }),
    [user, status, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

function nameFromEmail(email: string): string {
  const handle = email.split("@")[0] ?? "there";
  return handle
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside <SessionProvider>");
  }
  return context;
}

export { DEMO_USER };
