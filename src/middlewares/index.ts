import { NextRequest, NextResponse } from "next/server";

import { middleware as authMiddleware } from "./auth";
import { middleware as i18nMiddleware } from "./i18n";

export async function runMiddlewares(request: NextRequest) {
  await i18nMiddleware(request);
  await authMiddleware(request);

  return NextResponse.next();
}
