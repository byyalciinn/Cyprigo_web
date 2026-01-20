"use client"

import { useState } from "react"
import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react"

import LegalModal from "@/components/home/LegalModal"

const Footer = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"privacy" | "terms">("privacy")

  const openModal = (type: "privacy" | "terms") => {
    setModalType(type)
    setModalOpen(true)
  }
  const quickLinks = [
    { name: "Ana Sayfa", href: "#home" },
    { name: "Turlar", href: "#tours" },
    { name: "Hakkımızda", href: "#about" },
    { name: "Galeri", href: "#gallery" },
    { name: "SSS", href: "#faq" },
  ]

  const tourLinks = [
    { name: "Girne Turu", href: "#" },
    { name: "Gazimağusa Turu", href: "#" },
    { name: "Karpaz Turu", href: "#" },
    { name: "Bellapais Turu", href: "#" },
  ]

  return (
    <footer className="relative bg-card border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left - Brand Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Logo */}
            <a href="#home" className="inline-block">
              <span className="text-4xl font-display italic font-semibold text-foreground">
                Cyprigo
              </span>
            </a>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed max-w-md text-lg">
              Kuzey Kıbrıs'ın eşsiz güzelliklerini keşfedin. Tarihi mekanlar,
              muhteşem plajlar ve unutulmaz deneyimler sizi bekliyor.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-base">Girne, Kuzey Kıbrıs</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-base">+90 392 123 45 67</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-base">info@cyprigo.com</span>
              </div>
            </div>
          </div>

          {/* Right - Links */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              {/* Quick Links */}
              <div>
                <h4 className="text-foreground font-semibold text-lg mb-6">
                  Hızlı Linkler
                </h4>
                <ul className="space-y-4">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-base flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        <span>{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tour Links */}
              <div>
                <h4 className="text-foreground font-semibold text-lg mb-6">
                  Turlarımız
                </h4>
                <ul className="space-y-4">
                  {tourLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-base flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        <span>{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-foreground font-semibold text-lg mb-6">
                  Bülten
                </h4>
                <p className="text-muted-foreground text-base mb-6">
                  En güncel tur fırsatları ve haberler için abone olun.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="w-full bg-muted border border-border rounded-xl px-5 py-3.5 text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/30 transition-colors"
                  />
                  <button className="w-full bg-foreground text-background rounded-xl px-5 py-3.5 font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 group">
                    <span>Abone Ol</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-muted-foreground text-base">
              © {new Date().getFullYear()} Cyprigo. Tüm hakları saklıdır.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => openModal("privacy")}
                className="text-muted-foreground hover:text-foreground transition-colors text-base"
              >
                Gizlilik Politikası
              </button>
              <button
                onClick={() => openModal("terms")}
                className="text-muted-foreground hover:text-foreground transition-colors text-base"
              >
                Kullanım Şartları
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Legal Modal */}
      <LegalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </footer>
  )
}

export default Footer
