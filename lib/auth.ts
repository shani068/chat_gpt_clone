// Client-side session helpers — read/write/clear the auth token in localStorage
import { TOKEN_KEY } from "@/constants/config";
import type { AuthSession } from "@/types/auth";

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const session = getSession();
  if (!session) return false;
  return new Date(session.expiresAt) > new Date();
}
