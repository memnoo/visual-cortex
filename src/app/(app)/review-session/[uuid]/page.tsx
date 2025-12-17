"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import classNames from "classnames";

import { useDeckWithCards } from "../../hooks/useDecks";
import { Loader } from "@/app/components/atoms/Loader";
import { BreadcrumbButton } from "../../components/BreadcrumbButton";
import { EmptyState } from "@/app/components/atoms/EmptyState";
import { CardSwiper, ReviewSessionState } from "../components/CardSwiper";
import Button from "@/app/components/atoms/Button";
import { useState } from "react";

export default function ReviewDeckPage() {
  const { uuid } = useParams();
  const deckUuid = String(uuid);

  const { data: deckWithCards, isLoading } = useDeckWithCards(deckUuid);
  const { cards } = deckWithCards ?? {};
  const [stats, setStats] = useState<ReviewSessionState>({
    correct: 0,
    incorrect: 0,
    hintUsed: 0,
    skipped: 0,
    remaining: (cards ?? []).length,
  });

  if (isLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <Loader text="Loading cards to review..." hasAccentColor />
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
          ← Back to decks
        </Link>
      </EmptyState>
    );
  }

  if (!cards || cards.length === 0) {
    return <EmptyStateReview />;
  }

  return (
    <div className="flex flex-col content-stretch gap-2 w-full">
      <div className="flex items-center justify-stretch gap-4">
        <BreadcrumbButton path="/review-session" label="Back" />
        <div className="flex flex-col text-end ml-auto">
          <small className="text-gray-500 text-xs">Reviewing</small>
          <h1 className="text-lg font-bold text-gray-900">
            {deckWithCards.topic}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
        <div className="px-4 py-2 flex items-center">
          <div className="flex items-center justify-between gap-6 w-full">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats?.remaining ?? cards.length}
              </div>
              <div className="text-xs text-gray-600">Remaining</div>
            </div>
            <div className="flex flex-col content-stretch text-left">
              <p
                className={classNames("text-sm text-gray-600", {
                  "font-bold text-green-700": stats.correct > 0,
                })}
              >
                {stats.correct} Correct
              </p>
              <p
                className={classNames("text-sm text-gray-600", {
                  "font-bold text-red-800": stats.incorrect > 0,
                })}
              >
                {stats.incorrect} Incorrect
              </p>
              <p
                className={classNames("text-sm text-gray-600", {
                  "font-bold text-yellow-600": stats.hintUsed > 0,
                })}
              >
                {stats.hintUsed} Hints Used
              </p>
            </div>
            <div className="text-center">
              <Button variant="ghost" iconName="back" />
              <div className="text-xs text-gray-600">Restart</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 mt-12">
        <CardSwiper
          cards={cards}
          onActionPerformed={(action, reviewSessionState) => {
            setStats(reviewSessionState);
          }}
        />
      </div>
    </div>
  );
}

const EmptyStateReview = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <p className="text-2xl font-semibold text-gray-700 mb-4">
        No card to review for now
      </p>
      <Link
        href="/review-session"
        className="text-indigo-600 hover:text-indigo-700 font-medium"
      >
        ← Back to decks
      </Link>
    </div>
  </div>
);
