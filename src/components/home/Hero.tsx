const heroLuxury = "/home/hero-luxury.jpg"

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen">
      {/* Full Screen Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroLuxury}
          alt="Kuzey Kıbrıs manzarası"
          className="w-full h-full object-cover"
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-foreground/30" />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Subtitle */}
        <p className="text-background/90 italic text-xl md:text-2xl mb-6 animate-fade-up">
          Kuzey Kıbrıs'ı Keşfet
        </p>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold text-background leading-[1.1] max-w-5xl mb-8 animate-fade-up stagger-1">
          Gelenek, Keşif ve
          <br />
          Doğal Güzelliklerin
          <br />
          Yolculuğu
        </h1>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-up stagger-3">
        <span className="text-background/60 text-sm tracking-wider">
          Keşfet
        </span>
        <div className="w-6 h-10 border-2 border-background/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-background/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}

export default Hero
