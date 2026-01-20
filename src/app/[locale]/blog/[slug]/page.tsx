import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Sora, Space_Grotesk } from "next/font/google"

import "../../home/home.css"
import "../blog.css"

import {
  allPosts,
  blogCategories,
  formatBlogDate,
  getPostBySlug,
  getRecentPosts,
  getSimilarPosts,
} from "@/lib/blog"
import { defaultLocale, locales } from "@/lib/i18n"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
})

const baseUrl = "https://cyprigo.com"

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    allPosts.map((post) => ({
      locale,
      slug: post.slug,
    }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Cyprigo Blog",
      description: "Cyprigo blog içerikleri.",
    }
  }

  const url = `${baseUrl}/${params.locale}/blog/${post.slug}`

  return {
    title: `${post.title} | Cyprigo Blog`,
    description: post.excerpt,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: "Cyprigo",
      type: "article",
      images: [
        {
          url: post.cover,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.cover],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

const getArticleBody = (post: ReturnType<typeof getPostBySlug>) =>
  post ? post.content.flatMap((section) => section.paragraphs).join(" ") : ""

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = (await params) as { locale?: string; slug?: string }
  const safeLocale = locale ?? defaultLocale
  const safeSlug = slug ?? ""
  const post = getPostBySlug(safeSlug)

  if (!post) {
    notFound()
  }

  const basePath = `/${safeLocale}`
  const localeTag = safeLocale === "en" ? "en-US" : "tr-TR"
  const recentPosts = getRecentPosts(5)
    .filter((item) => item.slug !== post.slug)
    .slice(0, 4)
  const similarPosts = getSimilarPosts(post.slug, 3)

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    image: `${baseUrl}${post.cover}`,
    mainEntityOfPage: `${baseUrl}/${safeLocale}/blog/${post.slug}`,
    articleBody: getArticleBody(post),
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
              <Link href={`${basePath}/blog`} className="hover:text-foreground">
                Blog
              </Link>
              <Link href={`${basePath}/auth`} className="hover:text-foreground">
                Giriş Yap
              </Link>
            </nav>
          </div>
        </header>

        <section className="section-padding pb-10">
          <div className="container mx-auto px-6">
            <div className="space-y-5">
              <nav
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
              >
                <Link href={`${basePath}/home`} className="hover:text-foreground">
                  Cyprigo
                </Link>
                <span className="text-muted-foreground/50">/</span>
                <Link href={`${basePath}/blog`} className="hover:text-foreground">
                  Blog
                </Link>
                <span className="text-muted-foreground/50">/</span>
                <span className="text-foreground">{post.category}</span>
              </nav>
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                <Link href={`${basePath}/blog`} className="hover:text-foreground">
                  Bloga Dön
                </Link>
                <span className="text-muted-foreground/50">/</span>
                <span>{post.category}</span>
              </div>
              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
                <div className="space-y-6">
                  <span className="blog-tag">{post.category}</span>
                  <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                    {post.title}
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <time dateTime={post.date}>
                      {formatBlogDate(post.date, localeTag)}
                    </time>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span>{post.readTime}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="blog-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="blog-card overflow-hidden">
                  <img
                    src={post.cover}
                    alt={`${post.title} görseli`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-[2.1fr_0.9fr] gap-10">
              <article className="space-y-10">
                {post.content.map((section) => (
                  <div key={section.heading} className="space-y-3">
                    <h2 className="text-2xl font-semibold">{section.heading}</h2>
                    {section.paragraphs.map((paragraph, index) => (
                      <p
                        key={`${section.heading}-${index}`}
                        className="text-muted-foreground leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}

                <div className="blog-divider" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="blog-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>

              <aside className="space-y-6">
                <div className="blog-card p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Son Yazılar
                  </p>
                  <div className="mt-5 space-y-4">
                    {recentPosts.map((item) => (
                      <div key={item.slug} className="space-y-2">
                        <Link
                          href={`${basePath}/blog/${item.slug}`}
                          className="text-base font-semibold text-foreground hover:text-foreground/80"
                        >
                          {item.title}
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <time dateTime={item.date}>
                            {formatBlogDate(item.date, localeTag)}
                          </time>
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                          <span>{item.readTime}</span>
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

        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="space-y-3 mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Benzer Bloglar
              </p>
              <h2 className="text-3xl font-semibold">Okumaya devam edin</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarPosts.map((item) => (
                <article key={item.slug}>
                  <Link
                    href={`${basePath}/blog/${item.slug}`}
                    className="blog-card overflow-hidden h-full flex flex-col"
                  >
                    <div className="relative aspect-[4/3]">
                      <img
                        src={item.cover}
                        alt={`${item.title} görseli`}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <span className="blog-tag">{item.category}</span>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold leading-snug text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <time dateTime={item.date}>
                          {formatBlogDate(item.date, localeTag)}
                        </time>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                        <span>{item.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
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
