import { locales, type Locale } from "./i18n";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cyprigo.com").replace(
  /\/$/,
  ""
);

export const siteConfig = {
  name: "Cyprigo",
  url: siteUrl,
};

export const buildLocaleAlternates = (path: string) =>
  locales.reduce((acc, locale) => {
    acc[locale] = `${siteConfig.url}/${locale}${path}`;
    return acc;
  }, {} as Record<Locale, string>);
