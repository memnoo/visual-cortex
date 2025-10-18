"use client";

import FlashCard from "./FlashCard";

interface DeckDetailViewProps {
  deck: {
    uuid: string;
    topic: string;
    count: number;
    lang?: string;
  } | null;
  cards: any[];
  isVisible: boolean;
}

export default function DeckDetailView({
  deck,
  cards,
  isVisible,
}: DeckDetailViewProps) {
  if (!deck || !isVisible) return null;

  const sortedCards = [...cards].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="bg-gradient-to-br from-green-500 to-lime-600 text-white px-6 py-4 rounded-t-lg">
        <div>
          <h2 className="text-xl font-bold">{deck.topic}</h2>
          <p className="text-sm opacity-90">
            {cards.length} {cards.length === 1 ? "card" : "cards"}
          </p>
        </div>
      </div>
      <div className="p-6">
        {sortedCards.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No cards in this deck yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedCards.map((card, index) => (
              <div
                key={card.uuid}
                className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <FlashCard card={card} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
