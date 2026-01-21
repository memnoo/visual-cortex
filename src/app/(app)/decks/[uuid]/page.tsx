"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { useDeckWithCards } from "../../hooks/useDecks";

import { FlashCardsGrid } from "../components/FlashCardsGrid";
import { ErrorCallout } from "@/app/components/atoms/ErrorCallout";
import { Loader } from "@/app/components/atoms/Loader";
import { Button } from "@/app/components/atoms/Button";
import { CardModal } from "../../cards/components/CardModal";
import { DeckModal } from "../components/DeckModal";
import { BreadcrumbButton } from "../../components/BreadcrumbButton";
import { Card } from "../../types/types";

export default function DeckPage() {
  const t = useTranslations();

  const { uuid } = useParams();
  const deckUuid = String(uuid);

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardOperation, setCardOperation] = useState<
    "ADD" | "UPDATE" | "DELETE"
  >();
  const [selectedCard, setSelectedCard] = useState<Card>();

  const toggleCardOperation = (
    operation: "ADD" | "UPDATE" | "DELETE",
    card?: Card
  ) => {
    setSelectedCard(card);
    setCardOperation(operation);
    setIsCardModalOpen(true);
  };

  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [deckOperation, setDeckOperation] = useState<
    "UPDATE" | "DELETE" | undefined
  >();

  const toggleDeckOperation = (
    operation: "UPDATE" | "DELETE" | undefined,
    closeModal: boolean = false
  ) => {
    setDeckOperation(operation);
    setIsDeckModalOpen(closeModal ? false : true);
  };

  const { data: deckWithCards, isLoading } = useDeckWithCards(deckUuid);

  if (isLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center w-full">
        <Loader text={t("decks.loadingTexts.decks")} hasAccentColor />
      </div>
    );
  }

  if (!deckWithCards) {
    return <ErrorCallout label={t("misc.noData")} />;
  }

  const { cards, ...deck } = deckWithCards;

  return (
    <>
      <section className="flex flex-col gap-2 content-stretch text-left w-full">
        <div className="flex items-center align-stretch gap-2">
          <BreadcrumbButton
            path="/decks"
            label={t("decks.word", { count: 2 })}
          />
          <div className="ml-auto">
            <div className="flex gap-1">
              <Button
                type="button"
                variant="primary"
                iconName="plus"
                onClick={() => toggleCardOperation("ADD")}
              />
              <Button
                type="button"
                variant="secondary"
                iconName="edit"
                onClick={() => toggleDeckOperation("UPDATE")}
              />
              <Button
                type="button"
                variant="danger"
                iconName="delete"
                onClick={() => toggleDeckOperation("DELETE")}
              />
            </div>
          </div>
        </div>
        <h2 className="text-xl text-center font-bold my-2">
          {deck.topic}{" "}
          <small className="text-medium font-semibold text-gray-400">
            ({t("cards.withCount", { count: cards.length })})
          </small>
        </h2>
        <FlashCardsGrid
          cards={cards}
          onCreateClicked={() => toggleCardOperation("ADD")}
          onEditClicked={(c) => toggleCardOperation("UPDATE", c)}
          onDeleteClicked={(c) => toggleCardOperation("DELETE", c)}
        />
      </section>

      {cardOperation && (
        <CardModal
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
          cardOperation={{ card: selectedCard, operation: cardOperation }}
          deckUuid={deck.uuid}
        />
      )}

      {deckOperation && (
        <DeckModal
          isOpen={isDeckModalOpen}
          onClose={() => toggleDeckOperation(undefined, true)}
          deckOperation={{ deck, operation: deckOperation }}
        />
      )}
    </>
  );
}
