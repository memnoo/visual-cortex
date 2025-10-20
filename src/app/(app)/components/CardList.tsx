"use client";

import FlashCard from "../components/FlashCard";

interface CardListProps {
  cards: any[];
  isExpanded: boolean;
}

export default function CardList({ cards, isExpanded }: CardListProps) {
  if (!isExpanded || cards.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
      <div className="border-l-4 border-green-500 pl-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3">
          {cards.length} {cards.length === 1 ? "card" : "cards"} in this deck
        </h3>
        <div className="space-y-3">
          {cards.map((card, index) => (
            <div
              key={card.uuid}
              className="animate-in fade-in-0 slide-in-from-left-2 duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <FlashCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
