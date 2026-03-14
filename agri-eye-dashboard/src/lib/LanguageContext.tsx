"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations } from "@/lib/translations";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const devanagariScripts = new Set(["hi", "mr", "gu"]);
const scriptMap: Record<string, string> = {
  te: "telugu",
  ta: "tamil",
  kn: "kannada",
  bn: "bengali",
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("agri-eye-lang");
    if (stored && translations[stored]) {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("agri-eye-lang", language);

    if (devanagariScripts.has(language)) {
      document.documentElement.setAttribute("data-script", "devanagari");
      return;
    }

    const script = scriptMap[language];
    if (script) {
      document.documentElement.setAttribute("data-script", script);
      return;
    }

    document.documentElement.removeAttribute("data-script");
  }, [language]);

  const t = useMemo(
    () =>
      (key: string) =>
        translations[language]?.[key] ?? translations.en[key] ?? key,
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
