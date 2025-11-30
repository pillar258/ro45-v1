import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from './i18n'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    console.log('Middleware: Pathname is missing locale. Redirecting to default locale.', { pathname, defaultLocale });
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    )
  }
  console.log('Middleware: Pathname has locale.', { pathname });
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}