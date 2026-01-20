export type BlogSection = {
  heading: string
  paragraphs: string[]
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  author: string
  cover: string
  tags: string[]
  content: BlogSection[]
}

export const blogCategories = [
  "Rotalar",
  "Rehberler",
  "Kültür",
  "Gastronomi",
  "Konaklama",
  "Doğal Keşifler",
]

export const featuredPost: BlogPost = {
  slug: "kuzey-kibrista-48-saat",
  title: "Kuzey Kıbrıs'ta 48 Saat: Premium Rota Rehberi",
  excerpt:
    "Girne'den Bellapais'e uzanan iki günlük programla adanın zarif duraklarını, butik lezzetlerini ve güncel deneyimlerini tek bir rotada toplayın.",
  date: "2024-05-18",
  readTime: "7 dk okuma",
  category: "Rotalar",
  author: "Cyprigo Editoryal",
  cover: "/home/hero-luxury.jpg",
  tags: ["Girne", "Bellapais", "Marina", "Butik Otel"],
  content: [
    {
      heading: "Sabah: Girne sahilinde sakin bir başlangıç",
      paragraphs: [
        "Güne hafif bir kahvaltı ve sahil yürüyüşüyle başlayın. Marina hattındaki kafe durakları, gün ışığını yumuşak alan noktalarıyla fotoğraf için ideal bir atmosfer sunar.",
      ],
    },
    {
      heading: "Öğle: Bellapais'te taş sokaklar ve manastır",
      paragraphs: [
        "Bellapais Manastırı çevresindeki taş sokaklarda kısa bir tur, adanın ruhunu hissetmek için en iyi adımdır. Sessiz avlular ve yerel galeriler, programı dengeli hale getirir.",
      ],
    },
    {
      heading: "Akşam: Marina çevresinde butik lezzetler",
      paragraphs: [
        "Gün batımında marina çevresinde rezervasyonlu bir masa, iki günlük planı zarif bir finalle tamamlar. Yerel mezeler ve deniz ürünleri menüsüyle rutayı kapatabilirsiniz.",
      ],
    },
  ],
}

export const posts: BlogPost[] = [
  {
    slug: "girne-sahilinde-sessiz-saatler",
    title: "Girne Sahilinde Sessiz Saatler ve Premium Duraklar",
    excerpt:
      "Sabah kahvesinden gün batımı kokteyline kadar Girne'nin seçili mekanlarını ve kısa yürüyüş rotalarını toparladık.",
    date: "2024-05-10",
    readTime: "4 dk okuma",
    category: "Rehberler",
    author: "Cyprigo Editoryal",
    cover: "/home/tour-kyrenia.jpg",
    tags: ["Girne", "Sahil", "Kafe"],
    content: [
      {
        heading: "Sahil bandında net bir rota",
        paragraphs: [
          "Günü sahil boyunca üç kısa durakta planlayın. İki ayrı kahve molası ve aralarda kısa yürüyüşlerle tempo dengelenir, kalabalıktan uzak kalırsınız.",
        ],
      },
      {
        heading: "Butik mekan seçimi",
        paragraphs: [
          "Denize yakın butik restoranlar, akşam saatlerinde daha sakin bir deneyim sunar. Rezervasyon yaptırarak gün batımını kaçırmadan keyifli bir kapanış planlayın.",
        ],
      },
    ],
  },
  {
    slug: "gazimagusa-tarihi-doku",
    title: "Gazimağusa'da Tarihi Dokunun İçerisinde Keyifli Bir Gün",
    excerpt:
      "Surlu şehir, kapalı pasajlar ve gizli avlularla dolu bir kültür rotası için kısa ama etkili ipuçları.",
    date: "2024-05-08",
    readTime: "5 dk okuma",
    category: "Kültür",
    author: "Cyprigo Editoryal",
    cover: "/home/tour-famagusta.jpg",
    tags: ["Gazimağusa", "Surlu Şehir", "Tarih"],
    content: [
      {
        heading: "Surlu şehir içinde kontrollü bir yürüyüş",
        paragraphs: [
          "Tarihi sokaklar kısa aralıklarla gölgelenen geçişler sunar. Ana aksı takip ederek hem önemli yapıları görür hem de rotayı kısa tutarsınız.",
        ],
      },
      {
        heading: "Pasajlar ve sahil hattı",
        paragraphs: [
          "Kapalı pasajlar öğleden sonra serinliğiyle iyi bir mola alanıdır. Turun sonunu sahil hattında kısa bir oturma molasıyla tamamlayın.",
        ],
      },
    ],
  },
  {
    slug: "karpaz-dogal-plajlar",
    title: "Karpaz'da Doğal Plajlar ve Fotoğraf Noktaları",
    excerpt:
      "Altın kumsallar, sessiz koylar ve en iyi fotoğraf saatleri için günlük planlama notları.",
    date: "2024-05-05",
    readTime: "6 dk okuma",
    category: "Doğal Keşifler",
    author: "Cyprigo Editoryal",
    cover: "/home/tour-karpaz.jpg",
    tags: ["Karpaz", "Plaj", "Fotoğraf"],
    content: [
      {
        heading: "Geniş kumsallar için zamanlama",
        paragraphs: [
          "Sabah erken saatlerde başlayan bir rota, plajların en sakin halini yakalamanızı sağlar. Güneş yükselmeden önce yürüyüş ve yüzme için ideal bir pencere oluşur.",
        ],
      },
      {
        heading: "Fotoğraf saatleri ve duraklar",
        paragraphs: [
          "Altın saatler için batıya bakan koylar daha dengeli ışık verir. Tripod gerektirmeyen doğal ışığı yakalamak için kısa molalar planlayın.",
        ],
      },
    ],
  },
  {
    slug: "bellapais-butik-galeriler",
    title: "Bellapais ve Çevresinde Butik Galeriler Rotası",
    excerpt:
      "Sanat, mimari ve lokal butiklerle dolu bir yarım günlük plan. Özel duraklar için saatlik rota.",
    date: "2024-05-02",
    readTime: "5 dk okuma",
    category: "Kültür",
    author: "Cyprigo Editoryal",
    cover: "/home/tour-bellapais.jpg",
    tags: ["Bellapais", "Sanat", "Mimari"],
    content: [
      {
        heading: "Galeriler ve atölyeler",
        paragraphs: [
          "Küçük galerilerde yerel sanatçıların işleriyle karşılaşabilirsiniz. Kısa ziyaretlerle programı sıkıştırmadan ilerleyin.",
        ],
      },
      {
        heading: "Manzara molası",
        paragraphs: [
          "Manastır çevresindeki teraslar, dinlenmek için en iyi noktalardır. Hafif bir içecek molasıyla rotayı tamamlayın.",
        ],
      },
    ],
  },
  {
    slug: "kibris-mutfagi-premium-tadim",
    title: "Kıbrıs Mutfağında Premium Tadım Deneyimleri",
    excerpt:
      "Deniz ürünlerinden lokal mezeye uzanan seçkimizle yeni sezonun imza lezzetleri.",
    date: "2024-04-28",
    readTime: "3 dk okuma",
    category: "Gastronomi",
    author: "Cyprigo Editoryal",
    cover: "/home/gallery-room.jpg",
    tags: ["Gastronomi", "Meze", "Deniz Ürünü"],
    content: [
      {
        heading: "Meze ve paylaşım menüleri",
        paragraphs: [
          "Paylaşım tabakları, kısa sürede geniş bir lezzet skalası sunar. Şef önerileriyle menüyü bölmek, zamandan tasarruf sağlar.",
        ],
      },
      {
        heading: "Tatlı ve kahve durakları",
        paragraphs: [
          "Yerel tatlılar için öğleden sonra saatleri idealdir. Kahve ile eşleşen hafif tatlılar, akşam yemeğine geçişi kolaylaştırır.",
        ],
      },
    ],
  },
  {
    slug: "luks-konaklama-secimi",
    title: "Lüks Konaklama Seçerken Dikkat Edilecek 7 Nokta",
    excerpt:
      "Butik otel, spa ve sahil erişimi arasında doğru dengeyi kurmanız için kısa bir rehber.",
    date: "2024-04-25",
    readTime: "5 dk okuma",
    category: "Konaklama",
    author: "Cyprigo Editoryal",
    cover: "/home/gallery-spa.jpg",
    tags: ["Butik Otel", "Spa", "Sahil"],
    content: [
      {
        heading: "Konum ve erişim",
        paragraphs: [
          "Merkeze yakın ama sakin bölgeler, gün içi planlamayı kolaylaştırır. Transfer sürelerini kontrol ederek programı dengede tutabilirsiniz.",
        ],
      },
      {
        heading: "Hizmet standardı",
        paragraphs: [
          "Spa, özel transfer ve concierge hizmetleri konforu belirler. Kısa bir liste ile beklentilerinizi netleştirmeniz seçim süresini kısaltır.",
        ],
      },
    ],
  },
]

export const allPosts = [featuredPost, ...posts]

export const getPostBySlug = (slug: string) =>
  allPosts.find((post) => post.slug === slug)

export const getRecentPosts = (count = 4) => allPosts.slice(0, count)

export const getSimilarPosts = (slug: string, count = 3) =>
  posts.filter((post) => post.slug !== slug).slice(0, count)

export const formatBlogDate = (dateString: string, locale = "tr-TR") =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString))
