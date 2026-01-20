import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

import type { BlogPost, BlogStatus } from "./blog"

type BlogData = {
  posts: BlogPost[]
}

const dataDir = path.join(process.cwd(), "data")
const dataFile = path.join(dataDir, "blog-posts.json")

const ensureDataFile = async () => {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(dataFile)
  } catch {
    const empty: BlogData = { posts: [] }
    await fs.writeFile(dataFile, JSON.stringify(empty, null, 2))
  }
}

const readBlogData = async (): Promise<BlogData> => {
  await ensureDataFile()
  const raw = await fs.readFile(dataFile, "utf8")
  const parsed = JSON.parse(raw) as BlogData
  return { posts: Array.isArray(parsed.posts) ? parsed.posts : [] }
}

const writeBlogData = async (data: BlogData) => {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2))
}

const getLocalDateISO = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const normalizePosts = (posts: BlogPost[]) =>
  posts.map((post) => ({
    ...post,
    tags: Array.isArray(post.tags) ? post.tags : [],
    status: (post.status || "Draft") as BlogStatus,
  }))

const sortByDateDesc = (a: BlogPost, b: BlogPost) =>
  b.date.localeCompare(a.date)

const markScheduledAsPublished = async (data: BlogData) => {
  const today = getLocalDateISO()
  let changed = false
  const nextPosts = data.posts.map((post) => {
    if (post.status === "Scheduled" && post.date && post.date <= today) {
      changed = true
      return { ...post, status: "Published" as const }
    }
    return post
  })

  if (!changed) return data

  const updated = {
    posts: nextPosts,
  }
  await writeBlogData(updated)
  return updated
}

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

export const getAllPosts = async () => {
  const data = await readBlogData()
  const normalized = { posts: normalizePosts(data.posts) }
  const updated = await markScheduledAsPublished(normalized)
  return [...updated.posts].sort(sortByDateDesc)
}

export const getPublicPosts = async () => {
  const posts = await getAllPosts()
  return posts.filter((post) => post.status === "Published")
}

export const getFeaturedPost = async () => {
  const posts = await getPublicPosts()
  return posts.find((post) => post.isFeatured) ?? posts[0] ?? null
}

export const getRecentPosts = async (count = 4, excludeId?: string) => {
  const posts = await getPublicPosts()
  const filtered = excludeId ? posts.filter((post) => post.id !== excludeId) : posts
  return filtered.slice(0, count)
}

export const getSimilarPosts = async (slug: string, count = 3) => {
  const posts = await getPublicPosts()
  const current = posts.find((post) => post.slug === slug)
  if (!current) {
    return posts.filter((post) => post.slug !== slug).slice(0, count)
  }
  const sameCategory = posts.filter(
    (post) => post.slug !== slug && post.category === current.category
  )
  return (sameCategory.length ? sameCategory : posts.filter((post) => post.slug !== slug)).slice(
    0,
    count
  )
}

export const getPostBySlug = async (
  slug: string,
  options: { includeDrafts?: boolean } = {}
) => {
  const posts = options.includeDrafts ? await getAllPosts() : await getPublicPosts()
  return posts.find((post) => post.slug === slug) ?? null
}

export const getArticleBodyText = (html: string) => stripHtml(html)

export const createPost = async (
  input: Omit<BlogPost, "id" | "createdAt" | "updatedAt"> & { id?: string }
) => {
  const data = await readBlogData()
  const normalized = normalizePosts(data.posts)
  const slug = input.slug.trim()
  if (!slug) {
    throw new Error("Slug is required.")
  }
  const slugExists = normalized.some((post) => post.slug === slug)
  if (slugExists) {
    throw new Error("Slug already exists.")
  }

  const now = new Date().toISOString()
  const post: BlogPost = {
    ...input,
    id: input.id ?? `post-${randomUUID()}`,
    slug,
    status: (input.status || "Draft") as BlogStatus,
    createdAt: now,
    updatedAt: now,
  }

  const posts = post.isFeatured
    ? normalized.map((item) => ({ ...item, isFeatured: false }))
    : normalized

  const next = { posts: [post, ...posts] }
  await writeBlogData(next)
  return post
}

export const updatePost = async (id: string, updates: Partial<BlogPost>) => {
  const data = await readBlogData()
  const normalized = normalizePosts(data.posts)
  const index = normalized.findIndex((post) => post.id === id)
  if (index === -1) return null

  const nextSlug = updates.slug?.trim() ?? normalized[index].slug
  const slugExists = normalized.some(
    (post) => post.slug === nextSlug && post.id !== id
  )
  if (slugExists) {
    throw new Error("Slug already exists.")
  }

  const now = new Date().toISOString()
  const nextPost = {
    ...normalized[index],
    ...updates,
    slug: nextSlug,
    updatedAt: now,
  }

  const posts = normalized.map((post, idx) =>
    idx === index ? nextPost : post
  )

  const finalPosts = nextPost.isFeatured
    ? posts.map((post) =>
        post.id === nextPost.id ? post : { ...post, isFeatured: false }
      )
    : posts

  await writeBlogData({ posts: finalPosts })
  return nextPost
}

export const deletePost = async (id: string) => {
  const data = await readBlogData()
  const normalized = normalizePosts(data.posts)
  const nextPosts = normalized.filter((post) => post.id !== id)
  if (nextPosts.length === normalized.length) return false
  await writeBlogData({ posts: nextPosts })
  return true
}
