import { createClient } from "@/lib/database/server";
import { redirect } from "next/navigation";
import DecksManagement from "./components/DecksManagement";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: decks } = await supabase
    .from("Deck")
    .select("*")
    .eq("user_id", user.id);

  const deckUuids = decks?.map((d) => d.uuid) ?? [];
  const { data: deck_card_associations } = await supabase
    .from("deck_card_association")
    .select("*")
    .in("deck_uuid", deckUuids);

  const { data: cards } = await supabase
    .from("Card")
    .select("*")
    .eq("user_id", user.id);

  const cardsByDeck =
    decks?.map((deck) => ({
      deck,
      cards:
        deck_card_associations
          ?.filter((assoc) => assoc.deck_uuid === deck.uuid)
          .map((assoc) => cards?.find((card) => card.uuid === assoc.card_uuid))
          .filter(Boolean) ?? [],
    })) ?? [];

  return (
    <DecksManagement
      decks={decks ?? []}
      cards={cards ?? []}
      deckCardAssociations={deck_card_associations ?? []}
    />
  );
}
