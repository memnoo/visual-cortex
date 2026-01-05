import { NextRequest, NextResponse } from "next/server";

import { middleware as authMiddleware } from "./auth";
import { middleware as i18nMiddleware } from "./i18n";

export async function runMiddlewares(request: NextRequest) {
  let response: NextResponse | undefined;

  response = await i18nMiddleware(request);
  if (response && response.status !== 200) return response;

  response = await authMiddleware(request);
  if (response && response.status !== 200) return response;

  return NextResponse.next();
}
