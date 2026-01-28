"use client"

import { CookieConsent } from "@/components/CookieConsent"

interface CookieConsentWrapperProps {
  locale: string
}

export function CookieConsentWrapper({ locale }: CookieConsentWrapperProps) {
  return <CookieConsent locale={locale} />
}
