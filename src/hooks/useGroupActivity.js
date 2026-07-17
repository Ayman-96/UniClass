import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";

export function useGroupActivity(groupId) {
  return useQuery({
    queryKey: ["group-activity", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_activity")
        .select("*, actor:profiles(username)")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });
}
