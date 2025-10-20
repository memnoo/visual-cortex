import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/database/client";
import { Deck } from "../types/types";

export const useDecks = () =>
  useQuery({
    queryKey: ["decks"],
    queryFn: async (): Promise<Deck[]> => {
      const supabase = await createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Error fetching user:", error);
        return [];
      }

      const { data: decks } = await supabase
        .from("Deck")
        .select("*")
        .eq("user_uuid", user.id);

      if (!decks) {
        return [];
      }

      const deckUuids = decks.map((d) => d.uuid);
      const { data: associations } = await supabase
        .from("deck_card_association")
        .select("*")
        .in("deck_uuid", deckUuids);

      return decks.map((deck) => {
        return {
          ...deck,
          count: (associations ?? []).filter(
            (assoc) => assoc.deck_uuid === deck.uuid
          ).length,
        };
      });
    },
    staleTime: 1000 * 60 * 10,
  });
