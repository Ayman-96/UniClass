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
        .select("*, profiles(username,avatar_url,role), post_files(*)")
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
      let img_url = null;
      if (newPost.imageFile) {
        img_url = await uploadImage(newPost.imageFile);
      }

      const { data: post, error } = await supabase
        .from("posts")
        .insert({
          ...newPost,
          img_url,
          imageFile: undefined,
          files: undefined,
        })
        .select()
        .single();
      if (error) throw error;

      // Notify anyone @mentioned in the post content
      const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
      const mentionedIds = [
        ...(newPost.content?.matchAll(mentionRegex) ?? []),
      ].map((m) => m[2]);
      if (mentionedIds.length > 0) {
        const { error: mentionError } = await supabase.rpc(
          "notify_mentions_by_id",
          {
            p_entity_type: "post",
            p_entity_id: post.id,
            p_group_id: post.group_id,
            p_user_ids: mentionedIds,
          },
        );
        if (mentionError)
          console.error("Mention notify failed:", mentionError.message);
      }

      let uploadedFiles = [];
      if (newPost.files?.length) {
        uploadedFiles = await Promise.all(
          newPost.files.map(async (file) => {
            const filePath = `${newPost.author_id}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
              .from("post-files")
              .upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
              .from("post-files")
              .getPublicUrl(filePath);

            return {
              post_id: post.id,
              url: urlData.publicUrl,
              name: file.name,
              type: file.type,
              size: file.size,
            };
          }),
        );

        const { error: filesError } = await supabase
          .from("post_files")
          .insert(uploadedFiles);
        if (filesError) throw filesError;
      }

      return { ...post, post_files: uploadedFiles };
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
