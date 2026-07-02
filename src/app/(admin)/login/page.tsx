"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft, Lock, User, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { login } from "@/lib/auth/actions";
import { loginSchema } from "@/lib/validations";

type LoginFormValues = z.infer<typeof loginSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Login Page
// Uses React Hook Form (client-side validation) + Zod (schema),
// and Server Action (server-side verification + JWT cookie creation).
// ─────────────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div
        aria-hidden="true"
        className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-teal-500/10 rounded-full blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-secondary/10 rounded-full blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="absolute top-[40%] left-[30%] w-[20%] aspect-square bg-accent/5 rounded-full blur-[80px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 space-y-6"
      >
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>

        <GlassCard className="p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 dark:bg-secondary/10 flex items-center justify-center mb-4 border border-primary/20 dark:border-secondary/20">
              <Lock className="w-7 h-7 text-primary dark:text-secondary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Login Admin
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Masuk untuk mengelola portal LinTree KPM
            </p>
          </div>

          {/* Server-side error banner */}
          {state?.error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                {state.error}
              </p>
            </motion.div>
          )}

          {/* Form — wraps React Hook Form with Server Action */}
          <form
            action={formAction}
            onSubmit={handleSubmit(() => {
              /* RHF validates first, then native form action fires */
            })}
            className="space-y-5"
            noValidate
          >
            {/* Username field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-username"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  placeholder="admin"
                  aria-describedby={
                    errors.username ? "username-error" : undefined
                  }
                  aria-invalid={!!errors.username}
                  {...register("username")}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-secondary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 aria-invalid:border-red-400 dark:aria-invalid:border-red-700"
                />
              </div>
              {errors.username && (
                <p
                  id="username-error"
                  className="text-xs text-red-500 dark:text-red-400 mt-1"
                  role="alert"
                >
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  aria-invalid={!!errors.password}
                  {...register("password")}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-secondary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 aria-invalid:border-red-400 dark:aria-invalid:border-red-700"
                />
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="text-xs text-red-500 dark:text-red-400 mt-1"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isPending}
              shineEffect
              className="w-full justify-center py-3 shadow-lg shadow-primary/20 mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </GlassCard>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-600">
          Halaman ini hanya untuk administrator yang berwenang.
        </p>
      </motion.div>
    </div>
  );
}
