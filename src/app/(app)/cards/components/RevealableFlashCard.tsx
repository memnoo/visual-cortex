"use client";

import { useState } from "react";

import classNames from "classnames";

import { Card } from "../../types/types";
import { Divider } from "@/app/components/atoms/Divider";
import { useCardExtraFields } from "../hooks/useCardExtraFields";
import { CardExceptionFieldList } from "./fields/CardExceptionFieldList";
import { CardVisibleExtraFieldList } from "./fields/CardVisibleExtraFieldList";

type RevealableFlashCardProps = {
  card: Card;
  onFlip?: () => void;
};

export const FLASH_CARD_STYLE =
  "flex flex-col content-stretch items-center justify-center w-full h-full rounded-2xl shadow-2xl py-8 px-4";

export const RevealableFlashCard = ({
  card,
  onFlip,
}: RevealableFlashCardProps) => {
  const themes = {
    normal: "bg-gradient-to-tr from-yellow-500 to-orange-600 text-white",
    revealed: "bg-gradient-to-br from-green-500 to-teal-600 text-white",
  };

  const { exceptionValueFields, hasOnlyExceptionProperties, visibleFields } =
    useCardExtraFields(card);

  // Flip
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        onClick={handleFlip}
        className={classNames(
          "relative w-full h-64 cursor-pointer transition-transform duration-500 transform-style-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        <div className="absolute inset-0 backface-hidden">
          <div className={classNames(FLASH_CARD_STYLE, themes.normal)}>
            <h2 className="text-4xl font-bold">{card.front}</h2>
            <CardExceptionFieldList values={exceptionValueFields} />
          </div>
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className={classNames(FLASH_CARD_STYLE, themes.revealed)}>
            <div className="flex flex-col items-center content-stretch gap-1 mb-3 text-center">
              <h2 className="text-4xl font-bold">{card.back}</h2>
              {!hasOnlyExceptionProperties && visibleFields.length > 0 && (
                <>
                  <Divider horizontal />
                  <CardVisibleExtraFieldList values={visibleFields} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
