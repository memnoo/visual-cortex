"use client";

import { ErrorCallout } from "@/app/components/atoms/ErrorCallout";
import { useParams } from "next/navigation";
import { useDeckWithCards } from "../../hooks/useDecks";
import { Loader } from "@/app/components/atoms/Loader";
import { FlashCardsGrid } from "../components/FlashCardsGrid";
import Button from "@/app/components/atoms/Button";
import { useState } from "react";
import { AddCardModal } from "../../cards/components/AddCardModal";
import { DeckModal } from "../components/DeckModal";
import { BreadcrumbButton } from "../../components/BreadcrumbButton";

export default function DeckPage() {
  const { uuid } = useParams();
  const deckUuid = String(uuid);

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [deckOperation, setDeckOperation] = useState<
    "UPDATE" | "DELETE" | undefined
  >();

  const toggleDeckOperation = (
    operation: "UPDATE" | "DELETE" | undefined,
    closeModal: boolean = false
  ) => {
    setDeckOperation(operation);
    setIsDeckModalOpen(closeModal ? false : true);
  };

  const { data: deckWithCards, isLoading } = useDeckWithCards(deckUuid);

  if (isLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <Loader text="Loading the deck and its cards..." hasAccentColor />
      </div>
    );
  }

  if (!deckWithCards) {
    return <ErrorCallout label="No data available" />;
  }

  const { cards, ...deck } = deckWithCards;

  return (
    <>
      <section className="max-w-8xl mx-auto p-2 flex flex-col gap-2 content-stretch text-left">
        <div className="flex items-center align-stretch gap-2">
          <BreadcrumbButton path="/decks" label="Decks" />
          <div className="ml-auto">
            <div className="flex gap-1">
              <Button
                type="button"
                variant="secondary"
                iconName="edit"
                onClick={() => toggleDeckOperation("UPDATE")}
              />
              <Button
                type="button"
                variant="danger"
                iconName="delete"
                onClick={() => toggleDeckOperation("DELETE")}
              />
            </div>
          </div>
        </div>
        <h2 className="text-xl text-center font-bold my-2">
          {deck.topic}{" "}
          <small className="text-medium font-semibold text-gray-400">
            ({cards.length} cards)
          </small>
        </h2>
        <FlashCardsGrid
          cards={cards}
          onAddFlashCardClicked={() => setIsCardModalOpen(true)}
        />
      </section>

      <AddCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        deckUuid={deck.uuid}
      />

      {deckOperation && (
        <DeckModal
          isOpen={isDeckModalOpen}
          onClose={() => toggleDeckOperation(undefined, true)}
          deckOperation={{ deck, operation: deckOperation }}
        />
      )}
    </>
  );
}
