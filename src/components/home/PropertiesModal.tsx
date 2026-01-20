"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, Bath, Bed, MapPin, Star, Wifi, X } from "lucide-react"

interface PropertiesModalProps {
  isOpen: boolean
  onClose: () => void
}

const galleryRoom = "/home/gallery-room.jpg"
const gallerySpa = "/home/gallery-spa.jpg"
const tourKyrenia = "/home/tour-kyrenia.jpg"
const tourBellapais = "/home/tour-bellapais.jpg"

const PropertiesModal = ({ isOpen, onClose }: PropertiesModalProps) => {
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

  const properties = [
    {
      image: galleryRoom,
      title: "The Cyprus Hotel",
      location: "Girne, KKTC",
      rating: 4.9,
      price: "€180",
      beds: 2,
      baths: 1,
      amenities: ["Deniz Manzarası", "Spa", "Restoran"],
      description: "Girne'nin kalbinde lüks konaklama deneyimi. Deniz manzaralı odalar ve dünya mutfağından lezzetler.",
    },
    {
      image: gallerySpa,
      title: "Bellapais Gardens",
      location: "Bellapais, KKTC",
      rating: 5.0,
      price: "€220",
      beds: 3,
      baths: 2,
      amenities: ["Havuz", "Bahçe", "Kahvaltı Dahil"],
      description: "Tarihi Bellapais Manastırı'nın eteklerinde huzurlu bir kaçamak. Doğayla iç içe konaklama.",
    },
    {
      image: tourKyrenia,
      title: "Marina Bay Resort",
      location: "Girne Marina, KKTC",
      rating: 4.8,
      price: "€250",
      beds: 2,
      baths: 2,
      amenities: ["Özel Plaj", "Marina View", "Fitness"],
      description: "Marina manzaralı lüks süitler, özel plaj ve dünya standartlarında hizmet.",
    },
    {
      image: tourBellapais,
      title: "Mountain View Hotel",
      location: "Beşparmak, KKTC",
      rating: 4.7,
      price: "€150",
      beds: 2,
      baths: 1,
      amenities: ["Dağ Manzarası", "Teras", "Doğa Yürüyüşü"],
      description: "Beşparmak Dağları'nın muhteşem manzarasına karşı huzur dolu bir konaklama.",
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
                <Bed className="w-5 h-5 text-secondary" />
                <span className="text-secondary text-sm font-medium tracking-wider uppercase">
                  Konaklama
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                Kuzey Kıbrıs'ın{" "}
                <span className="text-muted-foreground">En Özel Mekanları</span>
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
            {properties.map((property, index) => (
              <div
                key={index}
                className="group bg-muted/30 rounded-3xl overflow-hidden border border-border hover:border-secondary/30 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="text-sm font-medium text-foreground">
                      {property.rating}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-foreground/80 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-background font-semibold">
                      {property.price}
                      <span className="text-background/70 font-normal text-sm">
                        /gece
                      </span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-secondary transition-colors">
                      {property.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {property.description}
                  </p>

                  {/* Room Info */}
                  <div className="flex items-center gap-6 mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Bed className="w-4 h-4" />
                      <span>{property.beds} Yatak</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Bath className="w-4 h-4" />
                      <span>{property.baths} Banyo</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Wifi className="w-4 h-4" />
                      <span>Wi-Fi</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {property.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="bg-secondary/10 text-secondary text-xs px-3 py-1.5 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full bg-foreground text-background rounded-xl py-3.5 font-medium hover:bg-foreground/90 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                    <span>Rezervasyon Yap</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">
              Daha fazla konaklama seçeneği için bizimle iletişime geçin
            </p>
            <button className="bg-secondary text-secondary-foreground rounded-full px-8 py-4 font-medium hover:bg-secondary/90 transition-all duration-300">
              Tüm Seçenekleri Gör
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

export default PropertiesModal
