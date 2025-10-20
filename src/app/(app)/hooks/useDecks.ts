import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/database/client";
import { Deck } from "../types/types";
import { useUser } from "@/app/(app)/hooks/useUser";

export const useDecks = () =>
  useQuery({
    queryKey: ["decks"],
    queryFn: async (): Promise<Deck[]> => {
      const supabase = await createClient();

      const { data: user } = useUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: decks } = await supabase
        .from("Deck")
        .select("*")
        .eq("userUuid", user.id);

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
