import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroLuxury from "@/assets/hero-luxury.jpg";

const FAQSection = () => {
  const faqs = [
    {
      question: "Özelleştirilebilir tur programları sunuyor musunuz?",
      answer:
        "Evet! Tercihlerinize göre kişiselleştirilmiş tur programları oluşturmada uzmanız. İster kültürel mekanlar, ister doğa aktiviteleri veya benzersiz deneyimler arıyor olun, ekibimiz sizin için mükemmel yolculuğu hazırlayacaktır.",
    },
    {
      question: "Kuzey Kıbrıs'ı ziyaret etmek için en iyi zaman ne?",
      answer:
        "Kuzey Kıbrıs yıl boyunca ziyaret edilebilir. İlkbahar (Nisan-Mayıs) ve sonbahar (Eylül-Ekim) ayları ılıman hava ve daha az kalabalık ile ideal dönemlerdir. Yaz ayları plaj aktiviteleri için mükemmeldir.",
    },
    {
      question: "Turlarınız rehberli mi?",
      answer:
        "Evet, tüm turlarımız profesyonel ve lisanslı rehberler eşliğinde gerçekleştirilir. Rehberlerimiz bölgenin tarihi, kültürü ve gizli güzellikleri hakkında detaylı bilgi sunar.",
    },
    {
      question: "Vize konusunda yardım sağlıyor musunuz?",
      answer:
        "Kuzey Kıbrıs'a giriş için Türkiye üzerinden uçuş yapan misafirlerimiz için vize gerekmemektedir. Diğer ülkelerden gelen misafirlerimize vize süreçleri hakkında rehberlik sağlıyoruz.",
    },
    {
      question: "Tur ücretine neler dahil?",
      answer:
        "Tur ücretlerimize genellikle ulaşım, profesyonel rehber, belirlenen aktiviteler ve müze girişleri dahildir. Her turun detay sayfasında dahil olan hizmetler net olarak belirtilmektedir.",
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-6">
        {/* FAQs Label */}
        <div className="flex justify-end mb-8">
          <span className="text-muted-foreground italic text-lg">SSS</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Heading + FAQ */}
          <div>
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
              Seyahat planlama{" "}
              <span className="text-muted-foreground">hakkında tüm cevaplar için SSS bölümümüzü keşfedin.</span>
            </h2>

            <p className="text-muted-foreground mb-10">
              Size yardımcı olmak için buradayız! Mükemmel seyahatinizi planlamak için ihtiyacınız olan tüm bilgileri SSS bölümümüzde bulabilirsiniz.
            </p>

            {/* Accordion FAQ */}
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-2xl mb-3 px-6 data-[state=open]:bg-muted/50"
                >
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Column - Image + Contact Card */}
          <div className="relative">
            {/* Main Image */}
            <div className="rounded-3xl overflow-hidden aspect-[4/5]">
              <img
                src={heroLuxury}
                alt="Kuzey Kıbrıs manzarası"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Contact Card */}
            <div className="absolute bottom-6 right-6 left-6 md:left-auto md:w-72 bg-background rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Hala Sorularınız mı Var?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Mükemmel Kuzey Kıbrıs seyahatinizi planlamak için daha fazla yardıma mı ihtiyacınız var? Ekibimiz her türlü sorunuz için burada.
              </p>
              <Button variant="outline" className="rounded-full w-full">
                Bize Ulaşın
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
