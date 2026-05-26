import { supabase } from "../supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch all posts for a specific group
export function usePosts(groupId) {
  return useQuery({
    queryKey: ["posts", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false }); // newest first
      if (error) throw error;
      return data;
    },
  });
}

// Add a new post
export function useAddPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost) => {
      const { data, error } = await supabase
        .from("posts")
        .insert(newPost)
        .select()
        .single();
      if (error) throw error;
      return data; // into onSuccess
    },
    onSuccess: (data) => {
      console.log("✅ Post created:", data);
      queryClient.invalidateQueries({ queryKey: ["posts", data.group_id] });
    },
    onError: (error) => {
      console.error("❌ Failed:", error.message);
    },
  });
}

// Delete a post
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, groupId }) => {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
      return { groupId }; // pass groupId to onSuccess
    },
    // Delete returns nothing useful from Supabase — so
    // you manually return { groupId } just so onSuccess has something to work with
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("❌ Failed to delete:", error.message);
    },
  });
}
