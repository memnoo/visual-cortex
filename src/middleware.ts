import { NextRequest } from "next/server";

import { runMiddlewares } from "./middlewares";

export function middleware(request: NextRequest) {
  return runMiddlewares(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
