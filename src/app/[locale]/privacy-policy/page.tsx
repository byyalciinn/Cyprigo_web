import { getDictionary } from "@/lib/dictionaries";
import { type Locale, locales } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PrivacyPolicyContent } from "@/components/privacy-policy-content";
import { Shield } from "lucide-react";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary mb-1">
                {dictionary.privacyPolicy.appName}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {dictionary.privacyPolicy.title}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {dictionary.privacyPolicy.lastUpdated}: {dictionary.privacyPolicy.effectiveDate}
              </p>
            </div>
          </div>
          <LanguageSwitcher currentLocale={locale} />
        </header>

        {/* Content */}
        <PrivacyPolicyContent dictionary={dictionary} />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p className="text-sm">&copy; {new Date().getFullYear()} Cyprigo. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
