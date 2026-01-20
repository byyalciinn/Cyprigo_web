import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Tours from "@/components/Tours";
import AboutSection from "@/components/AboutSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import GallerySection from "@/components/GallerySection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Cyprigo | Kuzey Kıbrıs Premium Turları</title>
        <meta
          name="description"
          content="Cyprigo ile Kuzey Kıbrıs'ın eşsiz güzelliklerini keşfedin. Girne, Gazimağusa, Bellapais ve Karpaz turları. Premium hizmet, unutulmaz anılar."
        />
        <meta
          name="keywords"
          content="Kuzey Kıbrıs turları, KKTC seyahat, Girne turu, premium tur, lüks tatil"
        />
        <link rel="canonical" href="https://cyprigo.com" />
      </Helmet>

      <main className="min-h-screen overflow-x-hidden bg-background">
        <Navbar />
        <Hero />
        <Tours />
        <AboutSection />
        <FeaturedProperties />
        <GallerySection />
        <FAQSection />
        <Footer />
      </main>
    </>
  );
};

export default Index;
