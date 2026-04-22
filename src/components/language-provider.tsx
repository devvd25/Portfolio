"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  LOCALE_STORAGE_KEY,
  resolveLocale,
  translate,
  type Locale,
} from "@/lib/i18n/translations";

interface LanguageContextValue {
  locale: Locale;
  language: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocale] = useState<Locale>("vi");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedLocale =
      typeof window !== "undefined"
        ? window.localStorage.getItem(LOCALE_STORAGE_KEY)
        : null;

    if (storedLocale) {
      setLocale(resolveLocale(storedLocale));
      setHydrated(true);
      return;
    }

    const browserLocale =
      typeof navigator !== "undefined" ? navigator.language : null;

    setLocale(resolveLocale(browserLocale));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale, hydrated]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      language: locale,
      setLocale,
      t: (key: string) => translate(locale, key),
    }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}
