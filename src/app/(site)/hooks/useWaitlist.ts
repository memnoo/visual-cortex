import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/lib/database/client";

import { getWaitlistEntry, WaitlistEntry } from "../types/types";
import { isValidEmail } from "@/app/utils/validation/email";

export interface WaitlistInput {
  email: string;
  interest?: string;
}

export interface WaitlistCheckData {
  email: string;
}

export const useJoinWaitlist = () => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (invit: WaitlistInput) => {
      const { data, error } = await supabase
        .from("Waitlist")
        .insert(invit)
        .select()
        .single();

      if (error) throw error;
      return getWaitlistEntry(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
  });
};

export const useCheckWaitlist = () => {
  const supabase = createClient();

  return useMutation({
    mutationFn: async (email: string): Promise<WaitlistEntry | null> => {
      if (!isValidEmail(email)) {
        return null;
      }

      const { data, error } = await supabase
        .from("Waitlist")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return getWaitlistEntry(data);
    },
  });
};
