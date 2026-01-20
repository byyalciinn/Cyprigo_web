"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"

interface LegalModalProps {
  isOpen: boolean
  onClose: () => void
  type: "privacy" | "terms"
}

const LegalModal = ({ isOpen, onClose, type }: LegalModalProps) => {
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

  const content = type === "privacy" ? privacyContent : termsContent
  const title = type === "privacy" ? "Gizlilik Politikası" : "Kullanım Şartları"

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
        className="relative w-full max-w-3xl max-h-[85vh] bg-background rounded-3xl shadow-large overflow-hidden animate-modal-up"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-secondary" />
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                {title}
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
        <div className="px-8 py-8 overflow-y-auto max-h-[calc(85vh-100px)] custom-scrollbar">
          <div className="prose prose-lg max-w-none">
            {content.sections.map((section, index) => (
              <div
                key={index}
                className="mb-8 last:mb-0 animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary text-sm font-medium">
                    {index + 1}
                  </span>
                  {section.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed pl-11">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground italic text-center">
              Son güncelleme: {new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
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

const privacyContent = {
  sections: [
    {
      title: "Kişisel Verilerin Toplanması",
      content:
        "Cyprigo olarak, web sitemizi ziyaret ettiğinizde ve hizmetlerimizi kullandığınızda bazı kişisel verilerinizi topluyoruz. Bu veriler; ad, soyad, e-posta adresi, telefon numarası ve tercihlerinizi içerebilir. Verileriniz yalnızca hizmet kalitemizi artırmak ve size daha iyi bir deneyim sunmak amacıyla kullanılmaktadır.",
    },
    {
      title: "Verilerin Kullanım Amacı",
      content:
        "Topladığımız kişisel veriler; rezervasyon işlemlerinizi gerçekleştirmek, size özel tur önerileri sunmak, müşteri hizmetleri desteği sağlamak ve yasal yükümlülüklerimizi yerine getirmek amacıyla kullanılmaktadır. Verileriniz üçüncü taraflarla pazarlama amacıyla paylaşılmamaktadır.",
    },
    {
      title: "Çerezler ve İzleme Teknolojileri",
      content:
        "Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. Çerezler, tercihlerinizi hatırlamamıza ve site kullanımınızı analiz etmemize yardımcı olur. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu durumda bazı site özellikleri düzgün çalışmayabilir.",
    },
    {
      title: "Veri Güvenliği",
      content:
        "Kişisel verilerinizin güvenliği bizim için son derece önemlidir. Verilerinizi yetkisiz erişim, değişiklik, ifşa veya imhaya karşı korumak için endüstri standardı güvenlik önlemleri uyguluyoruz. SSL şifreleme ve güvenli sunucu altyapısı kullanmaktayız.",
    },
    {
      title: "Haklarınız",
      content:
        "KVKK kapsamında; verilerinize erişim, düzeltme, silme ve işlemenin kısıtlanmasını talep etme haklarına sahipsiniz. Bu haklarınızı kullanmak için info@cyprigo.com adresinden bizimle iletişime geçebilirsiniz.",
    },
    {
      title: "İletişim",
      content:
        "Gizlilik politikamız hakkında sorularınız için info@cyprigo.com e-posta adresi veya +90 392 123 45 67 telefon numarası üzerinden bize ulaşabilirsiniz. Taleplerinize en kısa sürede yanıt vereceğiz.",
    },
  ],
}

const termsContent = {
  sections: [
    {
      title: "Hizmet Şartları",
      content:
        "Cyprigo web sitesini ve hizmetlerini kullanarak bu kullanım şartlarını kabul etmiş sayılırsınız. Hizmetlerimiz yalnızca yasal amaçlarla kullanılmalıdır. Yasadışı veya yetkisiz kullanım kesinlikle yasaktır.",
    },
    {
      title: "Rezervasyon ve İptal Koşulları",
      content:
        "Tur rezervasyonları, onay e-postası gönderildiğinde kesinleşir. İptal talepleri, tur tarihinden en az 48 saat önce yapılmalıdır. Bu süre içinde yapılan iptallerde tam iade sağlanır. Daha geç yapılan iptallerde iade politikamız uygulanır.",
    },
    {
      title: "Ödeme Koşulları",
      content:
        "Tüm ödemeler Türk Lirası veya Euro cinsinden kabul edilmektedir. Kredi kartı, banka havalesi ve nakit ödeme seçenekleri mevcuttur. Online ödemelerde güvenli ödeme altyapısı kullanılmaktadır.",
    },
    {
      title: "Sorumluluk Sınırlaması",
      content:
        "Cyprigo, turlar sırasında meydana gelebilecek kişisel eşya kayıpları, hava koşullarından kaynaklanan değişiklikler veya üçüncü taraf hizmet sağlayıcılarının eylemlerinden sorumlu tutulamaz. Seyahat sigortası yaptırmanızı öneriyoruz.",
    },
    {
      title: "Fikri Mülkiyet",
      content:
        "Web sitemizdeki tüm içerik, görseller, logolar ve tasarımlar Cyprigo'nun fikri mülkiyetidir. İzinsiz kopyalama, dağıtma veya ticari kullanım yasaktır.",
    },
    {
      title: "Değişiklikler",
      content:
        "Cyprigo, bu kullanım şartlarını önceden haber vermeksizin değiştirme hakkını saklı tutar. Güncel şartlar her zaman web sitemizde yayınlanacaktır. Hizmetlerimizi kullanmaya devam etmeniz, değişiklikleri kabul ettiğiniz anlamına gelir.",
    },
  ],
}

export default LegalModal
