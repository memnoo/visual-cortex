import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/database/client";
import { User } from "@supabase/supabase-js";

export const useUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<User | null> => {
      const supabase = createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        return null;
      }

      return user;
    },
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors (user not logged in)
      if (error?.message?.includes("JWT") || error?.message?.includes("auth")) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
  });

export const useAuth = () => {
  const supabase = createClient();

  return {
    signOut: () => supabase.auth.signOut(),
    getCurrentUser: async () => {
      const session = await supabase.auth.getUser();
      return session.data.user;
    },
  };
};
