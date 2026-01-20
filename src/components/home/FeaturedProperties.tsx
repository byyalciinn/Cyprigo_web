"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/home/button"
import PropertiesModal from "@/components/home/PropertiesModal"

const galleryRoom = "/home/gallery-room.jpg"
const gallerySpa = "/home/gallery-spa.jpg"
const tourKyrenia = "/home/tour-kyrenia.jpg"
const tourBellapais = "/home/tour-bellapais.jpg"

const FeaturedProperties = () => {
  const [propertiesModalOpen, setPropertiesModalOpen] = useState(false)

  const properties = [
    {
      image: galleryRoom,
      title: "The Cyprus Hotel",
      location: "Girne, KKTC",
      description:
        "Girne'nin kalbinde lüks konaklama deneyimi. Deniz manzaralı odalar, spa ve dünya mutfağından lezzetler sunan restoranlarımızla sizleri ağırlıyoruz.",
    },
    {
      image: gallerySpa,
      title: "Bellapais Gardens",
      location: "Bellapais, KKTC",
      description:
        "Tarihi Bellapais Manastırı'nın eteklerinde huzurlu bir kaçamak. Doğayla iç içe, benzersiz manzaralar eşliğinde unutulmaz bir konaklama.",
    },
    {
      image: tourKyrenia,
      title: "Marina Bay Resort",
      location: "Girne Marina, KKTC",
      description:
        "Marina manzaralı lüks süitler, özel plaj ve dünya standartlarında hizmet. Akdeniz'in tadını çıkarın.",
    },
    {
      image: tourBellapais,
      title: "Mountain View Hotel",
      location: "Beşparmak, KKTC",
      description:
        "Beşparmak Dağları'nın muhteşem manzarasına karşı huzur dolu bir konaklama. Doğa yürüyüşleri ve keşif turları için ideal.",
    },
  ]

  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px flex-1 max-w-32 bg-border" />
          <span className="text-muted-foreground italic text-base">
            Popüler Konaklama
          </span>
          <div className="h-px flex-1 max-w-32 bg-border" />
        </div>

        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
          {/* Left - Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight max-w-lg">
            Kuzey Kıbrıs'ın{" "}
            <span className="text-muted-foreground">
              En Özel Mekanlarında Kalın
            </span>
          </h2>

          {/* Right - Description + Button */}
          <div className="max-w-md">
            <p className="text-muted-foreground mb-6">
              Kalelerden villalara, deniz kenarı otellerden dağ evlerine – Kuzey
              Kıbrıs'ın en özel konaklama seçeneklerini keşfedin.
            </p>
            <Button
              variant="outline"
              className="rounded-full group"
              onClick={() => setPropertiesModalOpen(true)}
            >
              Daha Fazla
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Properties Slider */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
          {properties.slice(0, 3).map((property, index) => (
            <div
              key={property.title}
              className="group cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-5">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Title + Arrow Row */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-secondary transition-colors">
                  {property.title}
                </h3>
                <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-colors">
                  <ArrowRight className="w-4 h-4 text-foreground group-hover:text-background transition-colors" />
                </button>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {property.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Properties Modal */}
      <PropertiesModal
        isOpen={propertiesModalOpen}
        onClose={() => setPropertiesModalOpen(false)}
      />
    </section>
  )
}

export default FeaturedProperties
