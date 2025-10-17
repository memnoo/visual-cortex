"use client";

import { useState } from "react";
import { Deck } from "../components/Deck";
import CardListView from "../components/CardListView";

interface DashboardClientProps {
  decks: any[];
  cards: any[];
  deckCardAssociations: any[];
}

export default function DashboardClient({
  decks,
  cards,
  deckCardAssociations,
}: DashboardClientProps) {
  const [selectedDeck, setSelectedDeck] = useState<{
    deck: any;
    cards: any[];
  } | null>(null);

  const getCardsForDeck = (deckUuid: string) => {
    return (
      deckCardAssociations
        ?.filter((assoc) => assoc.deck_uuid === deckUuid)
        .map((assoc) => cards?.find((card) => card.uuid === assoc.card_uuid))
        .filter(Boolean) ?? []
    );
  };

  const handleDeckClick = (deck: any) => {
    const deckCards = getCardsForDeck(deck.uuid);
    setSelectedDeck({ deck, cards: deckCards });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Decks Section */}
        <div className="xl:col-span-1">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(decks ?? []).map((deck) => {
              const deckCards = getCardsForDeck(deck.uuid);
              const isSelected = selectedDeck?.deck.uuid === deck.uuid;

              return (
                <Deck
                  key={deck.uuid}
                  deck={deck}
                  cards={deckCards}
                  isSelected={isSelected}
                  onClick={() => handleDeckClick(deck)}
                />
              );
            })}
          </section>
        </div>

        {/* Detail Section */}
        <div className="xl:col-span-2">
          {selectedDeck ? (
            <CardListView cards={selectedDeck.cards} isVisible={true} />
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
        </div>
      </div>
    </div>
  );
}
