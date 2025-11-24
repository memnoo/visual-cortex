import { createClient } from "../database/client";
import type {
  CreateDeckInput,
  UpdateDeckInput,
  CreateCardInput,
  UpdateCardInput,
  Deck,
  Card,
} from "../types/database";

const supabase = createClient();

const getByDeckId = async (deckId: string): Promise<Card[]> => {
  const { data, error } = await supabase
    .from("Card")
    .select("*")
    .eq("deck_id", deckId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []) satisfies Card[];
};

//   // GET single card
//   getById: async (id: string): Promise<Card> => {
//     const { data, error } = await supabase
//       .from("cards")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error) throw error;
//     return data;
//   },

//   // CREATE card
//   create: async (input: CreateCardInput): Promise<Card> => {
//     const { data, error } = await supabase
//       .from("cards")
//       .insert(input)
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   },

//   // CREATE multiple cards
//   createMany: async (inputs: CreateCardInput[]): Promise<Card[]> => {
//     const { data, error } = await supabase
//       .from("cards")
//       .insert(inputs)
//       .select();

//     if (error) throw error;
//     return data;
//   },

//   // UPDATE card
//   update: async (id: string, input: UpdateCardInput): Promise<Card> => {
//     const { data, error } = await supabase
//       .from("cards")
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

//   // DELETE card
//   delete: async (id: string): Promise<void> => {
//     const { error } = await supabase.from("cards").delete().eq("id", id);

//     if (error) throw error;
//   },

//   // DELETE all cards in a deck
//   deleteByDeckId: async (deckId: string): Promise<void> => {
//     const { error } = await supabase
//       .from("cards")
//       .delete()
//       .eq("deck_id", deckId);

//     if (error) throw error;
//   },
// };
