"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Loader } from "@/app/components/atoms/Loader";
import { useDecksWithCount } from "../hooks/useDecks";
import { EmptyStateButton } from "../components/EmptyStateButton";
import { ErrorCallout } from "@/app/components/atoms/ErrorCallout";
import { DeckModal } from "./components/DeckModal";
import { Deck } from "./components/Deck";
import { BreadcrumbButton } from "../components/BreadcrumbButton";

export default function DecksPage() {
  const t = useTranslations();
  const router = useRouter();
  const { data: decks = [], isLoading } = useDecksWithCount();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center w-full">
        <Loader text={t("decks.loadingTexts.deckAndCards")} hasAccentColor />
      </div>
    );
  }

  if (!decks) {
    return <ErrorCallout label="No data available" />;
  }

  return (
    <>
      <section className="flex flex-col gap-3 content-stretch w-full">
        <BreadcrumbButton path="/dashboard" label={t("misc.dashboard")} />
        <div className="grid grid-cols-2 gap-3 auto-rows-fr">
          <div key="add-deck-button" className="w-full h-full">
            <EmptyStateButton
              label={t("decks.management.ctas.addDeck")}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          {decks.map((d) => (
            <Deck
              key={d.uuid}
              deck={d}
              onClick={() => router.push(`/decks/${d.uuid}`)}
            />
          ))}
        </div>
      </section>
      <DeckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deckOperation={{ operation: "ADD" }}
      />
    </>
  );
}
