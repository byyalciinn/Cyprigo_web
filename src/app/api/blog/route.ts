import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import { blogCategories } from "@/lib/blog"
import { createPost, getAllPosts } from "@/lib/blog-data"

export const runtime = "nodejs"

const requireAuth = async (request: NextRequest) => {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const tokenExpiresAt = typeof token?.exp === "number" ? token.exp * 1000 : null
  const sessionExpiresAt =
    typeof token?.sessionExpiresAt === "number" ? token.sessionExpiresAt : null
  const hasAdminRole = !token?.role || token.role === "admin"

  if (
    !token ||
    !hasAdminRole ||
    (tokenExpiresAt && tokenExpiresAt <= Date.now()) ||
    (sessionExpiresAt && sessionExpiresAt <= Date.now())
  ) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }
  return null
}

const getLocalDateISO = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const allowedStatuses = ["Published", "Scheduled", "Draft"] as const

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request)
  if (authResult) return authResult
  const posts = await getAllPosts()
  return NextResponse.json({ posts })
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request)
  if (authResult) return authResult
  try {
    const body = await request.json()
    const slug = String(body?.slug ?? "").trim()
    const title = String(body?.title ?? "").trim()

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Title and slug are required." },
        { status: 400 }
      )
    }

    const status = allowedStatuses.includes(body?.status)
      ? body.status
      : "Draft"

    const post = await createPost({
      id: body?.id,
      slug,
      title,
      excerpt: String(body?.excerpt ?? ""),
      date: String(body?.date ?? getLocalDateISO()),
      readTime: String(body?.readTime ?? ""),
      category: String(body?.category ?? blogCategories[0] ?? "Rotalar"),
      author: String(body?.author ?? "Cyprigo Editoryal"),
      cover: String(body?.cover ?? "/home/hero-luxury.jpg"),
      tags: Array.isArray(body?.tags) ? body.tags.map(String) : [],
      contentHtml: String(body?.contentHtml ?? ""),
      status,
      isFeatured: Boolean(body?.isFeatured),
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create post."
    const status = message.toLowerCase().includes("slug") ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
