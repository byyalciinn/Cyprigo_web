import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["tr", "en"]
const defaultLocale = "tr"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if pathname is exactly a locale (e.g., /tr or /en)
  const isLocaleRoot = locales.some(
    (locale) => pathname === `/${locale}` || pathname === `/${locale}/`
  )

  // Redirect locale root to home
  if (isLocaleRoot) {
    const locale = pathname.replace(/^\//, "").replace(/\/$/, "")
    return NextResponse.redirect(new URL(`/${locale}/home`, request.url))
  }

  // Redirect root to default locale home
  if (pathname === "/" || pathname === "") {
    return NextResponse.redirect(new URL(`/${defaultLocale}/home`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match root and locale roots
    "/",
    "/tr",
    "/tr/",
    "/en",
    "/en/",
  ],
}
