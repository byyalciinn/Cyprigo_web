"use client"

import { useEffect, useRef } from "react"
import { Award, Heart, MapPin, Sparkles, Users, X } from "lucide-react"

interface StoryModalProps {
  isOpen: boolean
  onClose: () => void
}

const heroLuxury = "/home/hero-luxury.jpg"
const tourKyrenia = "/home/tour-kyrenia.jpg"

const StoryModal = ({ isOpen, onClose }: StoryModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)

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

  if (!isOpen) return null

  const stats = [
    { icon: Users, value: "10,000+", label: "Mutlu Misafir" },
    { icon: MapPin, value: "50+", label: "Benzersiz Rota" },
    { icon: Award, value: "8", label: "Yıllık Deneyim" },
    { icon: Heart, value: "%98", label: "Memnuniyet" },
  ]

  const milestones = [
    {
      year: "2016",
      title: "Başlangıç",
      description: "Kuzey Kıbrıs'ın güzelliklerini dünyaya tanıtma hayaliyle yola çıktık.",
    },
    {
      year: "2018",
      title: "Büyüme",
      description: "İlk 1000 misafirimize ulaştık ve tur portföyümüzü genişlettik.",
    },
    {
      year: "2021",
      title: "Premium Hizmet",
      description: "Lüks konaklama partnerlikleri ile premium deneyimler sunmaya başladık.",
    },
    {
      year: "2024",
      title: "Dijital Dönüşüm",
      description: "Yeni platformumuzla daha kolay rezervasyon ve kişiselleştirilmiş turlar.",
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
        {/* Hero Section */}
        <div className="relative h-64 md:h-80">
          <img
            src={heroLuxury}
            alt="Cyprigo Story"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-background/90 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-all duration-300 shadow-lg"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-secondary text-sm font-medium tracking-wider uppercase">
                Hikayemiz
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
              Kuzey Kıbrıs'ın{" "}
              <span className="text-muted-foreground">Ruhunu Keşfedin</span>
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 overflow-y-auto max-h-[calc(90vh-320px)] custom-scrollbar">
          {/* Introduction */}
          <div className="max-w-3xl mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Cyprigo, 2016 yılında Kuzey Kıbrıs'ın eşsiz güzelliklerini ve zengin 
              kültürel mirasını dünyayla paylaşma tutkusuyla kuruldu. Akdeniz'in bu 
              saklı cennetinde, her misafirimize unutulmaz deneyimler yaşatmak için 
              çalışıyoruz.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Profesyonel ekibimiz ve yerel uzmanlarımızla, tarihi mekanlardan 
              doğal güzelliklere, leziz mutfaktan sıcak misafirperverliğe kadar 
              Kuzey Kıbrıs'ın tüm renklerini sizinle buluşturuyoruz.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-muted/50 rounded-2xl p-6 text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <div className="h-px flex-1 max-w-12 bg-secondary" />
              Yolculuğumuz
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="relative bg-muted/30 rounded-2xl p-6 border border-border hover:border-secondary/30 transition-colors animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-secondary font-semibold text-sm">
                        {milestone.year}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission */}
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src={tourKyrenia}
              alt="Cyprigo Mission"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <p className="text-background/90 italic text-lg md:text-xl leading-relaxed">
                  "Misyonumuz, her misafirimize Kuzey Kıbrıs'ın büyüsünü hissettirmek 
                  ve unutulmaz anılar biriktirmelerine yardımcı olmaktır."
                </p>
                <div className="mt-4 text-background/70 text-sm">
                  — Cyprigo Ekibi
                </div>
              </div>
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

export default StoryModal
