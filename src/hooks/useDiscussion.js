import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

export function useDiscussion(lectureId, slideNumber) {
  return useQuery({
    queryKey: ["discussions", lectureId, slideNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussions")
        .select(`*,discussion_like(count)`) // JOIN disscussion_like, return just the count.
        .eq("lecture_id", lectureId)
        .eq("slide_number", slideNumber)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

export function useAddComment(lectureId, slideNumber) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment) => {
      const { data, error } = await supabase
        .from("discussions")
        .insert(newComment)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["discussions", lectureId, slideNumber],
      }); // invalidates only this lecture+slide
    },
    onError: (error) => {
      console.log("Error from discussions : " + error);
    },
  });
}

export function useDeleteComment(userId, lectureId, slideNumber) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId) => {
      const { data, error } = await supabase
        .from("discussions")
        .delete()
        .eq("id", commentId)
        .eq("user_id", userId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["discussions", lectureId, slideNumber],
      });
    },
    onError: (error) => {
      console.log("Error from discussions : " + error);
    },
  });
}

export function useEditeComment(userId, lectureId, slideNumber) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, newContent }) => {
      const { data, error } = await supabase
        .from("discussions")
        .update({ content: newContent }) // column content = new content
        .eq("id", commentId)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["discussions", lectureId, slideNumber],
      });
    },
    onError: (error) => {
      console.log("Error from discussions : " + error);
    },
  });
}

export function useToggleLike({ userId, lectureId, slideNumber }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ discussionId }) => {
      const { data: existingLike } = await supabase
        .from("discussion_like")
        .select("id")
        .eq("discussion_id", discussionId)
        .eq("user_id", userId)
        .single();

      if (existingLike) {
        const { data, error } = await supabase
          .from("discussion_like")
          .delete()
          .eq("id", existingLike.id);
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("discussion_like")
          .insert({ discussion_id: discussionId, user_id: userId })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["discussions", lectureId, slideNumber],
        //doesn't mean "fetch lectureId and slideNumber."
        //It means "fetch all discussions that belong to this lecture and slide."
      });
    },
    onError: (error) => {
      console.log("Error from discussions : " + error);
    },
  });
}
