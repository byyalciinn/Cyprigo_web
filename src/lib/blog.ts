export type BlogStatus = "Published" | "Scheduled" | "Draft"

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  author: string
  cover: string
  tags: string[]
  contentHtml: string
  status: BlogStatus
  isFeatured?: boolean
  createdAt?: string
  updatedAt?: string
}

export const blogCategories = [
  "Rotalar",
  "Rehberler",
  "Kültür",
  "Gastronomi",
  "Konaklama",
  "Doğal Keşifler",
]

export const formatBlogDate = (dateString: string, locale = "tr-TR") =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString))
