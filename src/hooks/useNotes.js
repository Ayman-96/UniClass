import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
// add userId in param
export function useNotes(lectureId, slideNumber) {
  return useQuery({
    queryKey: ["notes", lectureId, slideNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("lecture_id", lectureId)
        .eq("slide_number", slideNumber)
        // .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}

export function useAddNote(lectureId, slideNumber) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newNote) => {
      const { data, error } = await supabase
        .from("notes")
        .insert(newNote)
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
      console.log("Error from Notes : ");
      console.log(error);
    },
  });
}
export function useEditNote(userId, lectureId, slideNumber) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ newContent, noteId }) => {
      const { data, error } = await supabase
        .from("notes")
        .update({ content: newContent })
        .eq("id", noteId)
        .eq("user_id", userId)
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
      console.log("Error from  edit notes : " + error);
    },
  });
}

export function useDeleteNote({ userId, lectureId, slideNumber }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteId) => {
      const { data, error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .eq("user_id", userId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", lectureId, slideNumber],
      });
    },
    onError: (error) => {
      console.log("Error from notes : " + error);
    },
  });
}
