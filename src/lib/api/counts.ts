import { createClient } from "../database/client";

const supabase = createClient();

export const countDecks = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from("Deck")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count;
};

export const countCards = async (): Promise<number | null> => {
  const { count, error } = await supabase
    .from("Card")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count;
};

export const countUsers = async (): Promise<number | null> => {
  const response = await fetch("/api/users/count");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch users count");
  }

  return data.count;
};
