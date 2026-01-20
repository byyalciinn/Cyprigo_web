"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  X,
} from "lucide-react"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic here
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    onClose()
  }

  if (!isOpen) return null

  const contactInfo = [
    {
      icon: MapPin,
      title: "Adres",
      content: "Girne, Kuzey Kıbrıs",
      subContent: "Merkez Ofis",
    },
    {
      icon: Phone,
      title: "Telefon",
      content: "+90 392 123 45 67",
      subContent: "7/24 Destek Hattı",
    },
    {
      icon: Mail,
      title: "E-posta",
      content: "info@cyprigo.com",
      subContent: "24 saat içinde yanıt",
    },
    {
      icon: Clock,
      title: "Çalışma Saatleri",
      content: "09:00 - 18:00",
      subContent: "Pazartesi - Cumartesi",
    },
  ]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl max-h-[90vh] bg-background rounded-3xl shadow-large overflow-hidden animate-modal-up"
      >
        {/* Header */}
        <div className="relative bg-muted/30 border-b border-border px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-5 h-5 text-secondary" />
                <span className="text-secondary text-sm font-medium tracking-wider uppercase">
                  İletişim
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                Sizinle Tanışmak{" "}
                <span className="text-muted-foreground">İsteriz</span>
              </h2>
              <p className="text-muted-foreground mt-3 max-w-lg">
                Sorularınız, önerileriniz veya özel tur talepleriniz için bizimle 
                iletişime geçin. Size en kısa sürede dönüş yapacağız.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Info - Left Side */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-muted/30 rounded-2xl p-5 border border-border hover:border-secondary/30 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-1">
                        {info.title}
                      </h4>
                      <p className="text-foreground font-medium">
                        {info.content}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {info.subContent}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div className="bg-muted/30 rounded-2xl p-5 border border-border">
                <h4 className="text-sm text-muted-foreground mb-4">
                  Sosyal Medya
                </h4>
                <div className="flex gap-3">
                  {["Instagram", "YouTube", "Facebook"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="flex-1 bg-muted rounded-xl py-3 text-center text-sm text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Adınız Soyadınız
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Adınızı girin"
                      className="w-full bg-muted/50 border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-secondary/50 focus:bg-muted transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
                    <label className="block text-sm text-muted-foreground mb-2">
                      E-posta Adresiniz
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="ornek@email.com"
                      className="w-full bg-muted/50 border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-secondary/50 focus:bg-muted transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Telefon Numaranız
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+90 5XX XXX XX XX"
                      className="w-full bg-muted/50 border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-secondary/50 focus:bg-muted transition-all duration-300"
                    />
                  </div>

                  {/* Subject */}
                  <div className="animate-fade-up" style={{ animationDelay: "0.25s" }}>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Konu
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full bg-muted/50 border border-border rounded-xl px-5 py-4 text-foreground outline-none focus:border-secondary/50 focus:bg-muted transition-all duration-300 appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Konu seçin</option>
                      <option value="tour">Tur Bilgisi</option>
                      <option value="reservation">Rezervasyon</option>
                      <option value="custom">Özel Tur Talebi</option>
                      <option value="partnership">İş Birliği</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Mesajınızı buraya yazın..."
                    rows={5}
                    className="w-full bg-muted/50 border border-border rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-secondary/50 focus:bg-muted transition-all duration-300 resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-2 animate-fade-up" style={{ animationDelay: "0.35s" }}>
                  <p className="text-sm text-muted-foreground">
                    * Zorunlu alanları doldurunuz
                  </p>
                  <button
                    type="submit"
                    className="bg-foreground text-background rounded-full px-8 py-4 font-medium hover:bg-foreground/90 transition-all duration-300 flex items-center gap-3 group"
                  >
                    <span>Gönder</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modal-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-modal-up {
          animation: modal-up 0.4s ease-out forwards;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(40 15% 90%);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(220 10% 45%);
        }
      `}</style>
    </div>
  )
}

export default ContactModal
