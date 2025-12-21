import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

import { COOKIE_KEYS } from "@/constants/cookies";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./constants";

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieValue = store.get(COOKIE_KEYS.LOCALE);

  const locale =
    cookieValue?.value &&
    (SUPPORTED_LOCALES as unknown as string[]).includes(cookieValue.value)
      ? cookieValue.value
      : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`./translations/${locale}.json`)).default,
  };
});
