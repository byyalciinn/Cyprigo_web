"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const COOKIE_CONSENT_KEY = "cyprigo-cookie-consent"

interface CookieConsentProps {
  locale?: string
}

export function CookieConsent({ locale = "tr" }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setIsVisible(false)
  }

  if (!isVisible) return null

  const content = locale === "tr" ? {
    title: "Çerez Kullanımı",
    description: "Web sitemizde deneyiminizi geliştirmek için çerezler kullanıyoruz. Sitemizi kullanmaya devam ederek çerez politikamızı kabul etmiş olursunuz.",
    acceptButton: "Kabul Et",
    declineButton: "Reddet",
    privacyLink: "Gizlilik Politikası",
  } : {
    title: "Cookie Usage",
    description: "We use cookies to enhance your experience on our website. By continuing to use our site, you agree to our cookie policy.",
    acceptButton: "Accept",
    declineButton: "Decline",
    privacyLink: "Privacy Policy",
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 p-6 md:flex md:items-center md:gap-6">
          {/* Close button for mobile */}
          <button
            onClick={handleDecline}
            className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 md:hidden"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="flex-1 mb-4 md:mb-0 pr-8 md:pr-0">
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              {content.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {content.description}{" "}
              <Link
                href={`/${locale}/privacy`}
                className="text-slate-900 underline underline-offset-2 hover:text-slate-700"
              >
                {content.privacyLink}
              </Link>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="text-slate-600"
            >
              {content.declineButton}
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              {content.acceptButton}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
