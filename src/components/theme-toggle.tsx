"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLanguage();

  if (!resolvedTheme) {
    return <div className="h-11 w-11 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/70" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      aria-label={t("theme.toggle")}
      size="icon"
      variant="outline"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-2xl"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
