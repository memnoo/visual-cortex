"use client";

import { useState } from "react";
import { Deck as DeckModel } from "../../types/types";
import { Deck } from "../../components/Deck";
import { useCards } from "../../hooks/useCards";
import DeckDetailsView from "./DeckDetailsView";
import { EmptyState } from "@/app/components/atoms/EmptyState";
import { Loader } from "@/app/components/atoms/Loader";

interface DecksManagementProps {
  decks: DeckModel[];
}

export default function DecksManagement({ decks }: DecksManagementProps) {
  const [selectedDeck, setSelectedDeck] = useState<DeckModel | null>(null);

  const handleDeckClick = (deck: any) => {
    setSelectedDeck(deck);
  };

  const { data: cards, isLoading: isFetchingCards } = useCards(
    selectedDeck?.uuid ?? "",
    {
      isEnabled: !!selectedDeck,
    }
  );

  return (
    <div className="flex flex-col gap-6">
      <section
        id="decks"
        className="flex items-stretch gap-4 overflow-x-auto snap-x snap-proximity snap-center scrollbar-hide pb-4"
      >
        {(decks ?? []).map((deck) => {
          const isSelected = selectedDeck?.uuid === deck.uuid;

          return (
            <div key={deck.uuid} className="snap-center flex-shrink-0">
              <Deck
                deck={deck}
                isSelected={isSelected}
                onClick={() => handleDeckClick(deck)}
              />
            </div>
          );
        })}
      </section>
      <section id="deck-cards">
        {selectedDeck ? (
          <>
            {isFetchingCards ? (
              <Loader text="Récupération des cartes..." />
            ) : (
              <DeckDetailsView cards={cards ?? []} />
            )}
          </>
        ) : (
          <EmptyState
            label="Sélectionner un deck pour voir les cartes"
            icon="menu"
          />
        )}
      </section>
    </div>
  );
}
