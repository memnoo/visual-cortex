"use client";

import { useState, useRef } from "react";
import type { SwipeDirection } from "../types";
import { Card } from "../../types/types";
import { RevealableFlashCard } from "../../cards/components/RevealableFlashCard";
import classNames from "classnames";

type SwipeCardProps = {
  card: Card;
  isTopCard: boolean;
  hasHintShown: boolean;
  positionInStack?: number;
  onSwipe?: (direction: SwipeDirection) => void;
  onShowHint?: () => void;
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
    const angle = Math.atan2(y, x) * (180 / Math.PI);

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
        "absolute inset-0 user-select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{
        zIndex: isTopCard ? 10 : 10 - positionInStack,
        transform: isTopCard
          ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`
          : `translate(0px, ${
              !isTopCard ? `-${(positionInStack + 1) * 10}px` : "0px"
            }) scale(${1 - positionInStack * 0.1})`,
        transition: isDragging ? "none" : "transform 0.3s ease-out",
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-attribute={card.front}
    >
      {isTopCard && <SwipeIndicators dragOffset={dragOffset} />}

      <RevealableFlashCard
        card={card}
        onFlip={() => setIsFlipped(!isFlipped)}
      />
    </div>
  );
};

const SwipeIndicators = ({
  dragOffset,
}: {
  dragOffset: { x: number; y: number };
}) => {
  const rightOpacity = Math.min(Math.max(dragOffset.x / 100, 0), 1);
  const leftOpacity = Math.min(Math.max(-dragOffset.x / 100, 0), 1);
  const upOpacity = Math.min(Math.max(-dragOffset.y / 100, 0), 1);
  const downOpacity = Math.min(Math.max(dragOffset.y / 100, 0), 1);

  return (
    <>
      <div
        className="absolute bottom-4 left-1/4 bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-2xl rotate-12 pointer-events-none"
        style={{ opacity: rightOpacity }}
      >
        ✓ LEARNT
      </div>

      <div
        className="absolute bottom-4 left-1/2 bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-2xl -rotate-12 pointer-events-none"
        style={{ opacity: leftOpacity }}
      >
        ✗ DUNNO
      </div>

      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold text-xl pointer-events-none"
        style={{ opacity: upOpacity }}
      >
        💡 HINT
      </div>

      <div
        className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 bg-gray-500 text-white px-6 py-3 rounded-xl font-bold text-xl pointer-events-none"
        style={{ opacity: downOpacity }}
      >
        ↓ PASS
      </div>
    </>
  );
};
