import {
  getAllDecksForUser,
  getAllDecksWitCountForUser,
  getWithCards,
} from "@/lib/api/decks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Deck,
  DeckWithCount,
  transformDeck,
  transformDeckWithCount,
} from "../types/types";

// Query Keys
export const deckKeys = {
  all: ["decks"] as const,
  lists: () => [...deckKeys.all, "list"] as const,
  withCount: () => [...deckKeys.all, "list", "count"] as const,
  list: (filters: string) => [...deckKeys.lists(), { filters }] as const,
  details: () => [...deckKeys.all, "detail"] as const,
  detail: (id: string) => [...deckKeys.details(), id] as const,
  withCards: (id: string) => [...deckKeys.detail(id), "cards"] as const,
};

export const useDecks = () =>
  useQuery({
    queryKey: deckKeys.lists(),
    queryFn: async (): Promise<Deck[]> => {
      const decks = await getAllDecksForUser();
      return decks.map(transformDeck);
    },
  });

export const useDecksWithCount = () =>
  useQuery({
    queryKey: deckKeys.withCount(),
    queryFn: async (): Promise<DeckWithCount[]> => {
      const decks = await getAllDecksWitCountForUser();
      return decks.map(transformDeckWithCount);
    },
  });

// // GET single deck
// export function useDeck(id: string) {
//   return useQuery({
//     queryKey: deckKeys.detail(id),
//     queryFn: () => decksApi.getById(id),
//     enabled: !!id,
//   });
// }

export const useDeckWithCards = (uuid: string) =>
  useQuery({
    queryKey: deckKeys.withCards(uuid),
    queryFn: () => getWithCards(uuid),
    enabled: !!uuid,
  });

// // CREATE deck
// export function useCreateDeck() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: decksApi.create,
//     onSuccess: () => {
//       // Invalider la liste des decks pour refetch
//       queryClient.invalidateQueries({ queryKey: deckKeys.lists() });
//     },
//   });
// }

// // UPDATE deck
// export function useUpdateDeck() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: UpdateDeckInput }) =>
//       decksApi.update(id, data),
//     onSuccess: (data) => {
//       // Invalider la liste ET le détail
//       queryClient.invalidateQueries({ queryKey: deckKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: deckKeys.detail(data.id) });
//     },
//   });
// }

// // DELETE deck
// export function useDeleteDeck() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: decksApi.delete,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: deckKeys.lists() });
//     },
//   });
// }
