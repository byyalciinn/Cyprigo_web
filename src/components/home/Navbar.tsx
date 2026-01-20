"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

import { locales } from "@/lib/i18n"

interface NavbarProps {
  variant?: "light" | "dark"
}

const Navbar = ({ variant = "dark" }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const localeFromPath = pathname?.split("/")[1]
  const hasLocale = locales.includes(localeFromPath as (typeof locales)[number])
  const basePath = hasLocale ? `/${localeFromPath}` : ""
  const homeHref = `${basePath}/home`
  const blogHref = `${basePath}/blog`
  const authHref = `${basePath}/auth`

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // On light variant or when scrolled, use dark text
  const useDarkText = variant === "light" || isScrolled

  const navLinks = [
    { name: "Ana Sayfa", href: `${basePath}/home`, isAnchor: false },
    { name: "Turlar", href: `${basePath}/home#tours`, isAnchor: false },
    { name: "Hakkımızda", href: `${basePath}/home#about`, isAnchor: false },
    { name: "Galeri", href: `${basePath}/home#gallery`, isAnchor: false },
    { name: "SSS", href: `${basePath}/home#faq`, isAnchor: false },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md py-4 shadow-sm"
          : "bg-transparent py-8"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={homeHref} className="flex items-center">
          <span
            className={`text-2xl md:text-3xl font-display italic font-semibold ${
              useDarkText ? "text-foreground" : "text-background"
            }`}
          >
            Cyprigo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-base font-medium tracking-wide transition-all duration-300 ${
                useDarkText
                  ? "text-foreground/80 hover:text-foreground"
                  : "text-background/90 hover:text-background"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href={blogHref}
            className={`text-base font-medium tracking-wide transition-all duration-300 ${
              useDarkText
                ? "text-foreground/80 hover:text-foreground"
                : "text-background/90 hover:text-background"
            }`}
          >
            Blog
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center">
          <Link
            href={authHref}
            className={`text-sm font-medium transition-colors ${
              useDarkText ? "text-foreground" : "text-background"
            }`}
          >
            Giriş Yap
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
            useDarkText
              ? "border border-border hover:bg-muted"
              : "bg-background/10 backdrop-blur-sm border border-background/30 hover:bg-background/20"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X
              className={`h-5 w-5 ${
                useDarkText ? "text-foreground" : "text-background"
              }`}
            />
          ) : (
            <Menu
              className={`h-5 w-5 ${
                useDarkText ? "text-foreground" : "text-background"
              }`}
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background mt-2 mx-4 rounded-2xl p-8 shadow-lg border border-border animate-fade-in">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground/70 hover:text-foreground transition-colors duration-300 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href={blogHref}
              className="text-foreground/70 hover:text-foreground transition-colors duration-300 text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="pt-4 border-t border-border">
              <Link href={authHref} className="text-foreground font-medium">
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
