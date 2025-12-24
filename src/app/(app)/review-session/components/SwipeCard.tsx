"use client";

import { useState, useRef } from "react";
import classNames from "classnames";

import { RevealableFlashCard } from "../../cards/components/RevealableFlashCard";
import { SwipeIndicators } from "./SwipeIndicators";

import type { SwipeDirection } from "../types";
import { Card } from "../../types/types";

type SwipeCardProps = {
  card: Card;
  isTopCard: boolean;
  hasHintShown: boolean;
  positionInStack?: number;
  onSwipe: (direction: SwipeDirection) => void;
};

export const SwipeCard = ({
  card,
  isTopCard,
  positionInStack = 4,
  onSwipe,
}: SwipeCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const getSwipeDirection = (x: number, y: number): SwipeDirection | null => {
    const threshold = 100;

    if (Math.abs(y) > Math.abs(x)) {
      if (y < -threshold) return "up";
      if (y > threshold) return "down";
    } else {
      if (x > threshold) return "right";
      if (x < -threshold) return "left";
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isTopCard) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    cardRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isTopCard) return;

    const x = e.clientX - startPos.current.x;
    const y = e.clientY - startPos.current.y;

    setDragOffset({ x, y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !isTopCard) return;

    const direction = getSwipeDirection(dragOffset.x, dragOffset.y);

    if (direction) {
      const exitX =
        direction === "right"
          ? 1000
          : direction === "left"
          ? -1000
          : dragOffset.x;
      const exitY =
        direction === "up" ? -1000 : direction === "down" ? 1000 : dragOffset.y;

      setDragOffset({ x: exitX, y: exitY });

      setTimeout(() => {
        onSwipe?.(direction);
        setDragOffset({ x: 0, y: 0 });
        setIsFlipped(false);
        setIsDragging(false);
      }, 300);
    } else {
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
    }

    cardRef.current?.releasePointerCapture(e.pointerId);
  };

  const rotation = dragOffset.x / 20;

  return (
    <div
      ref={cardRef}
      className={classNames(
        "absolute inset-0 user-select-none rounded",
        isTopCard && "translate-y-1",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{
        zIndex: isTopCard ? 10 : 10 - positionInStack,
        transform: isTopCard
          ? `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(1.05) rotate(${rotation}deg)`
          : `translate(0px, ${`-${positionInStack * 10}px`}) scale(${
              1 - positionInStack * 0.08
            })`,
        transition: isDragging ? "none" : "transform 0.3s ease-out",
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <RevealableFlashCard
        card={card}
        onFlip={() => setIsFlipped(!isFlipped)}
      />

      {isTopCard && <SwipeIndicators dragOffset={dragOffset} />}
    </div>
  );
};
