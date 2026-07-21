import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";
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
export function useMarkGroupActivitySeen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId) => {
      const { error } = await supabase.from("group_activity_reads").upsert({
        user_id: user.id,
        group_id: groupId,
        last_seen_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-activity-summary"] });
    },
  });
}
export function useGroupActivitySummary(groupIds) {
  return useQuery({
    queryKey: ["group-activity-summary", groupIds],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_group_activity_summary", {
        p_group_ids: groupIds,
      });
      if (error) throw error;
      return data;
    },
    enabled: groupIds.length > 0,
  });
}
