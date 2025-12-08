"use client";

import { useState } from "react";
import classNames from "classnames";

import { Card } from "../../types/types";

import { FlashCard } from "../../cards/components/FlashCard";
import { EmptyState } from "@/app/components/atoms/EmptyState";
import Button from "@/app/components/atoms/Button";

interface DeckDetailsViewProps {
  cards: Card[];
  onAddFlashCardClicked?: () => void;
}

export const FlashCardsGrid = ({
  cards,
  onAddFlashCardClicked,
}: DeckDetailsViewProps) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  const renderKindProperty = (card: Card) => {
    if (!card.extraFields || !("kind" in card.extraFields)) return null;

    return (
      <small className="text-gray-400">({String(card.extraFields.kind)})</small>
    );
  };

  return (
    <>
      <div className="grid grid-rows-1 sm:grid-rows-2 md:grid-cols-5 gap-6">
        {!cards || cards.length === 0 ? (
          <EmptyState label="No cards in this deck">
            <Button variant="ghost" onClick={onAddFlashCardClicked}>
              Add your first flash-card
            </Button>
          </EmptyState>
        ) : (
          <>
            <div
              className={classNames(
                "space-y-2 md:col-span-2 overflow-y-auto",
                selectedCard ? "max-h-58" : "max-h-90"
              )}
            >
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
                        <div className="flex flex-wrap gap-2 items-center">
                          <p>{card.front}</p>
                          {renderKindProperty(card)}
                        </div>
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
                  <FlashCard card={selectedCard} />
                </div>
              ) : (
                <EmptyState
                  label="Select a card to see its content"
                  icon="file"
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
