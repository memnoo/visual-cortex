"use client";

import classNames from "classnames";

import { PropsWithChildren } from "react";
import { Card } from "../../types/types";
import { Divider } from "@/app/components/atoms/Divider";
import { useCardExtraFields } from "../hooks/useCardExtraFields";
import { CardVisibleExtraFieldList } from "./fields/CardVisibleExtraFieldList";
import { CardExceptionFieldList } from "./fields/CardExceptionFieldList";

type FlashCardProps = {
  card: Card;
} & PropsWithChildren;

export const FlashCard = ({ card, children }: FlashCardProps) => {
  const theme = "bg-gradient-to-br from-indigo-500 to-purple-600 text-white";

  const { exceptionValueFields, hasOnlyExceptionProperties, visibleFields } =
    useCardExtraFields(card);

  return (
    <div className="w-full h-full">
      <div
        className={classNames(
          "flex flex-col content-stretch rounded-2xl shadow-2xl p-4 text-center h-full",
          theme
        )}
      >
        <div className="flex flex-col content-stretch justify-center">
          <h2 className="text-4xl text-white font-bold">{card.front}</h2>
          <CardExceptionFieldList values={exceptionValueFields} />
          <h3 className="text-2xl text-red-300 font-semibold mt-2">
            {card.back}
          </h3>
          {!hasOnlyExceptionProperties && visibleFields.length > 0 && (
            <>
              <Divider horizontal />
              <CardVisibleExtraFieldList values={visibleFields} />
            </>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
