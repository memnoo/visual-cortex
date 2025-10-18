import { createClient } from "@/lib/database/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/login/components/LogoutButton";
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Memnō</h1>
              <p className="text-sm text-gray-600">Bienvenue, {user.email}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DecksManagement
          decks={decks ?? []}
          cards={cards ?? []}
          deckCardAssociations={deck_card_associations ?? []}
        />
      </main>
    </div>
  );
}
