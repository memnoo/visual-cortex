import { createClient } from "../database/client";
import type {
  //   CreateDeckInput,
  //   UpdateDeckInput,
  //   CreateCardInput,
  //   UpdateCardInput,
  Deck,
  Card,
  DeckWithCount,
} from "../types/database";

const supabase = createClient();

export const getAllDecksForUser = async (): Promise<Deck[]> => {
  const { data, error } = await supabase
    .from("Deck")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Deck[]) || [];
};

export const getAllDecksWitCountForUser = async (): Promise<
  DeckWithCount[]
> => {
  const { data, error } = await supabase
    .from("Deck")
    .select("*, deck_card_association(count)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (
    data.map(
      (d) =>
        ({
          ...d,
          count: (d.deck_card_association ?? []).pop()?.count,
        } as DeckWithCount)
    ) || []
  );
};

export const getById = async (uuid: string): Promise<Deck> => {
  const { data, error } = await supabase
    .from("Deck")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) throw error;
  return data satisfies Deck;
};

export const getWithCards = async (
  uuid: string
): Promise<Deck & { cards: Card[] }> => {
  const { data, error } = await supabase
    .from("Deck")
    .select(`*, cards (*)`)
    .eq("uuid", uuid)
    .single();

  if (error) throw error;
  return data satisfies Deck & { cards: Card[] };
};

//   // CREATE deck
//   create: async (input: CreateDeckInput): Promise<Deck> => {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) throw new Error("Not authenticated");

//     const { data, error } = await supabase
//       .from("Deck")
//       .insert({
//         user_id: user.id,
//         ...input,
//       })
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   },

//   // UPDATE deck
//   update: async (id: string, input: UpdateDeckInput): Promise<Deck> => {
//     const { data, error } = await supabase
//       .from("Deck")
//       .update({
//         ...input,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   },

//   // DELETE deck
//   delete: async (id: string): Promise<void> => {
//     const { error } = await supabase.from("Deck").delete().eq("id", id);

//     if (error) throw error;
//   },
// };
