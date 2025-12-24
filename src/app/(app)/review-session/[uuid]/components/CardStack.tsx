"use client";

import { useState } from "react";

import { SwipeCard } from "../../components/SwipeCard";

import { Card } from "../../../types/types";
import { ReviewSessionStats, SwipeDirection } from "../../types";
import { DEFAULT_STATS } from "./ReviewSession";

type CardSwiperProps = {
  cards: Card[];
  onActionPerformed: (
    reviewSessionStats: ReviewSessionStats,
    remaining: number
  ) => void;
};

const PREVIEW_STACK_SIZE = 5;

export const CardStack = ({ cards, onActionPerformed }: CardSwiperProps) => {
  const [stats, setStats] = useState<ReviewSessionStats>(DEFAULT_STATS);

  const [remainingCards, setRemainingCards] = useState<Card[]>(cards);

  const handleSwipe = (direction: SwipeDirection) => {
    const newStats = { ...stats };

    switch (direction) {
      case "right": {
        const newRemainingCards = remainingCards.slice(1);
        setRemainingCards(newRemainingCards);

        newStats.correct = stats.correct + 1;
        setStats(newStats);

        onActionPerformed(newStats, newRemainingCards.length);
        break;
      }

      case "left": {
        const newRemainingCards = remainingCards.slice(1);
        setRemainingCards(newRemainingCards);

        newStats.incorrect = stats.incorrect + 1;
        setStats(newStats);

        onActionPerformed(newStats, newRemainingCards.length);
        break;
      }

      case "up":
        alert("Swipe up action not implemented yet.");
        break;

      case "down": {
        const currentCard = remainingCards[0];
        const newRemainingCards = remainingCards.slice(1);
        newRemainingCards.push(currentCard);
        setRemainingCards(newRemainingCards);
        break;
      }
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
