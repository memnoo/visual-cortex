"use client";

import { useState } from "react";
import { Deck as DeckModel } from "../../types/types";
import { Deck } from "../../components/Deck";
import { useCards } from "../../hooks/useCards";
import Flashcard from "../../components/FlashCard";

interface DecksManagementProps {
  decks: DeckModel[];
}

export default function DecksManagement({ decks }: DecksManagementProps) {
  const [selectedDeck, setSelectedDeck] = useState<DeckModel | null>(null);

  const handleDeckClick = (deck: any) => {
    setSelectedDeck(deck);
  };

  const { data: cards } = useCards(selectedDeck?.uuid ?? "", {
    isEnabled: !!selectedDeck,
  });

  return (
    <div className="flex flex-col gap-6">
      <section
        id="decks"
        className="flex items-stretch gap-4 overflow-x-auto snap-x snap-proximity snap-center scrollbar-hide pb-4"
      >
        {(decks ?? []).map((deck) => {
          const isSelected = selectedDeck?.uuid === deck.uuid;

          return (
            <div key={deck.uuid} className="snap-center flex-shrink-0">
              <Deck
                deck={deck}
                isSelected={isSelected}
                onClick={() => handleDeckClick(deck)}
              />
            </div>
          );
        })}
      </section>
      <section id="deck-cards">
        {selectedDeck ? (
          <div className="grid grid-cols-5 gap-4">
            {cards?.map((c) => (
              <Flashcard key={c.uuid} card={c} isRevealed />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14-7H5m14 14H5"
              />
            </svg>
            <p className="text-gray-500">Select a deck to view its cards</p>
          </div>
        )}
      </section>
    </div>
  );
}
