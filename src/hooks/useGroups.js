import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
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
      const { data, error } = await supabase.rpc("create_group", {
        p_name: newGroup.name,
        p_group_code: newGroup.group_code,
        p_description: newGroup.description,
        p_color: newGroup.color,
        p_rep_id: newGroup.rep_id,
        p_rep_name: newGroup.rep_name,
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

// INVITATION
export function useSingleGroup(groupId) {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*, group_members(count), courses(count)")
        .eq("id", groupId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });
}
export function useUpdateGroupSettings(groupId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings) => {
      let avatarUrl = settings.avatar_url;
      let bannerUrl = settings.banner_url;

      // Upload avatar if a new file was selected
      if (settings.avatarFile) {
        const file = settings.avatarFile;
        const ext = file.name.split(".").pop();
        const path = `${groupId}/${nanoid()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("group-avatars")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("group-avatars")
          .getPublicUrl(path);
        avatarUrl = publicUrlData.publicUrl;
      }

      // Upload banner if a new file was selected
      if (settings.bannerFile) {
        const file = settings.bannerFile;
        const ext = file.name.split(".").pop();
        const path = `${groupId}/${nanoid()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("group-banner")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("group-banner")
          .getPublicUrl(path);
        bannerUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.rpc("update_group_settings", {
        p_group_id: groupId,
        p_allow_members_to_post: settings.allow_members_to_post,
        p_require_approval: settings.require_approval,
        p_visibility: settings.visibility,
        p_banner_url: bannerUrl,
        p_avatar_url: avatarUrl,
        p_description: settings.description,
        p_color: settings.color,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      toast.success("Group settings updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update settings");
    },
  });
}
export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId) => {
      const { error } = await supabase
        .from("groups")
        .delete()
        .eq("id", groupId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Group Deleted Successfully :(");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
