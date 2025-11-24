"use client";

import { useState } from "react";
import { DeckWithCount } from "../../types/types";

import { Deck } from "../../components/Deck";
import { useCards } from "../../hooks/useCards";

import DeckDetailsView from "./DeckDetailsView";

import { EmptyState } from "@/app/components/atoms/EmptyState";
import { Loader } from "@/app/components/atoms/Loader";

import { AddDeckButton } from "../../components/AddDeckButton";
import AddDeckModal from "../../components/AddDeckModal";

interface DecksManagementProps {
  decks: DeckWithCount[];
}

export default function DecksManagement({ decks }: DecksManagementProps) {
  const [selectedDeck, setSelectedDeck] = useState<DeckWithCount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        className="flex items-stretch gap-4 overflow-x-auto snap-x snap-proximity snap-center scrollbar-hide"
      >
        {(decks ?? []).map((deck) => (
          <div key={deck.uuid} className="snap-center flex-shrink-0 w-52 h-24">
            <Deck
              deck={deck}
              isSelected={selectedDeck?.uuid === deck.uuid}
              onClick={() => handleDeckClick(deck)}
            />
          </div>
        ))}
        <div
          key="add-deck-button"
          className="snap-center flex-shrink-0 w-52 h-24"
        >
          <AddDeckButton onClick={() => setIsModalOpen(true)} />
        </div>
      </section>
      <section id="deck-cards">
        {selectedDeck ? (
          <>
            {isFetchingCards ? (
              <Loader text="Récupération des cartes..." hasAccentColor />
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

      <AddDeckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
