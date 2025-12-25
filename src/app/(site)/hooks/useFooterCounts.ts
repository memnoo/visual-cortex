import { countCards, countDecks, countUsers } from "@/lib/api/counts";
import { useQuery } from "@tanstack/react-query";

interface FooterCounts {
  users: number | null;
  decks: number | null;
  cards: number | null;
}

export const useFooterCounts = () =>
  useQuery({
    queryKey: ["footer"],
    queryFn: async (): Promise<FooterCounts> => {
      const [users, decks, cards] = await Promise.all([
        countUsers(),
        countDecks(),
        countCards(),
      ]);

      return {
        users,
        decks,
        cards,
      } satisfies FooterCounts;
    },
    staleTime: 1000 * 60 * 60,
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors (user not logged in)
      if (error?.message?.includes("JWT") || error?.message?.includes("auth")) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
  });
