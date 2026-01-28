import type { Metadata } from "next"
import Link from "next/link"
import { Sora, Space_Grotesk } from "next/font/google"

import "../home/home.css"
import "./blog.css"

import { formatBlogDate } from "@/lib/blog"
import { defaultLocale } from "@/lib/i18n"
import { buildLocaleAlternates, siteConfig } from "@/lib/site"
import {
  getArticleBodyText,
  getFeaturedPost,
  getPublicPosts,
  getRecentPosts,
} from "@/lib/blog-data"
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
  params: Promise<{ locale?: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const safeLocale = locale ?? defaultLocale
  const url = `${baseUrl}/${safeLocale}/blog`
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
      languages: buildLocaleAlternates("/blog"),
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

const getArticleBody = (contentHtml: string) => getArticleBodyText(contentHtml)

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = (await params) as { locale?: string }
  const safeLocale = locale ?? defaultLocale
  const basePath = `/${safeLocale}`
  const publicPosts = await getPublicPosts()
  const featuredPost = await getFeaturedPost()
  const otherFeaturedPosts = featuredPost
    ? publicPosts.filter((post) => post.id !== featuredPost.id).slice(0, 5)
    : publicPosts.slice(0, 5)
  const recentPosts = await getRecentPosts(6, featuredPost?.id)
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
    blogPost: publicPosts.map((post) => ({
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
      articleBody: getArticleBody(post.contentHtml),
    })),
  }

  const hasContent = publicPosts.length > 0

  return (
    <main className={`${sora.variable} ${spaceGrotesk.variable} blog-page`}>
      <Navbar variant="light" />

      <div className="blog-wrapper">
        {!hasContent ? (
          <section className="blog-empty">
            <div className="blog-empty__inner">
              <span className="blog-empty__label">Blog</span>
              <h1 className="blog-empty__title">Henüz içerik yok</h1>
              <p className="blog-empty__text">
                Şu an için yayınlanmış blog yazısı bulunmuyor. Yakında yeni içeriklerle burada olacağız.
              </p>
              <Link href={`${basePath}/home`} className="blog-empty__link">
                ← Ana Sayfaya Dön
              </Link>
            </div>
          </section>
        ) : (
          <>
            {/* Hero Section */}
            <section className="blog-hero">
              <div className="blog-container">
                <div className="hero-grid">
                  {/* Featured Post - Left */}
                  {featuredPost && (
                    <Link href={`${basePath}/blog/${featuredPost.slug}`} className="featured-post">
                      <img
                        src={featuredPost.cover}
                        alt={featuredPost.title}
                        className="featured-post__image"
                      />
                      <div className="featured-post__overlay">
                        <span className="featured-post__category">{featuredPost.category}</span>
                        <h1 className="featured-post__title">{featuredPost.title}</h1>
                      </div>
                    </Link>
                  )}

                  {/* Other Featured Posts - Right */}
                  <div className="other-featured">
                    <h2 className="other-featured__title">Diğer öne çıkan yazılar</h2>
                    <div className="other-featured__list">
                      {otherFeaturedPosts.map((post) => (
                        <Link
                          key={post.slug}
                          href={`${basePath}/blog/${post.slug}`}
                          className="other-featured__item"
                        >
                          <img
                            src={post.cover}
                            alt={post.title}
                            className="other-featured__thumb"
                          />
                          <p className="other-featured__text">{post.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Posts Section */}
            <section className="recent-posts">
              <div className="blog-container">
                <div className="recent-posts__header">
                  <h2 className="recent-posts__title">Son Yazılar</h2>
                  <Link href={`${basePath}/blog`} className="recent-posts__all">
                    Tüm Yazılar
                  </Link>
                </div>

                <div className="posts-grid">
                  {recentPosts.map((post) => (
                    <article key={post.slug} className="post-card">
                      <Link href={`${basePath}/blog/${post.slug}`} className="post-card__link">
                        <div className="post-card__image-wrap">
                          <img
                            src={post.cover}
                            alt={post.title}
                            className="post-card__image"
                            loading="lazy"
                          />
                        </div>
                        <div className="post-card__body">
                          <h3 className="post-card__title">{post.title}</h3>
                          <p className="post-card__excerpt">{post.excerpt}</p>
                          <div className="post-card__meta">
                            <div className="post-card__author">
                              <span className="post-card__avatar">
                                {post.author.charAt(0)}
                              </span>
                              <span className="post-card__author-name">{post.author}</span>
                            </div>
                            <span className="post-card__separator">·</span>
                            <span className="post-card__read-time">{post.readTime}</span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <Footer />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </main>
  )
}
