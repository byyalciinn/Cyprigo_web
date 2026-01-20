const tourKyrenia = "/home/tour-kyrenia.jpg"
const tourFamagusta = "/home/tour-famagusta.jpg"
const tourBellapais = "/home/tour-bellapais.jpg"
const tourKarpaz = "/home/tour-karpaz.jpg"
const galleryRoom = "/home/gallery-room.jpg"
const gallerySpa = "/home/gallery-spa.jpg"
const heroLuxury = "/home/hero-luxury.jpg"

const GallerySection = () => {
  const topRowImages = [
    { src: tourKyrenia, alt: "Girne Kalesi" },
    { src: galleryRoom, alt: "Lüks oda" },
    { src: tourFamagusta, alt: "Gazimağusa" },
    { src: tourBellapais, alt: "Bellapais Manastırı" },
  ]

  const bottomRowImages = [
    { src: gallerySpa, alt: "Spa deneyimi" },
    { src: heroLuxury, alt: "Akdeniz manzarası" },
    { src: tourKarpaz, alt: "Karpaz yarımadası" },
  ]

  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container mx-auto px-6">
        {/* Gallery Label */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-border" />
          <span className="text-muted-foreground text-sm tracking-wider">
            Galeri
          </span>
          <div className="h-px w-16 bg-border" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12 max-w-3xl mx-auto leading-tight">
          Kuzey Kıbrıs'ın Manzaraları,{" "}
          <span className="text-muted-foreground">
            Kültürü ve Anları Fotoğraflarda
          </span>
        </h2>

        {/* Gallery Grid */}
        <div className="space-y-4">
          {/* Top Row - 4 Images */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-6 md:col-span-3 aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src={topRowImages[0].src}
                alt={topRowImages[0].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3 aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src={topRowImages[1].src}
                alt={topRowImages[1].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3 aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src={topRowImages[2].src}
                alt={topRowImages[2].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3 aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src={topRowImages[3].src}
                alt={topRowImages[3].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Bottom Row - 3 Images */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-4 md:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src={bottomRowImages[0].src}
                alt={bottomRowImages[0].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="col-span-12 sm:col-span-4 md:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src={bottomRowImages[1].src}
                alt={bottomRowImages[1].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="col-span-12 sm:col-span-4 md:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src={bottomRowImages[2].src}
                alt={bottomRowImages[2].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mt-12 leading-relaxed">
          Özenle seçilmiş galerimizle Kuzey Kıbrıs'a adım atın. Ülke genelindeki
          yolculuklarımızdan güzelliği, kültürü ve unutulmaz anları yakalıyoruz.
          İkonik simge yapılardan gizli hazinelere, her görüntüde Kuzey Kıbrıs'ı
          deneyimleyin.
        </p>
      </div>
    </section>
  )
}

export default GallerySection
