"use client";

import { useEffect } from "react";
import i18n from "@/lib/i18n/client";

const STORAGE_KEY = "app-language";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const syncLanguage = (language: string) => {
      const normalized = language.slice(0, 2) === "es" ? "es" : "en";
      document.documentElement.lang = normalized;
      window.localStorage.setItem(STORAGE_KEY, normalized);
    };

    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    const browserLanguage = window.navigator.language?.slice(0, 2);
    const initialLanguage = savedLanguage || (browserLanguage === "es" ? "es" : "en");

    if ((i18n.resolvedLanguage || i18n.language || "en").slice(0, 2) !== initialLanguage) {
      i18n.changeLanguage(initialLanguage);
    }

    syncLanguage(initialLanguage);
    i18n.on("languageChanged", syncLanguage);

    return () => {
      i18n.off("languageChanged", syncLanguage);
    };
  }, []);

  return <>{children}</>;
}
