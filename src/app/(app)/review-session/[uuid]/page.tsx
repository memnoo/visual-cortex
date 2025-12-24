"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useDeckWithCards } from "../../hooks/useDecks";

import { Loader } from "@/app/components/atoms/Loader";
import { BreadcrumbButton } from "../../components/BreadcrumbButton";
import { EmptyState } from "@/app/components/atoms/EmptyState";
import { ReviewSession } from "./components/ReviewSession";

export default function ReviewDeckPage() {
  const t = useTranslations();
  const { uuid } = useParams();
  const deckUuid = String(uuid);

  const { data: deckWithCards, isLoading } = useDeckWithCards(deckUuid);
  const { cards } = deckWithCards ?? {};

  if (isLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center w-full">
        <Loader text={t("reviews.session.loading.bootstrap")} hasAccentColor />
      </div>
    );
  }

  if (!deckWithCards) {
    return (
      <EmptyState label="Deck not found">
        <Link
          href="/review-session"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {t("reviews.placeholderState.linkText")}
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col content-stretch gap-2 w-full">
      <div className="flex items-center justify-stretch gap-4">
        <BreadcrumbButton path="/review-session" label="Back" />
        <div className="flex flex-col text-end ml-auto">
          <small className="text-gray-500 text-xs">
            {t("reviews.session.reviewing")}
          </small>
          <h1 className="text-lg font-bold text-gray-900">
            {deckWithCards.topic}
          </h1>
        </div>
      </div>

      <ReviewSession cards={cards ?? []} />
    </div>
  );
}
