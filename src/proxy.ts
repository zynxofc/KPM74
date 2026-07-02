import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth/session";

// ─────────────────────────────────────────────────────────────────────────────
// Route definitions
// ─────────────────────────────────────────────────────────────────────────────
const PROTECTED_PREFIX = "/admin";
const LOGIN_PATH = "/login";

// ─────────────────────────────────────────────────────────────────────────────
// Proxy function (Next.js 16 — replaces deprecated middleware.ts)
// Verifies JWT from HttpOnly cookie before granting access to /admin routes.
// ─────────────────────────────────────────────────────────────────────────────
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith(PROTECTED_PREFIX);
  const isLoginPage = pathname === LOGIN_PATH;

  // Read session token from cookie — this is an optimistic check (no DB hit)
  const sessionToken = request.cookies.get("session")?.value;
  const session = await decrypt(sessionToken);
  const isAuthenticated = !!session;

  // 1. Unauthenticated user trying to access /admin → redirect to /login
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user trying to access /login → redirect to /admin
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL(PROTECTED_PREFIX, request.url));
  }

  return NextResponse.next();
}

// ─────────────────────────────────────────────────────────────────────────────
// Matcher — only run proxy on app routes (skip static assets and API)
// ─────────────────────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
