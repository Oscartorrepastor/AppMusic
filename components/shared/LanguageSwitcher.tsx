"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppLanguage } from "@/lib/i18n/resources";

const STORAGE_KEY = "app-language";
const languages: AppLanguage[] = ["en", "es"];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);

  const handleChangeLanguage = (language: AppLanguage) => {
    window.localStorage.setItem(STORAGE_KEY, language);
    i18n.changeLanguage(language);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/60 p-1 text-white shadow-lg backdrop-blur-md",
        className
      )}
      aria-label={t("common.language")}
    >
      <Languages className="ml-2 h-4 w-4 text-cyan-300" />
      {languages.map((language) => {
        const isActive = currentLanguage === language;

        return (
          <Button
            key={language}
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => handleChangeLanguage(language)}
            className={cn(
              "rounded-full px-3 text-xs font-semibold uppercase tracking-wide",
              isActive
                ? "bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-slate-950 hover:opacity-95"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            )}
          >
            {language}
          </Button>
        );
      })}
    </div>
  );
}
