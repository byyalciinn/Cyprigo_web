import { getDictionary } from "@/lib/i18n";
import { ComingSoon } from "@/components/coming-soon";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: string };
  const dictionary = await getDictionary(locale);

  return <ComingSoon dictionary={dictionary.comingSoon} />;
}
