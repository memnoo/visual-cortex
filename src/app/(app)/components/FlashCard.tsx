"use client";

import { useState } from "react";
import { Card } from "../types/types";

interface FlashcardProps {
  card: Card;
  isRevealed: boolean;
  onFlip?: () => void;
}

export default function Flashcard({
  card,
  isRevealed,
  onFlip,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  const extraFields = Object.entries(card.extraFields ?? {});

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        onClick={handleFlip}
        className={`relative w-full h-64 cursor-pointer transition-transform duration-500 transform-style-3d ${
          isFlipped || isRevealed ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center text-white">
            <p className="text-4xl font-bold mb-4">{card.front}</p>
          </div>
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-2xl py-8 px-4 flex flex-col content-stretch items-center justify-center text-white">
            <div className="flex flex-col items-center content-stretch gap-1 mb-3 text-center">
              {isRevealed && (
                <>
                  <p className="text-4xl font-bold capitalize">{card.front}</p>
                  <span className="font-bold">&#8595;</span>
                </>
              )}
              <p className="text-3xl font-bold capitalize">{card.back}</p>
            </div>
            {extraFields.length - 2 <= 0 ? (
              <div className="flex flex-col content-stretch gap-1 overflow-x-auto">
                {extraFields.map(([key, value]) => (
                  <p key={key} className="capitalize text-small">
                    <span className="text-xs text-gray-300">
                      {key.replaceAll("_", " ")}
                    </span>
                    :{" "}
                    <span className="capitalize text-white font-bold">
                      {value}
                    </span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="capitalize text-small bg-white text-gray-500 font-semibold rounded-lg px-3 py-1 mt-2">
                + {extraFields.length} extra fields
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
