import { supabase } from "../supabase";
import { useAuth } from "../AuthContext.jsx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadCommentImage } from "./useUploadImage.js";

// Fetch all posts for a specific group
export function usePosts(groupId) {
  return useQuery({
    queryKey: ["posts", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(username,avatar_url,role)")
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
  const fileName = `${Date.now()}-${file.name}`; // create a unique name
  const { error } = await supabase.storage
    .from("post-images")
    .upload(fileName, file);
  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("post-images")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// LIKES

export function useToggleLike() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, isCurrentlyLiked }) => {
      if (isCurrentlyLiked) {
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("post_likes")
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-likes"] });
    },
  });
}

// read- fetch liked
export function usePostLikes(postIds) {
  return useQuery({
    queryKey: ["post-likes", postIds],
    queryFn: async () => {
      if (!postIds || postIds.length === 0) return [];

      const { data, error } = await supabase
        .from("post_likes")
        .select("post_id, user_id")
        .in("post_id", postIds);

      if (error) throw error;

      return data;
    },
    enabled: !!postIds && postIds.length > 0,
    // don't even run this query if there are no posts loaded yet
  });
}

// POST COMMENTS //

export function usePostComments(postId) {
  return useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_comments")
        .select(
          "id, post_id, user_id, content, parent_comment_id, created_at, image, profiles(username, avatar_url), post_comment_likes(user_id)",
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ postId, content, parentCommentId = null, file }) => {
      let imageUrl = null;

      if (file) {
        imageUrl = await uploadCommentImage(
          file,
          "post-comment-images",
          user.id,
        );
      }

      const { error } = await supabase.from("post_comments").insert({
        post_id: postId,
        user_id: user.id,
        content,
        parent_comment_id: parentCommentId,
        image: imageUrl,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }) => {
      const { error } = await supabase
        .from("post_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments"] });
    },
  });
}
