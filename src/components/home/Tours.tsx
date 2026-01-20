"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/home/button"
import ToursModal from "@/components/home/ToursModal"

const tourKyrenia = "/home/tour-kyrenia.jpg"
const tourFamagusta = "/home/tour-famagusta.jpg"
const tourBellapais = "/home/tour-bellapais.jpg"
const Tours = () => {
  const [toursModalOpen, setToursModalOpen] = useState(false)

  const tours = [
    {
      image: tourKyrenia,
      title: "Girne",
      description:
        "Akdeniz'in incisi Girne'de tarihi kaleyi, pitoresk limanı ve turkuaz sularda eşsiz bir deneyim yaşayın.",
    },
    {
      image: tourFamagusta,
      title: "Gazimağusa",
      description:
        "Ortaçağ surlarıyla çevrili kadim şehirde Othello Kalesi ve tarihi kiliseleri keşfedin.",
    },
    {
      image: tourBellapais,
      title: "Bellapais",
      description:
        "Gotik mimarinin en güzel örneklerinden Bellapais Manastırı'nda huzur dolu anlar geçirin.",
    },
  ]

  return (
    <section id="tours" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px flex-1 max-w-32 bg-border" />
          <span className="text-muted-foreground italic text-base">
            Popüler Turlar
          </span>
          <div className="h-px flex-1 max-w-32 bg-border" />
        </div>

        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
          {/* Left - Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight max-w-lg">
            Kuzey Kıbrıs'ın{" "}
            <span className="text-muted-foreground">
              En Güzel Destinasyonları
            </span>
          </h2>

          {/* Right - Description + Button */}
          <div className="max-w-md">
            <p className="text-muted-foreground mb-6">
              Antik kalelerden el değmemiş plajlara, tarihi manastırlardan doğal
              güzelliklere – Kuzey Kıbrıs'ın büyüleyici rotalarını keşfedin.
            </p>
            <Button
              variant="outline"
              className="rounded-full group"
              onClick={() => setToursModalOpen(true)}
            >
              Daha Fazla
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour, index) => (
            <div
              key={tour.title}
              className="group cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-5">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Title + Arrow Row */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-secondary transition-colors">
                  {tour.title}
                </h3>
                <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-colors">
                  <ArrowRight className="w-4 h-4 text-foreground group-hover:text-background transition-colors" />
                </button>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {tour.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tours Modal */}
      <ToursModal
        isOpen={toursModalOpen}
        onClose={() => setToursModalOpen(false)}
      />
    </section>
  )
}

export default Tours
