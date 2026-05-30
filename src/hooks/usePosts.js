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
      console.log("imageFile:", newPost.imageFile); // ← what does this show?
      console.log("type:", typeof newPost.imageFile);
      // 1. if there's an image file, upload it first
      let img_url = null;
      if (newPost.imageFile) {
        img_url = await uploadImage(newPost.imageFile); // URL saved here
      }
      // 2. save the post with the URL (or null if no image)
      const { data, error } = await supabase
        .from("posts")
        .insert({ ...newPost, img_url, imageFile: undefined }) // we dont have imageFile prop, so remove it
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
async function uploadImage(file) {
  console.log("uploading file:", file);
  const fileName = `${Date.now()}-${file.name}`; // create a unique name
  const { data, error } = await supabase.storage
    .from("post-images")
    .upload(fileName, file);
  console.log("upload result:", data, error);
  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
