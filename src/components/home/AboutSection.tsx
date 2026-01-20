"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/home/button"
import StoryModal from "@/components/home/StoryModal"

const galleryRoom = "/home/gallery-room.jpg"
const gallerySpa = "/home/gallery-spa.jpg"
const tourBellapais = "/home/tour-bellapais.jpg"

const AboutSection = () => {
  const [storyModalOpen, setStoryModalOpen] = useState(false)

  const features = [
    {
      image: galleryRoom,
      title: "Özenle Seçilmiş Turlar",
      description:
        "Her bir turumuz, yerel uzmanlar tarafından özenle planlanmış benzersiz deneyimler sunar.",
    },
    {
      image: gallerySpa,
      title: "Premium Konaklama",
      description:
        "En seçkin oteller ve butik mekanlarla işbirliği yaparak konforunuzu garanti altına alıyoruz.",
    },
    {
      image: tourBellapais,
      title: "Kişisel Rehberlik",
      description:
        "Profesyonel rehberlerimiz, her adımda yanınızda olarak unutulmaz anılar biriktirmenizi sağlar.",
    },
  ]

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px flex-1 max-w-32 bg-border" />
          <span className="text-muted-foreground italic text-base">
            Hakkımızda
          </span>
          <div className="h-px flex-1 max-w-32 bg-border" />
        </div>

        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-12">
          {/* Left - Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight max-w-lg">
            Neden{" "}
            <span className="text-muted-foreground">
              Cyprigo'yu Tercih Etmelisiniz?
            </span>
          </h2>

          {/* Right - Description + Button */}
          <div className="max-w-md">
            <p className="text-muted-foreground mb-6">
              Kuzey Kıbrıs'ın güzelliklerini keşfetmek için güvenilir
              partneriniz. Konfor, güvenlik ve unutulmaz deneyimler için
              buradayız.
            </p>
            <Button
              variant="outline"
              className="rounded-full group"
              onClick={() => setStoryModalOpen(true)}
            >
              Hikayemizi Keşfet
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-5">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Title + Arrow Row */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-secondary transition-colors">
                  {feature.title}
                </h3>
                <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-colors">
                  <ArrowRight className="w-4 h-4 text-foreground group-hover:text-background transition-colors" />
                </button>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Modal */}
      <StoryModal
        isOpen={storyModalOpen}
        onClose={() => setStoryModalOpen(false)}
      />
    </section>
  )
}

export default AboutSection
