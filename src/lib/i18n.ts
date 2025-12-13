export type Locale = "tr" | "en";

export const locales: Locale[] = ["tr", "en"];
export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
};

const dictionaries = {
  en: () => import("@/lib/dictionaries/en.json").then((module) => module.default),
  tr: () => import("@/lib/dictionaries/tr.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
