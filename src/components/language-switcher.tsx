"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { localeMeta, type Locale } from "@/lib/i18n/translations";

const localeOptions: Locale[] = ["vi", "en"];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        aria-label={t("language.switchAria")}
        aria-expanded={open}
        variant="outline"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
        className="h-11 rounded-2xl px-3"
      >
        <span className="text-xs font-bold uppercase tracking-wide text-primary">
          {localeMeta[locale].code}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
      </Button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.6rem)] z-40 min-w-[230px] overflow-hidden rounded-2xl border border-zinc-200 bg-[#eef4fd] shadow-[0_18px_36px_-22px_rgba(20,60,120,0.6)] dark:border-zinc-700 dark:bg-zinc-900">
          {localeOptions.map((item, index) => {
            const active = item === locale;

            return (
              <button
                key={item}
                type="button"
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                  index > 0
                    ? "border-t border-zinc-200/80 dark:border-zinc-700"
                    : ""
                } ${
                  active
                    ? "bg-[#dce7fb] text-primary dark:bg-zinc-800"
                    : "bg-transparent text-zinc-700 hover:bg-[#e7eefc] dark:text-zinc-200 dark:hover:bg-zinc-800"
                }`}
                onClick={() => {
                  setLocale(item);
                  setOpen(false);
                }}
              >
                <span className="w-8 text-sm font-bold uppercase tracking-wide text-primary">
                  {localeMeta[item].code}
                </span>
                <span className="text-xl leading-none">{localeMeta[item].label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}