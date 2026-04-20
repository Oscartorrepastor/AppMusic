"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "@/lib/i18n/resources";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "es"],
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
