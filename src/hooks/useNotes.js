import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";
import { uploadCommentImage } from "./useUploadImage";

export function useNotes(lectureId, slideNumber) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notes", lectureId, slideNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("lecture_id", lectureId)
        .eq("slide_number", slideNumber)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

export function useAddNote(lectureId, slideNumber) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ imgFile, ...newNote }) => {
      let img_url = null;

      if (imgFile) {
        img_url = await uploadCommentImage(
          imgFile,
          "discussion-images",
          user.id,
        );
      }

      const { data, error } = await supabase
        .from("notes")
        .insert({ ...newNote, img_url })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", lectureId, slideNumber],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
export function useEditNote(lectureId, slideNumber) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ noteId, newContent }) => {
      const { data, error } = await supabase
        .from("notes")
        .update({ content: newContent })
        .eq("id", noteId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", lectureId, slideNumber],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
export function useDeleteNote(lectureId, slideNumber) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteId) => {
      const { data, error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", lectureId, slideNumber],
      });
    },
    onError: (error) => {
      console.error("Error from notes : " + error);
    },
  });
}
