"use client";

import { useState } from "react";
import { Card } from "../../types/types";
import Flashcard from "../../components/FlashCard";
import { EmptyState } from "@/app/components/atoms/EmptyState";

interface DeckDetailsViewProps {
  cards: Card[];
}

export default function DeckDetailsView({ cards }: DeckDetailsViewProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  if (!cards || cards.length === 0) {
    return <EmptyState label="No cards in this deck" />;
  }

  return (
    <div className="grid grid-rows-1 sm:grid-rows-2 md:grid-cols-5 gap-6">
      <div className="space-y-2 md:col-span-2 max-h-96 overflow-y-auto">
        {cards.map((card) => (
          <div
            key={card.uuid}
            onClick={() => handleCardSelect(card)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedCard?.uuid === card.uuid
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {card.front}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {card.back}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start justify-center md:col-span-3">
        {selectedCard ? (
          <div className="w-full max-w-md">
            <Flashcard card={selectedCard} />
          </div>
        ) : (
          <EmptyState
            label="Sélectionner une carte pour voir son contenu"
            icon="file"
          />
        )}
      </div>
    </div>
  );
}
