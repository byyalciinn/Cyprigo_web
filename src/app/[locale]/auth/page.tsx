"use client"

import { useState } from "react"
import { Sora, Space_Grotesk } from "next/font/google"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import "../home/home.css"
import { defaultLocale } from "@/lib/i18n"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
})

const heroLuxury = "/home/hero-luxury.jpg"

export default function AuthPage() {
  const params = useParams()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const locale =
    typeof params?.locale === "string" ? params.locale : defaultLocale

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleDemoLogin = () => {
    router.push(`/${locale}/admin`)
  }

  return (
    <main
      className={`${sora.variable} ${spaceGrotesk.variable} transfer-theme h-screen overflow-hidden bg-background`}
    >
      <div className="h-full flex">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative h-full">
          <img
            src={heroLuxury}
            alt="Kuzey Kibris"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/30" />

          {/* Overlay Content */}
          <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
            {/* Logo */}
            <Link href="/home" className="inline-block">
              <span className="text-3xl font-display italic font-semibold text-background">
                Cyprigo
              </span>
            </Link>

            {/* Bottom Content */}
            <div className="max-w-md mb-16">
              <p className="text-background/80 italic text-lg mb-4">
                Kuzey Kibris'i Kesfet
              </p>
              <h1 className="text-4xl xl:text-5xl font-semibold text-background leading-tight mb-6">
                Yoneticiler icin premium bir kontrol alani
              </h1>
              <p className="text-background/70 leading-relaxed">
                Bu sayfa, yakinda entegre edilecek kimlik dogrulama sisteminin
                statik bir onizlemesidir. Guvenli erisim icin altyapi hazirlaniyor.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex flex-col h-full min-h-0">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-6 border-b border-border">
            <Link href="/home" className="inline-block">
              <span className="text-2xl font-display italic font-semibold text-foreground">
                Cyprigo
              </span>
            </Link>
            <Link
              href="/home"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Ana Sayfa</span>
            </Link>
          </div>

          {/* Form Container */}
          <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-gutter:stable] p-6 md:p-12">
            <div className="w-full max-w-md mx-auto">
              {/* Back Link - Desktop */}
              <Link
                href="/home"
                className="hidden lg:inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Ana Sayfaya Don</span>
              </Link>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
                  Yonetim Girisi
                </h2>
                <p className="text-muted-foreground">
                  E-posta ve sifreniz ile giris yapin. Bu ekran demo olarak
                  calisir.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground mb-6">
                <ShieldCheck className="w-5 h-5 text-foreground" />
                <div>
                  Bu giris sadece statik bir onizleme sunar. Gercek kimlik
                  dogrulama yakinda entegre edilecektir.
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="animate-fade-up">
                  <label className="block text-sm text-muted-foreground mb-2.5">
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="ornek@email.com"
                    className="w-full bg-muted/50 border border-border rounded-xl px-5 py-3.5 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-secondary/50 focus:bg-background transition-all duration-300"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  <label className="block text-sm text-muted-foreground mb-2.5">
                    Sifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full bg-muted/50 border border-border rounded-xl px-5 py-3.5 pr-12 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-secondary/50 focus:bg-background transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
                    />
                    Beni hatirla
                  </label>
                  <button
                    type="button"
                    className="hover:text-secondary transition-colors"
                  >
                    Sifremi unuttum
                  </button>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col gap-3 mt-8">
                  <button
                    type="submit"
                    className="w-full bg-foreground text-background rounded-xl py-3.5 font-medium hover:bg-foreground/90 transition-all duration-300 flex items-center justify-center gap-3 group"
                  >
                    <span>Giris Yap</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full border border-border bg-background rounded-xl py-3.5 font-medium text-foreground hover:border-secondary/60 hover:text-secondary transition-all duration-300"
                  >
                    Demo giris ile admin paneline gec
                  </button>
                </div>

                {submitted && (
                  <div className="text-sm text-muted-foreground">
                    Demo girisi tamamlandi. Gercek kimlik dogrulama yakinda
                    aktiflestirilecek.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Cyprigo. Tum haklari saklidir.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
