import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Sora, Space_Grotesk } from "next/font/google"

import "../../home/home.css"
import "../blog.css"

import { blogCategories, formatBlogDate } from "@/lib/blog"
import { defaultLocale } from "@/lib/i18n"
import { buildLocaleAlternates, siteConfig } from "@/lib/site"
import {
  getArticleBodyText,
  getPostBySlug,
  getRecentPosts,
  getSimilarPosts,
} from "@/lib/blog-data"
import { NewsletterForm } from "@/components/blog/NewsletterForm"
import Footer from "@/components/home/Footer"
import Navbar from "@/components/home/Navbar"

export const dynamic = "force-dynamic"

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
})

const baseUrl = siteConfig.url

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

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
      languages: buildLocaleAlternates(`/blog/${post.slug}`),
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

const getArticleBody = (contentHtml: string) => getArticleBodyText(contentHtml)

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = (await params) as { locale?: string; slug?: string }
  const safeLocale = locale ?? defaultLocale
  const safeSlug = slug ?? ""
  const post = await getPostBySlug(safeSlug)

  if (!post) {
    notFound()
  }

  const basePath = `/${safeLocale}`
  const localeTag = safeLocale === "en" ? "en-US" : "tr-TR"
  const recentPosts = (await getRecentPosts(5, post.id)).slice(0, 4)
  const similarPosts = await getSimilarPosts(post.slug, 3)

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
    articleBody: getArticleBody(post.contentHtml),
  }

  return (
    <main
      className={`${sora.variable} ${spaceGrotesk.variable} transfer-theme blog-shell bg-background text-foreground`}
    >
      <Navbar variant="light" />
      <div className="blog-content pt-24">

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
                <div
                  className="blog-article"
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />

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
                  <NewsletterForm
                    variant="stacked"
                    source={`${basePath}/blog/${post.slug}`}
                    submitLabel="Abone Ol"
                    className="mt-4"
                  />
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

        <Footer />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </main>
  )
}
