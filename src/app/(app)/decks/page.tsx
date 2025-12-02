"use client";

import { Loader } from "@/app/components/atoms/Loader";
import { useDecksWithCount } from "../hooks/useDeckNew";
import { Deck } from "../components/Deck";
import { EmptyStateButton } from "../components/EmptyStateButton";
import { useState } from "react";
import { DeckWithCount } from "../types/types";
import DeckModal from "../components/DeckModal";
import { ErrorCallout } from "@/app/components/atoms/ErrorCallout";
import { EmptyState } from "@/app/components/atoms/EmptyState";
import { useRouter } from "next/navigation";

export default function DecksPage() {
  const router = useRouter();
  const { data: decks, isLoading } = useDecksWithCount();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deckOperation, setDeckOperation] = useState<{
    operation: "ADD" | "UPDATE" | "DELETE";
    deck?: DeckWithCount;
  }>({ operation: "ADD" });

  const toggleDeckOperation = (
    operation: "ADD" | "UPDATE" | "DELETE",
    closeModal: boolean = false
  ) => {
    setDeckOperation({ operation });
    setIsModalOpen(closeModal ? false : true);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <Loader text="Chargement de vos decks..." hasAccentColor />
      </div>
    );
  }

  if (!decks) {
    return <ErrorCallout label="Pas de données disponible" />;
  }

  return (
    <>
      <section className="max-w-8xl mx-auto p-2">
        {decks.length === 0 ? (
          <EmptyState label="Vous n'avez pas encore créé de decks.">
            <EmptyStateButton
              label="Créer un deck"
              onClick={() => toggleDeckOperation("ADD")}
            />
          </EmptyState>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div key="add-deck-button" className="w-full h-full">
              <EmptyStateButton
                label="Créer un deck"
                onClick={() => toggleDeckOperation("ADD")}
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
        )}
      </section>
      <DeckModal
        isOpen={isModalOpen}
        onClose={() => toggleDeckOperation("ADD", true)}
        deckOperation={deckOperation}
      />
    </>
  );
}

/**
 * const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeckClick = (deck: any) => {
    setSelectedDeck(deck);
  };

  const [deckOperation, setDeckOperation] = useState<{
    operation: "ADD" | "UPDATE" | "DELETE";
    deck?: DeckWithCount;
  }>({ operation: "ADD" });
  const onDeckOperationClicked = (
    deckUuid: string,
    operation: "UPDATE" | "DELETE"
  ) => {
    const deck = decks.find((d) => d.uuid === deckUuid);

    if (deck) {
      setDeckOperation({ deck, operation });
      setIsModalOpen(true);
    }
  };
 */
