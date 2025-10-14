"use client";

import { useState } from "react";

interface FlashcardProps {
  card: {
    label: string;
    content: Record<string, any>;
  };
  onFlip?: () => void;
}

export default function Flashcard({ card, onFlip }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  const secondaryValues = Object.entries(card.content).filter(
    ([key]) => key !== "main"
  );

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        onClick={handleFlip}
        className={`relative w-full h-64 cursor-pointer transition-transform duration-500 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Face avant */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-white">
            <p className="text-4xl font-bold mb-4">{card.label}</p>
          </div>
        </div>

        {/* Face arrière */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-2xl py-8 px-4 flex flex-col items-center justify-center text-white">
            <p className="text-3xl font-bold mb-4 capitalize">
              {card.content.main}
            </p>
            {secondaryValues.length > 0 && (
              <div className="flex flex-col content-stretch gap-1">
                {secondaryValues.map(([key, value]) => (
                  <p key={key} className="capitalize text-small">
                    <span className="text-xs text-gray-300">{key}</span>:{" "}
                    <span className="capitalize text-white font-bold">
                      {value}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MinimalFlashcard({ card }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className="bg-white border-2 border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-indigo-500 transition-colors min-h-48 flex items-center justify-center"
    >
      <p className="text-3xl font-bold">
        {isFlipped ? card.content.romaji : card.label}
      </p>
    </div>
  );
}
