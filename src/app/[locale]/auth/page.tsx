"use client"

import { useState } from "react"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import "./auth.css"
import { defaultLocale } from "@/lib/i18n"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
})

const heroLuxury = "/home/hero-luxury.jpg"

export default function AuthPage() {
  const params = useParams()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const locale =
    typeof params?.locale === "string" ? params.locale : defaultLocale

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setSubmitted(true)
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    router.push(`/${locale}/admin`)
  }

  return (
    <main
      className={`${cormorant.variable} ${dmSans.variable} auth-page h-screen overflow-hidden`}
    >
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      <div className="h-full flex">
        {/* Left Side - Clean Image */}
        <div className="hidden lg:flex lg:w-[55%] relative h-full overflow-hidden">
          {/* Background Image */}
          <img
            src={heroLuxury}
            alt="Kuzey Kıbrıs"
            className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom"
          />

          {/* Subtle Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-transparent to-stone-900/20" />

          {/* Logo Only */}
          <div className="relative z-10 p-12 xl:p-16">
            <Link href={`/${locale}/home`} className="inline-block group">
              <span className="text-4xl xl:text-5xl font-display italic font-semibold text-white drop-shadow-lg transition-all duration-500 group-hover:opacity-80">
                Cyprigo
              </span>
            </Link>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-[45%] flex flex-col h-full min-h-0 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50/50 relative">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B45309' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-6 border-b border-amber-200/50 bg-white/50 backdrop-blur-sm relative z-10">
            <Link href={`/${locale}/home`} className="inline-block">
              <span className="text-2xl font-display italic font-semibold text-stone-800">
                Cyprigo
              </span>
            </Link>
            <Link
              href={`/${locale}/home`}
              className="flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-body">Ana Sayfa</span>
            </Link>
          </div>

          {/* Form Container */}
          <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-gutter:stable] p-6 md:p-12 xl:p-16 relative z-10">
            <div className="w-full max-w-md mx-auto">
              {/* Back Link - Desktop */}
              <Link
                href={`/${locale}/home`}
                className="hidden lg:inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-all duration-300 mb-10 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-body">Ana Sayfaya Dön</span>
              </Link>

              {/* Header */}
              <div className="mb-10">
                <h2 className="text-4xl md:text-5xl font-display font-semibold text-stone-800 mb-4 animate-fade-in-up">
                  Hoş Geldiniz
                </h2>
                <p className="text-stone-500 font-body text-lg animate-fade-in-up animation-delay-100">
                  Yönetim panelinize güvenli bir şekilde erişin
                </p>
              </div>

              {/* Glass Card Form Container */}
              <div className="glass-card rounded-3xl p-8 animate-fade-in-up animation-delay-200">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div className="input-group">
                    <label htmlFor="email" className="input-label">
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="input-field"
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="input-group">
                    <label htmlFor="password" className="input-label">
                      Şifre
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="input-field pr-12"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) =>
                          setFormData({ ...formData, rememberMe: e.target.checked })
                        }
                      />
                      <span className="checkmark" />
                      <span className="checkbox-label">Beni hatırla</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm font-body text-stone-500 hover:text-amber-600 transition-colors duration-300"
                    >
                      Şifremi unuttum
                    </button>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary group"
                    >
                      <span className="btn-content">
                        {isLoading ? (
                          <div className="loading-spinner" />
                        ) : (
                          <>
                            <span>Giriş Yap</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </span>
                      <div className="btn-shimmer" />
                    </button>

                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      disabled={isLoading}
                      className="btn-secondary group"
                    >
                      <span>Demo ile Devam Et</span>
                      <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </div>

                  {submitted && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-body animate-fade-in-up">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>Demo girişi başarılı! Yönlendiriliyorsunuz...</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Divider with Text */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
                <span className="text-xs font-body text-stone-400 uppercase tracking-widest">Güvenli Bağlantı</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
              </div>

              {/* Security Note */}
              <p className="text-center text-sm text-stone-400 font-body">
                256-bit SSL şifreleme ile korunan güvenli oturum
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-amber-200/30 bg-white/30 backdrop-blur-sm relative z-10">
            <p className="text-center text-sm text-stone-400 font-body">
              © {new Date().getFullYear()} Cyprigo. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
