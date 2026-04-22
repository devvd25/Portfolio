"use client";

import { LockKeyhole, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginApiResponse = {
  success?: boolean;
  message?: string;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!email || !password) {
      setError(t("adminLogin.error.missingFields"));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json().catch(() => ({}))) as LoginApiResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? t("adminLogin.failedFallback"));
      }

      router.replace("/admin");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : t("adminLogin.networkError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(249,115,22,0.24),transparent_46%),radial-gradient(circle_at_90%_20%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_52%_100%,rgba(16,185,129,0.16),transparent_40%)]" />

      {/* Language & Theme controls */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md space-y-5 rounded-[2rem] border border-white/80 bg-gradient-to-br from-[#fff7ec] to-[#f2e4d2] p-8 shadow-[0_24px_42px_-20px_rgba(142,88,42,0.55)] dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800"
      >
        <div className="space-y-2 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-orange-300">
            <LockKeyhole className="h-3.5 w-3.5" />
            {t("adminLogin.secureAccess")}
          </p>
          <h1 className="font-display text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {t("adminLogin.title")}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {t("adminLogin.description")}
          </p>
        </div>

        <label className="space-y-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          <span>{t("adminLogin.email")}</span>
          <Input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@portfolio.dev"
          />
        </label>

        <label className="space-y-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          <span>{t("adminLogin.password")}</span>
          <Input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("adminLogin.passwordPlaceholder")}
          />
        </label>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <LogIn className="h-4 w-4" />
          {isSubmitting ? t("adminLogin.submitting") : t("adminLogin.submit")}
        </Button>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          {t("adminLogin.tip")}
        </p>
      </form>
    </div>
  );
}
