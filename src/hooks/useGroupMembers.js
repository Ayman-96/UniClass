import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";

export function useGroupMembers(groupId) {
  return useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select(
          `
          user_id,
          role,
          is_moderator,
          profiles (
            username,
            avatar_url,
            last_seen,
            tag
          )
        `,
        )
        .eq("group_id", groupId);

      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });
}
export function useIsMember(groupId) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["isMember", groupId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("id")
        .eq("group_id", groupId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
    enabled: !!groupId && !!user?.id,
  });
}
export function useRemoveMember(groupId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
    },
    onError: (error) => {
      console.error("Failed to remove member:", error.message);
    },
  });
}
export function usePromoteToRep(groupId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const { error } = await supabase
        .from("group_members")
        .update({ role: "rep" })
        .eq("group_id", groupId)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
    },
  });
}
export function useRemoveAsRep(groupId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const { error } = await supabase
        .from("group_members")
        .update({ role: "member" })
        .eq("group_id", groupId)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
    },
  });
}

export function usePromoteToMod(groupId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ currentModId, newModId }) => {
      // Step 1: remove current mod
      const { error: error1 } = await supabase
        .from("group_members")
        .update({ is_moderator: false })
        .eq("group_id", groupId)
        .eq("user_id", currentModId);
      if (error1) throw error1;

      // Step 2: promote new mod
      const { error: error2 } = await supabase
        .from("group_members")
        .update({ is_moderator: true })
        .eq("group_id", groupId)
        .eq("user_id", newModId);
      if (error2) throw error2;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
    },
  });
}

export function useRemoveSelfAsRep(groupId) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("group_members")
        .update({ role: "member" })
        .eq("group_id", groupId)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
    },
  });
}
