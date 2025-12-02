"use client";

import { Loader } from "@/app/components/atoms/Loader";
import { useDecksWithCount } from "../hooks/useDeckNew";
import { EmptyStateButton } from "../components/EmptyStateButton";
import { useState } from "react";
import { ErrorCallout } from "@/app/components/atoms/ErrorCallout";
import { useRouter } from "next/navigation";
import { DeckModal } from "./components/DeckModal";
import { Deck } from "./components/Deck";

export default function DecksPage() {
  const router = useRouter();
  const { data: decks = [], isLoading } = useDecksWithCount();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <Loader text="Loading your decks..." hasAccentColor />
      </div>
    );
  }

  if (!decks) {
    return <ErrorCallout label="No data available" />;
  }

  return (
    <>
      <section className="max-w-8xl mx-auto p-2">
        <div className="grid grid-cols-2 gap-3">
          <div key="add-deck-button" className="w-full h-full">
            <EmptyStateButton
              label="Add a deck"
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
