"use client";

import { useState } from "react";
import { Card } from "../../types/types";
import { SwipeDirection } from "../types";
import { SwipeCard } from "./SwipeCard";

export type ReviewSessionState = {
  correct: number;
  incorrect: number;
  hintUsed: number;
  skipped: number;
  remaining: number;
};

type CardSwiperProps = {
  cards: Card[];
  onActionPerformed?: (
    action: SwipeDirection,
    reviewSessionState: ReviewSessionState
  ) => void;
};

const PREVIEW_STACK_SIZE = 4;

export const CardSwiper = ({ cards, onActionPerformed }: CardSwiperProps) => {
  const [stats, setStats] = useState<ReviewSessionState>({
    correct: 0,
    incorrect: 0,
    hintUsed: 0,
    skipped: 0,
    remaining: cards.length,
  });

  const [remainingCards, setRemainingCards] = useState<Card[]>(cards);
  const [reviewedCards, setReviewedCards] = useState<Card[]>([]);

  const handleSwipe = (direction: SwipeDirection) => {
    switch (direction) {
      // Remove card from stack
      case "right":
      case "left": {
        const currentCard = remainingCards[0];
        setReviewedCards([currentCard, ...reviewedCards]);
        const newRemainingCards = remainingCards.slice(1);
        setRemainingCards(newRemainingCards);
        setStats((prevStats) => ({
          ...prevStats,
          correct:
            direction === "right" ? prevStats.correct + 1 : prevStats.correct,
          incorrect:
            direction === "left"
              ? prevStats.incorrect + 1
              : prevStats.incorrect,
          remaining: newRemainingCards.length,
        }));
        break;
      }
      // Move card to the back of the stack
      case "up":
      case "down": {
        const currentCard = remainingCards[0];
        const newRemainingCards = remainingCards.slice(1);
        newRemainingCards.push(currentCard);
        setRemainingCards(newRemainingCards);
        break;
      }
    }

    if (onActionPerformed) {
      onActionPerformed(direction, stats);
    }
  };

  return (
    <div className="mx-auto relative w-full h-full">
      {remainingCards.slice(0, PREVIEW_STACK_SIZE).map((card, index) => (
        <SwipeCard
          key={card.uuid}
          card={card}
          isTopCard={index === 0}
          positionInStack={index}
          onSwipe={handleSwipe}
          hasHintShown={false}
        />
      ))}
    </div>
  );
};
