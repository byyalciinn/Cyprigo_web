"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, Calendar, Clock, MapPin, Star, Users, X } from "lucide-react"

interface ToursModalProps {
  isOpen: boolean
  onClose: () => void
}

const tourKyrenia = "/home/tour-kyrenia.jpg"
const tourFamagusta = "/home/tour-famagusta.jpg"
const tourBellapais = "/home/tour-bellapais.jpg"
const gallerySpa = "/home/gallery-spa.jpg"

const ToursModal = ({ isOpen, onClose }: ToursModalProps) => {
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

  const tours = [
    {
      image: tourKyrenia,
      title: "Girne Keşif Turu",
      location: "Girne, KKTC",
      duration: "Tam Gün",
      groupSize: "2-12 Kişi",
      rating: 4.9,
      price: "€89",
      highlights: ["Girne Kalesi", "Tarihi Liman", "St. Hilarion"],
      description: "Akdeniz'in incisi Girne'de tarihi kaleyi, pitoresk limanı ve muhteşem manzaraları keşfedin.",
    },
    {
      image: tourFamagusta,
      title: "Gazimağusa Tarihi Turu",
      location: "Gazimağusa, KKTC",
      duration: "Tam Gün",
      groupSize: "2-15 Kişi",
      rating: 4.8,
      price: "€79",
      highlights: ["Othello Kalesi", "Salamis Harabeleri", "St. Barnabas"],
      description: "Ortaçağ surlarıyla çevrili kadim şehirde Othello Kalesi ve tarihi kiliseleri keşfedin.",
    },
    {
      image: tourBellapais,
      title: "Bellapais & Dağ Turu",
      location: "Bellapais, KKTC",
      duration: "Yarım Gün",
      groupSize: "2-10 Kişi",
      rating: 5.0,
      price: "€59",
      highlights: ["Bellapais Manastırı", "Beşparmak Dağları", "Köy Kahvaltısı"],
      description: "Gotik mimarinin en güzel örneklerinden Bellapais Manastırı'nda huzur dolu anlar geçirin.",
    },
    {
      image: gallerySpa,
      title: "Karpaz Doğa Turu",
      location: "Karpaz, KKTC",
      duration: "Tam Gün",
      groupSize: "4-12 Kişi",
      rating: 4.9,
      price: "€99",
      highlights: ["Altın Kumsal", "Yaban Eşekleri", "Apostolos Andreas"],
      description: "Kuzey Kıbrıs'ın el değmemiş doğasını ve vahşi güzelliklerini keşfedin.",
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
        className="relative w-full max-w-6xl max-h-[90vh] bg-background rounded-3xl shadow-large overflow-hidden animate-modal-up"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-secondary text-sm font-medium tracking-wider uppercase">
                  Turlarımız
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                Kuzey Kıbrıs'ın{" "}
                <span className="text-muted-foreground">Büyüleyici Rotaları</span>
              </h2>
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
        <div className="px-8 py-8 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          <div className="grid md:grid-cols-2 gap-6">
            {tours.map((tour, index) => (
              <div
                key={index}
                className="group bg-muted/30 rounded-3xl overflow-hidden border border-border hover:border-secondary/30 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="text-sm font-medium text-foreground">
                      {tour.rating}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-foreground/80 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-background font-semibold">
                      {tour.price}
                      <span className="text-background/70 font-normal text-sm">
                        /kişi
                      </span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
                    {tour.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {tour.description}
                  </p>

                  {/* Info Row */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{tour.groupSize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{tour.location}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {tour.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="bg-secondary/10 text-secondary text-xs px-3 py-1.5 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full bg-foreground text-background rounded-xl py-3.5 font-medium hover:bg-foreground/90 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                    <span>Detayları Gör</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">
              Özel tur talepleriniz için bizimle iletişime geçin
            </p>
            <button className="bg-secondary text-secondary-foreground rounded-full px-8 py-4 font-medium hover:bg-secondary/90 transition-all duration-300">
              Özel Tur Planla
            </button>
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

export default ToursModal
