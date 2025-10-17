"use client";

import FlashCard from "./FlashCard";

interface DeckModalProps {
  deck: {
    uuid: string;
    topic: string;
    count: number;
    lang?: string;
  };
  cards: any[];
  isOpen: boolean;
  onClose: () => void;
}

export default function DeckModal({
  deck,
  cards,
  isOpen,
  onClose,
}: DeckModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-green-500 to-lime-600 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{deck.topic}</h2>
            <p className="text-sm opacity-90">
              {cards.length} {cards.length === 1 ? "card" : "cards"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {cards.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No cards in this deck yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
              {cards.map((card) => (
                <FlashCard key={card.uuid} card={card} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
