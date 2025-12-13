"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { type Locale, localeNames } from "@/lib/i18n";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale: Locale = currentLocale === "tr" ? "en" : "tr";
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  const targetLocale: Locale = currentLocale === "tr" ? "en" : "tr";

  return (
    <Button
      variant="outline"
      onClick={switchLocale}
      className="flex items-center gap-2 border-border hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      <Globe className="h-4 w-4" />
      <span>{localeNames[targetLocale]}</span>
    </Button>
  );
}
