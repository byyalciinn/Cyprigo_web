import type { Metadata } from "next"
import Link from "next/link"
import { Sora, Space_Grotesk } from "next/font/google"

import "../home/home.css"
import "./blog.css"

import {
  allPosts,
  blogCategories,
  featuredPost,
  formatBlogDate,
  getRecentPosts,
  posts,
} from "@/lib/blog"
import { defaultLocale } from "@/lib/i18n"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
})

const baseUrl = "https://cyprigo.com"

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = params?.locale ?? "tr"
  const url = `${baseUrl}/${locale}/blog`
  const title = "Cyprigo Blog | Kuzey Kıbrıs Seyahat Rehberleri"
  const description =
    "Kuzey Kıbrıs turları, premium konaklama, gastronomi ve kültür için güncel rehberler. Cyprigo editoryal önerileri."

  return {
    title,
    description,
    keywords: [
      "Kuzey Kıbrıs blog",
      "Kıbrıs seyahat rehberi",
      "premium turlar",
      "Girne",
      "Gazimağusa",
      "Karpaz",
      "Cyprigo",
    ],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Cyprigo",
      type: "website",
      images: [
        {
          url: "/home/hero-luxury.jpg",
          width: 1200,
          height: 630,
          alt: "Cyprigo premium Kuzey Kıbrıs turları",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/home/hero-luxury.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

const getArticleBody = (post: typeof featuredPost) =>
  post.content.flatMap((section) => section.paragraphs).join(" ")

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = (await params) as { locale?: string }
  const safeLocale = locale ?? defaultLocale
  const basePath = `/${safeLocale}`
  const recentPosts = getRecentPosts(4)
  const localeTag = safeLocale === "en" ? "en-US" : "tr-TR"

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Cyprigo Blog",
    url: `${baseUrl}/${safeLocale}/blog`,
    description:
      "Kuzey Kıbrıs turları, premium konaklama ve kültür deneyimleri için editoryal rehberler.",
    publisher: {
      "@type": "Organization",
      name: "Cyprigo",
      url: baseUrl,
    },
    blogPost: allPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: `${baseUrl}/${safeLocale}/blog/${post.slug}`,
      author: {
        "@type": "Organization",
        name: post.author,
      },
      image: `${baseUrl}${post.cover}`,
      articleBody: getArticleBody(post),
    })),
  }

  return (
    <main
      className={`${sora.variable} ${spaceGrotesk.variable} transfer-theme blog-shell bg-background text-foreground`}
    >
      <div className="blog-content">
        <header className="sticky top-0 z-40 border-b border-border/20 bg-transparent">
          <div className="container mx-auto px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              href={`${basePath}/home`}
              className="text-2xl md:text-3xl font-display italic font-semibold text-foreground"
            >
              Cyprigo
            </Link>
            <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-muted-foreground">
              <Link href={`${basePath}/home`} className="hover:text-foreground">
                Ana Sayfa
              </Link>
              <Link href={`${basePath}/home#tours`} className="hover:text-foreground">
                Turlar
              </Link>
              <Link
                href={`${basePath}/blog`}
                aria-current="page"
                className="text-foreground"
              >
                Blog
              </Link>
              <Link href={`${basePath}/auth`} className="hover:text-foreground">
                Giriş Yap
              </Link>
            </nav>
          </div>
        </header>

        <section className="section-padding pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl space-y-5">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Cyprigo Blog
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
                Kuzey Kıbrıs'ta premium rota notları ve seçili deneyimler
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Sezonluk rehberler, kısa planlar ve yerel önerilerle yolculuğunuzu
                sadeleştiriyoruz. Her içerik, detaylı rota notlarıyla net bir
                plan sunar.
              </p>
            </div>

            <Link
              href={`${basePath}/blog/${featuredPost.slug}`}
              className="blog-card mt-12 grid overflow-hidden lg:grid-cols-[1.15fr_0.85fr]"
            >
              <div className="relative min-h-[260px] md:min-h-[320px] lg:min-h-[360px]">
                <img
                  src={featuredPost.cover}
                  alt="Kuzey Kıbrıs premium rota görseli"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="p-7 md:p-10 space-y-5">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="blog-tag">{featuredPost.category}</span>
                  <time dateTime={featuredPost.date}>
                    {formatBlogDate(featuredPost.date, localeTag)}
                  </time>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <span>{featuredPost.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-[1.2] tracking-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {featuredPost.tags.map((tag) => (
                    <span key={tag} className="blog-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-[2.1fr_0.9fr] gap-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Blog Koleksiyonu
                  </p>
                  <h2 className="text-3xl font-semibold">Diğer blog yazıları</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <article key={post.slug}>
                      <Link
                        href={`${basePath}/blog/${post.slug}`}
                        className="blog-card overflow-hidden h-full flex flex-col"
                      >
                        <div className="relative aspect-[4/3]">
                          <img
                            src={post.cover}
                            alt={`${post.title} görseli`}
                            className="absolute inset-0 h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-6 space-y-4">
                          <span className="blog-tag">{post.category}</span>
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold leading-snug text-foreground">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <time dateTime={post.date}>
                              {formatBlogDate(post.date, localeTag)}
                            </time>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="space-y-6">
                <div className="blog-card p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Son Yazılar
                  </p>
                  <div className="mt-5 space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.slug} className="space-y-2">
                        <Link
                          href={`${basePath}/blog/${post.slug}`}
                          className="text-base font-semibold text-foreground hover:text-foreground/80"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <time dateTime={post.date}>
                            {formatBlogDate(post.date, localeTag)}
                          </time>
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                          <span>{post.readTime}</span>
                        </div>
                        <div className="blog-divider" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="blog-card p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Konular
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {blogCategories.map((topic) => (
                      <span key={topic} className="blog-chip">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="blog-card p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Bülten
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Yeni rotalar ve güncel öneriler için kısa bültenimize katılın.
                  </p>
                  <form className="mt-4 space-y-3">
                    <input
                      className="blog-input"
                      type="email"
                      placeholder="E-posta adresiniz"
                      aria-label="Bülten e-postası"
                    />
                    <button
                      type="button"
                      className="w-full rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                    >
                      Abone Ol
                    </button>
                  </form>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <footer className="blog-footer pb-10">
          <div className="container mx-auto px-6">
            <div className="grid gap-12 py-14 lg:grid-cols-[1.4fr_0.7fr_1fr]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-3xl font-display italic font-semibold text-foreground">
                    Cyprigo
                  </span>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Premium Kuzey Kıbrıs Turları
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                  Cyprigo, Kuzey Kıbrıs'ın seçili rotalarını, butik konaklama
                  önerilerini ve özel deneyimleri bir araya getirir.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="#" className="blog-footer-pill">
                    Instagram
                  </Link>
                  <Link href="#" className="blog-footer-pill">
                    YouTube
                  </Link>
                  <Link href="#" className="blog-footer-pill">
                    Facebook
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hızlı Linkler</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <Link href={`${basePath}/home`} className="hover:text-foreground">
                      Ana Sayfa
                    </Link>
                  </li>
                  <li>
                    <Link href={`${basePath}/home#tours`} className="hover:text-foreground">
                      Turlar
                    </Link>
                  </li>
                  <li>
                    <Link href={`${basePath}/blog`} className="hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href={`${basePath}/privacy-policy`} className="hover:text-foreground">
                      Gizlilik Politikası
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-5">
                <h3 className="text-lg font-semibold">Bize Ulaşın</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>Adres: Girne, Kuzey Kıbrıs</p>
                  <p>Telefon: +90 392 123 45 67</p>
                  <p>E-posta: info@cyprigo.com</p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Bülten
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      className="blog-footer-input flex-1 min-w-[220px]"
                      type="email"
                      placeholder="E-posta adresiniz"
                      aria-label="Bülten e-postası"
                    />
                    <button type="button" className="blog-footer-button">
                      Gönder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="blog-footer-divider" />
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6 text-xs text-muted-foreground">
              <p>© 2025 Cyprigo. Tüm hakları saklıdır.</p>
              <p>Design by Cyprigo Studio - 2025</p>
            </div>
          </div>
        </footer>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </main>
  )
}
