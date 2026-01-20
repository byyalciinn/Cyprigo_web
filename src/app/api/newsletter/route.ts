import { NextResponse } from "next/server"

import { addSubscriber, getSubscribers } from "@/lib/newsletter-data"

export const runtime = "nodejs"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET() {
  const subscribers = await getSubscribers()
  return NextResponse.json({ subscribers })
}

export async function POST(request: Request) {
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
