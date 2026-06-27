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
export function useIsModerator(groupId) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["isModerator", groupId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("is_moderator")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.is_moderator === true;
    },
    enabled: !!groupId && !!user?.id,
  });
}
