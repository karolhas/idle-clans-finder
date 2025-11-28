import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Stare domeny, które mają być przekierowane
  const oldDomains = ["idleclansfinder.vercel.app", "icfinder.vercel.app"];
  // Nowa domena docelowa
  const newDomain = "idleclanshub.vercel.app";

  // Sprawdź czy wejście jest z jednej ze starych domen
  if (oldDomains.includes(hostname)) {
    const url = request.nextUrl.clone();
    url.hostname = newDomain;
    url.protocol = "https";

    // Przekierowanie 301 (Permanent Redirect)
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Dopasuj wszystkie ścieżki z wyjątkiem:
     * - api (API routes)
     * - _next/static (pliki statyczne)
     * - _next/image (optymalizacja obrazów)
     * - favicon.ico (ikona)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
