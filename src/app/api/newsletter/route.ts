import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import { addSubscriber, getSubscribers } from "@/lib/newsletter-data"

export const runtime = "nodejs"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(request: NextRequest) {
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
  const subscribers = await getSubscribers()
  return NextResponse.json({ subscribers })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = String(body?.email ?? "").trim()
    const source = typeof body?.source === "string" ? body.source : undefined

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      )
    }

    const result = await addSubscriber(email, source)
    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to save subscriber."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
