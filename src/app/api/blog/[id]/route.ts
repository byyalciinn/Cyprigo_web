import { NextResponse } from "next/server"

import { updatePost, deletePost } from "@/lib/blog-data"

export const runtime = "nodejs"

const allowedStatuses = ["Published", "Scheduled", "Draft"] as const

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const removed = await deletePost(id)
  if (!removed) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
