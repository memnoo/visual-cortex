import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { COOKIE_KEYS } from "@/constants/cookies";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/i18n/constants";

const intlMiddleware = createMiddleware({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localeDetection: true,
  localeCookie: { name: COOKIE_KEYS.LOCALE },
  localePrefix: "never",
});

export async function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Check for lang parameter in URL
  const langParam = searchParams.get("lang");

  if (langParam && SUPPORTED_LOCALES.includes(langParam as any)) {
    // Remove lang param from URL and redirect to clean URL
    const url = new URL(request.url);
    url.searchParams.delete("lang");

    const response = NextResponse.redirect(url);
    response.cookies.set(COOKIE_KEYS.LOCALE, langParam, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    return response;
  }

  return intlMiddleware(request);
}
