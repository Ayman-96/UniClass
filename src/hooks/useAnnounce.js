import { useAuth } from "../AuthContext";
import { supabase } from "../supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadCommentImage } from "./useUploadImage";

export function useAnnounces(groupId) {
  return useQuery({
    queryKey: ["announcements", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*, profiles(username,avatar_url), announcement_files(*)")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// Add a new announcement
export function useAddAnnounce() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAnnouncement) => {
      let img_url = null;
      if (newAnnouncement.imageFile) {
        img_url = await uploadImage(newAnnouncement.imageFile);
      }

      const { data: announcement, error } = await supabase
        .from("announcements")
        .insert({
          ...newAnnouncement,
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
        ...(newAnnouncement.content?.matchAll(mentionRegex) ?? []),
      ].map((m) => m[2]);
      if (mentionedIds.length > 0) {
        const { error: mentionError } = await supabase.rpc(
          "notify_mentions_by_id",
          {
            p_entity_type: "post",
            p_entity_id: announcement.id,
            p_group_id: announcement.group_id,
            p_user_ids: mentionedIds,
          },
        );
        if (mentionError)
          console.error("Mention notify failed:", mentionError.message);
      }

      let uploadedFiles = [];
      if (newAnnouncement.files?.length) {
        uploadedFiles = await Promise.all(
          newAnnouncement.files.map(async (file) => {
            const filePath = `${newAnnouncement.author_id}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
              .from("announcement-files")
              .upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
              .from("announcement-files")
              .getPublicUrl(filePath);

            return {
              announcement_id: announcement.id,
              url: urlData.publicUrl,
              name: file.name,
              type: file.type,
              size: file.size,
            };
          }),
        );

        const { error: filesError } = await supabase
          .from("announcement_files")
          .insert(uploadedFiles);
        if (filesError) throw filesError;
      }

      return { ...announcement, announcement_files: uploadedFiles };
    },
    onSuccess: (data) => {
      console.log("✅ Announcement created:", data);
      queryClient.invalidateQueries({
        queryKey: ["announcements", data.group_id],
      });
    },
    onError: (error) => {
      console.error("❌ Failed:", error.message);
    },
  });
}

export function useDeleteAnnounce() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announceId) => {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", announceId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error) => {
      console.log("❌ Failed to delete:", error.message);
    },
  });
}
async function uploadImage(file) {
  const fileName = `${Date.now()}-${file.name}`; // create a unique name
  const { error } = await supabase.storage
    .from("announcement-images")
    .upload(fileName, file); // store FileName to DB first

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("announcement-images")
    .getPublicUrl(fileName); // get the fileName from DB now

  return urlData.publicUrl;
}

// ANNOUNCEMENT LIKES/DISLIKES

export function useAnnouncementLikes(announcementIds) {
  return useQuery({
    queryKey: ["announcement_likes", announcementIds],
    queryFn: async () => {
      if (!announcementIds || announcementIds.length === 0) return [];

      const { data, error } = await supabase
        .from("announcement_likes")
        .select("announcement_id, user_id, type")
        .in("announcement_id", announcementIds);

      if (error) throw error;

      return data;
    },
    enabled: !!announcementIds && announcementIds.length > 0,
  });
}

export function useToggleAnnouncementLike() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ announcementId, currentVote, newType }) => {
      if (currentVote === newType) {
        // clicking the same button again removes the vote
        const { error } = await supabase
          .from("announcement_likes")
          .delete()
          .eq("announcement_id", announcementId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else if (currentVote) {
        // switching from like to dislike or vice versa
        const { error } = await supabase
          .from("announcement_likes")
          .update({ type: newType })
          .eq("announcement_id", announcementId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // no existing vote, insert new one
        const { error } = await supabase.from("announcement_likes").insert({
          announcement_id: announcementId,
          user_id: user.id,
          type: newType,
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcement_likes"] });
    },
  });
}

// ANNOUNCEMENT COMMENTS

export function useAnnouncementComments(announceId) {
  return useQuery({
    queryKey: ["announcement_comments", announceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcement_comments")
        .select(
          "id, announcement_id, user_id, content, parent_comment_id, created_at, image, profiles(username, avatar_url), announcement_comment_likes(user_id)",
        )
        .eq("announcement_id", announceId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!announceId,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      announceId,
      content,
      parentCommentId = null,
      file,
    }) => {
      let imageUrl = null;

      if (file) {
        imageUrl = await uploadCommentImage(
          file,
          "post-comment-images",
          user.id,
        );
      }
      const { error } = await supabase.from("announcement_comments").insert({
        announcement_id: announceId,
        user_id: user.id,
        content,
        parent_comment_id: parentCommentId,
        image: imageUrl,
      });

      if (error) throw error;
    },
    onSuccess: (_, { announceId }) => {
      queryClient.invalidateQueries({
        queryKey: ["announcement_comments", announceId],
      });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }) => {
      const { error } = await supabase
        .from("announcement_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcement_comments"] });
    },
  });
}
