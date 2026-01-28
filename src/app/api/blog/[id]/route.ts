import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import { updatePost, deletePost } from "@/lib/blog-data"

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

const allowedStatuses = ["Published", "Scheduled", "Draft"] as const

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request)
  if (authResult) return authResult
  try {
    const { id } = await params
    const body = await request.json()
    const updates = {
      ...body,
    }

    if (typeof updates.slug === "string") {
      updates.slug = updates.slug.trim()
      if (!updates.slug) {
        return NextResponse.json(
          { error: "Slug is required." },
          { status: 400 }
        )
      }
    }

    if (updates.status && !allowedStatuses.includes(updates.status)) {
      updates.status = "Draft"
    }

    const post = await updatePost(id, updates)
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update post."
    const status = message.toLowerCase().includes("slug") ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request)
  if (authResult) return authResult
  const { id } = await params
  const removed = await deletePost(id)
  if (!removed) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
