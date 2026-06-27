import { useAuth } from "../AuthContext";
import { supabase } from "../supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
/*
useQuery → GET/fetch data
useMutation → POST/PUT/DELETE/update data
useQueryClient → control cache */

// Fetch all groups
export function useGroups() {
  // custom react hook
  // create a query :
  return useQuery({
    queryKey: ["groups"], // TanStack Query stores fetched data under this key.
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*, group_members(count), courses(count)");
      // SQL : SELECT * FROM groups
      if (error) throw error;
      return data; // Now data contains all groups.
    },
  });
}

// Add a new group
export function useAddGroup() {
  const queryClient = useQueryClient(); // This gives access to TanStack Query cache.

  // This function runs when you call: addGroupMutation.mutate(...)
  return useMutation({
    mutationFn: async (newGroup) => {
      let avatarUrl = null;

      if (newGroup.avatar) {
        const fileExt = newGroup.avatar.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("group-avatars")
          .upload(fileName, newGroup.avatar);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("group-avatars")
          .getPublicUrl(fileName);

        avatarUrl = urlData.publicUrl;
      }

      const { data, error } = await supabase.rpc("create_group", {
        p_name: newGroup.name,
        p_group_code: newGroup.group_code,
        p_description: newGroup.description,
        p_color: newGroup.color,
        p_rep_id: newGroup.rep_id,
        p_rep_name: newGroup.rep_name,
        p_avatar: avatarUrl,
      });

      if (error) throw error;
      return data;
    },
    // TanStack Query automatically updates UI
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    // “after adding a group, refetch the groups list”
    // Because the cached "groups" data is now outdated.
    // Without this: UI would still show old groups
    onError: (error) => {
      console.error("Failed to create group:", error.message);
      // later you can show a toast notification here
    },
  });
}

export function useJoinGroup() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (code) => {
      const { error } = await supabase.rpc("join_group_by_code", {
        p_code: code,
        p_user_id: user.id,
      });

      if (error) {
        if (error.message.includes("Group not found"))
          throw new Error("Group not found. Check the code and try again.");
        if (error.message.includes("Already a member"))
          throw new Error("You are already a member of this group.");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
