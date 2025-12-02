"use client";

import AddCardModal from "../../components/AddCardModal";
import { ErrorCallout } from "@/app/components/atoms/ErrorCallout";
import { useParams } from "next/navigation";
import { useDeckWithCards } from "../../hooks/useDeckNew";
import { Loader } from "@/app/components/atoms/Loader";
import { FlashCardsGrid } from "../../dashboard/components/FlashCardsGrid";
import Button from "@/app/components/atoms/Button";
import Link from "next/link";
import { ICON_NAME } from "@/app/components/atoms/Icon";
import { useState } from "react";

export default function DeckPage() {
  const { uuid } = useParams();
  const deckUuid = String(uuid);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: deckWithCards, isLoading } = useDeckWithCards(deckUuid);

  if (isLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <Loader text="Chargement du deck..." hasAccentColor />
      </div>
    );
  }

  if (!deckWithCards) {
    return <ErrorCallout label="Pas de données disponible" />;
  }

  const { cards, ...deck } = deckWithCards;

  return (
    <>
      <section className="max-w-8xl mx-auto p-2 flex flex-col gap-2 content-stretch text-left">
        <div className="flex items-center align-stretch gap-2">
          <Link href="/decks">
            <Button
              type="button"
              variant="transparent"
              iconName={ICON_NAME.CHEVRON_LEFT}
            >
              {deck.topic}
            </Button>
          </Link>
          <div className="ml-auto">
            <div className="flex gap-1">
              <Button
                type="button"
                variant="secondary"
                iconName={ICON_NAME.EDIT}
              />
              <Button
                type="button"
                variant="danger"
                iconName={ICON_NAME.DELETE}
              />
            </div>
          </div>
        </div>
        <FlashCardsGrid cards={cards} />
      </section>

      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deckUuid={deck.uuid}
      />
    </>
  );
}
