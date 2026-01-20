import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Cyprigo | Coming Soon",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: string };
  const dictionary = await getDictionary(locale);

  return <ComingSoon dictionary={dictionary.comingSoon} />;
}
