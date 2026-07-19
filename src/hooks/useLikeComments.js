// src/hooks/useLikeComments.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";

export function useLikeComments({ table, idColumn, id, queryKey }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: existingLike } = await supabase
        .from(table)
        .select("id")
        .eq(idColumn, id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingLike) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq("id", existingLike.id);
        if (error) throw error;
        return { liked: false };
      } else {
        const { error } = await supabase
          .from(table)
          .insert({ [idColumn]: id, user_id: user.id });
        if (error) throw error;
        return { liked: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error(`Error toggling like on ${table}: ` + error.message);
    },
  });
}
