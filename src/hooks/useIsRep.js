import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";

export function useIsRep(groupId) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["isRep", groupId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("role")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.role === "rep";
    },
    enabled: !!groupId && !!user?.id,
  });
}
