"use client";

import { useTranslations } from "next-intl";

import { useFooterCounts } from "../hooks/useFooterCounts";

export const Footer = () => {
  const t = useTranslations();

  const { data, isLoading } = useFooterCounts();

  const PLACEHOLDER = "...";

  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col content-stretch gap-1">
            <p className="text-3xl font-bold text-indigo-600">
              {isLoading ? PLACEHOLDER : data?.users}
            </p>
            <p className="text-sm text-gray-600">{t("footer.users")}</p>
          </div>
          <div className="flex flex-col content-stretch gap-1">
            <p className="text-3xl font-bold text-purple-600">
              {isLoading ? PLACEHOLDER : data?.decks}
            </p>
            <p className="text-sm text-gray-600">{t("footer.decks")}</p>
          </div>
          <div className="flex flex-col content-stretch gap-1">
            <p className="text-3xl font-bold text-pink-600">
              {isLoading ? PLACEHOLDER : data?.cards}
            </p>
            <p className="text-sm text-gray-600">{t("footer.cards")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
