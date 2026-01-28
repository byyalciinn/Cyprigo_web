import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

import { defaultLocale, isLocale } from "@/lib/i18n"

const adminPathRegex = /^\/(tr|en)\/admin(\/|$)/

export async function middleware(req: NextRequest) {
  const { nextUrl } = req
  const { pathname, search } = nextUrl

  if (!adminPathRegex.test(pathname)) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const tokenExpiresAt =
    typeof token?.exp === "number" ? token.exp * 1000 : null
  const sessionExpiresAt = typeof token?.sessionExpiresAt === "number"
    ? token.sessionExpiresAt
    : null
  const hasAdminRole = !token?.role || token.role === "admin"
  const isValidSession =
    Boolean(token) &&
    hasAdminRole &&
    (!tokenExpiresAt || tokenExpiresAt > Date.now()) &&
    (!sessionExpiresAt || sessionExpiresAt > Date.now())

  if (isValidSession) {
    return NextResponse.next()
  }

  const localeSegment = pathname.split("/")[1]
  const locale = isLocale(localeSegment) ? localeSegment : defaultLocale
  const callbackUrl = `${pathname}${search}`
  const signInUrl = new URL(`/${locale}/auth`, nextUrl)
  signInUrl.searchParams.set("callbackUrl", callbackUrl)

  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: ["/(tr|en)/admin/:path*"],
}
