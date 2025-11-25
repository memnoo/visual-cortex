"use client";

import { useState } from "react";
import { Card, Deck } from "../../types/types";
import Flashcard from "../../components/FlashCard";
import { EmptyState } from "@/app/components/atoms/EmptyState";
import Button from "@/app/components/atoms/Button";
import { EmptyStateButton } from "../../components/EmptyStateButton";
import AddCardModal from "../../components/AddCardModal";

interface DeckDetailsViewProps {
  deck: Deck;
  cards: Card[];
}

export default function DeckDetailsView({ deck, cards }: DeckDetailsViewProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  return (
    <>
      <div className="grid grid-rows-1 sm:grid-rows-2 md:grid-cols-5 gap-6">
        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="flex-1">
            Modifier
          </Button>
          <Button type="button" variant="danger" className="flex-1">
            Supprimer
          </Button>
        </div>

        <EmptyStateButton
          label="Ajouter une flash card"
          onClick={() => setIsModalOpen(true)}
        />

        {!cards || cards.length === 0 ? (
          <EmptyState label="No cards in this deck" />
        ) : (
          <>
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
          </>
        )}
      </div>
      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deckUuid={deck.uuid}
      />
    </>
  );
}
