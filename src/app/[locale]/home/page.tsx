import type { Metadata } from "next"
import { Sora, Space_Grotesk } from "next/font/google"

import "./home.css"

import AboutSection from "@/components/home/AboutSection"
import FAQSection from "@/components/home/FAQSection"
import FeaturedProperties from "@/components/home/FeaturedProperties"
import Footer from "@/components/home/Footer"
import GallerySection from "@/components/home/GallerySection"
import Hero from "@/components/home/Hero"
import Navbar from "@/components/home/Navbar"
import Tours from "@/components/home/Tours"
import { defaultLocale } from "@/lib/i18n"
import { buildLocaleAlternates, siteConfig } from "@/lib/site"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
})

const homeMetadata: {
  title: string
  description: string
  keywords: string[]
} = {
  title: "Cyprigo | Kuzey Kıbrıs Premium Turları",
  description:
    "Cyprigo ile Kuzey Kıbrıs'ın eşsiz güzelliklerini keşfedin. Girne, Gazimağusa, Bellapais ve Karpaz turları. Premium hizmet, unutulmaz anılar.",
  keywords: [
    "Kuzey Kıbrıs turları",
    "KKTC seyahat",
    "Girne turu",
    "premium tur",
    "lüks tatil",
  ],
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const safeLocale = locale ?? defaultLocale
  const url = `${siteConfig.url}/${safeLocale}/home`

  return {
    ...homeMetadata,
    alternates: {
      canonical: url,
      languages: buildLocaleAlternates("/home"),
    },
    openGraph: {
      title: homeMetadata.title,
      description: homeMetadata.description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: "/home/hero-luxury.jpg",
          width: 1200,
          height: 630,
          alt: "Cyprigo premium Northern Cyprus tours",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: homeMetadata.title,
      description: homeMetadata.description,
      images: ["/home/hero-luxury.jpg"],
    },
  }
}

export default function HomePage() {
  return (
    <main
      className={`${sora.variable} ${spaceGrotesk.variable} transfer-theme min-h-screen overflow-x-hidden bg-background`}
    >
      <Navbar />
      <Hero />
      <Tours />
      <AboutSection />
      <FeaturedProperties />
      <GallerySection />
      <FAQSection />
      <Footer />
    </main>
  )
}
