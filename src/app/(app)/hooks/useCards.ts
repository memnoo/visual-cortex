import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/database/client";
import { Card } from "../types/types";

export const useCards = (
  deckUuid: string,
  option: { isEnabled: boolean } = { isEnabled: true }
) =>
  useQuery({
    queryKey: ["deck", deckUuid, "cards"],
    enabled: option.isEnabled,
    queryFn: async (): Promise<Card[]> => {
      const supabase = await createClient();

      const { data: associations } = await supabase
        .from("deck_card_association")
        .select("*")
        .eq("deck_uuid", deckUuid);

      const { data: rawCards } = await supabase
        .from("Card")
        .select("*")
        .in(
          "uuid",
          (associations ?? []).map((assoc) => assoc.card_uuid)
        );

      return (rawCards ?? []).map((c) => {
        return {
          uuid: c.uuid,
          front: c.front,
          back: c.back,
          extraFields: c.content,
          createdAt: new Date(c.createdAt),
          userUuid: c.userUuid,
        } satisfies Card;
      });
    },
    staleTime: 1000 * 60 * 10,
  });

export function useCreateCard() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (data: any) => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Generate UUID for the new card
      const cardUuid = crypto.randomUUID();

      // Create the card
      const { error: cardError } = await supabase.from("Card").insert({
        uuid: cardUuid,
        label: data.label,
        content: data.content,
        user_id: user.id,
      });

      if (cardError) throw cardError;

      // Create the deck-card association
      const { error: associationError } = await supabase
        .from("deck_card_association")
        .insert({
          deck_uuid: data.deckUuid,
          card_uuid: cardUuid,
        });

      if (associationError) throw associationError;

      return { cardUuid };
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}
