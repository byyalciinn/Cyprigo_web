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

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata: Metadata = {
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
  alternates: {
    canonical: "https://cyprigo.com",
  },
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
