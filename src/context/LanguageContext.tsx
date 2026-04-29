"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import en from "../../locales/en.json";
import ar from "../../locales/ar.json";

export type Lang = "en" | "ar";

const locales: Record<Lang, Record<string, string>> = { en, ar };

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("velro-lang") as Lang | null;
    const resolved: Lang = saved === "ar" ? "ar" : "en";
    setLangState(resolved);
    document.documentElement.dir = resolved === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = resolved;
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("velro-lang", l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;

    // Conditionally load Tajawal font when switching to Arabic
    if (l === "ar" && !document.getElementById("tajawal-font")) {
      const link = document.createElement("link");
      link.id = "tajawal-font";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap";
      document.head.appendChild(link);
    }

    // Brief opacity fade for smooth language switch feel
    document.body.classList.add("lang-switching");
    setTimeout(() => document.body.classList.remove("lang-switching"), 200);
  }, []);

  const t = useCallback(
    (key: string): string => locales[lang][key] ?? locales["en"][key] ?? key,
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
