import { NextResponse, type NextRequest } from "next/server";

import { getSessionCookie } from "better-auth/cookies";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

const PROTECTED_PREFIXES = ["/c", "/chat", "/settings", "/dashboard"];
const AUTH_PAGES = ["/login", "/register"];

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

/**
 * Validates the Better Auth session with the auth server. A cookie's presence
 * alone is not trusted — it may be expired, revoked, or forged.
 */
async function hasValidSession(request: NextRequest): Promise<boolean> {
  if (!getSessionCookie(request)) return false;

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
    if (!response.ok) return false;
    const session: unknown = await response.json();
    return Boolean(session && typeof session === "object" && "user" in session);
  } catch (error) {
    console.error("[proxy] session check failed", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = matches(pathname, PROTECTED_PREFIXES);
  const isAuthPage = matches(pathname, AUTH_PAGES);

  if (!isProtected && !isAuthPage) return NextResponse.next();

  const authenticated = await hasValidSession(request);

  if (isProtected && !authenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && authenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/c/:path*",
    "/chat",
    "/chat/:path*",
    "/settings/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
