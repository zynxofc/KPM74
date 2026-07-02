import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// ─────────────────────────────────────────────────────────────────────────────
// JWT Configuration
// ─────────────────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  adminId: number;
  username: string;
  expiresAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// Encrypt (create JWT)
// ─────────────────────────────────────────────────────────────────────────────
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

// ─────────────────────────────────────────────────────────────────────────────
// Decrypt (verify JWT)
// ─────────────────────────────────────────────────────────────────────────────
export async function decrypt(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Create session — set JWT as HttpOnly cookie
// ─────────────────────────────────────────────────────────────────────────────
export async function createSession(
  adminId: number,
  username: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const token = await encrypt({ adminId, username, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Delete session — clear cookie on logout
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// ─────────────────────────────────────────────────────────────────────────────
// Get current session — for use in Server Components / Actions
// ─────────────────────────────────────────────────────────────────────────────
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  return decrypt(token);
}
