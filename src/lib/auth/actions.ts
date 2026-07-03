"use server";

import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, deleteSession } from "@/lib/auth/session";
import { logActivity } from "@/lib/auth/log";
import { loginSchema } from "@/lib/validations";
import { isPreviewMode } from "@/lib/preview";

// ─────────────────────────────────────────────────────────────────────────────
// Login Server Action
// ─────────────────────────────────────────────────────────────────────────────
export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  // 1. Validate input shape with Zod
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Username dan password tidak valid." };
  }

  const { username, password } = parsed.data;

  // Preview Mode Auth bypass (explicit environment variables validation)
  if (isPreviewMode()) {
    const envUser = process.env.ADMIN_USERNAME;
    const envPass = process.env.ADMIN_PASSWORD;

    if (!envUser || !envPass) {
      return { error: "ADMIN_USERNAME atau ADMIN_PASSWORD belum dikonfigurasi di environment." };
    }

    if (username === envUser && password === envPass) {
      await createSession(1, username);
      redirect("/admin");
    } else {
      return { error: "Kredensial tidak valid. Silakan coba lagi." };
    }
  }

  // Get client IP for audit log
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // 2. Find the single administrator record
  const [admin] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  // 3. Generic error — do not reveal whether username or password is wrong
  if (!admin) {
    await logActivity({
      action: "LOGIN",
      entity: "Auth",
      description: `Login gagal untuk username: ${username} (pengguna tidak ditemukan)`,
      ipAddress: ip,
    });
    return { error: "Kredensial tidak valid. Silakan coba lagi." };
  }

  // 4. Verify bcrypt hash
  const isValid = await compare(password, admin.passwordHash);
  if (!isValid) {
    await logActivity({
      action: "LOGIN",
      entity: "Auth",
      description: `Login gagal untuk username: ${username} (password salah)`,
      ipAddress: ip,
    });
    return { error: "Kredensial tidak valid. Silakan coba lagi." };
  }

  // 5. Create JWT session stored in HttpOnly cookie
  await createSession(admin.id, admin.username);

  // 6. Log successful login
  await logActivity({
    action: "LOGIN",
    entity: "Auth",
    entityId: String(admin.id),
    description: `Login berhasil: ${admin.username}`,
    ipAddress: ip,
  });

  redirect("/admin");
}

// ─────────────────────────────────────────────────────────────────────────────
// Logout Server Action
// ─────────────────────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  await logActivity({
    action: "LOGOUT",
    entity: "Auth",
    description: "Administrator logout",
  });
  await deleteSession();
  redirect("/login");
}
