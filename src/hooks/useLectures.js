import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { toast } from "sonner";

export function useLectures(courseId) {
  return useQuery({
    queryKey: ["lectures", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .eq("course_id", courseId)
        .order("order", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
}

export function useAddLectures() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLecture) => {
      toast.message("Uploading Pdf...");
      let pdf_url = null;
      if (newLecture.pdfFile) {
        pdf_url = await UploadPDF(newLecture.pdfFile);
      }
      const { pdfFile, ...lectureData } = newLecture;
      const { data, error } = await supabase
        .from("lectures")
        .insert({ ...lectureData, pdf_url })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lectures", data.course_id] });
      queryClient.invalidateQueries({ queryKey: ["courses", data.group_id] });
    },
    onError: (error) => {
      console.error("❌ Failed:", error.message);
    },
  });
}
//
export function useDeleteLecture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ lectureId, courseId }) => {
      const { error } = await supabase
        .from("lectures")
        .delete()
        .eq("id", lectureId);
      if (error) throw error;
      return { courseId };
    },
    onSuccess: ({ courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["lectures", courseId] });
      // without courseId refetches all lectures everywhere
    },
    onError: (error) => {
      console.error("❌ Failed to delete:", error.message);
    },
  });
}

async function UploadPDF(file) {
  const sanitizedName = file.name.normalize("NFKD").replace(/[^\w.\-]+/g, "_");
  const fileName = `${Date.now()}-${sanitizedName}`;

  const { error } = await supabase.storage
    .from("lecture-pdfs")
    .upload(fileName, file);
  if (error) throw new Error(`Storage Error: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from("lecture-pdfs")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
