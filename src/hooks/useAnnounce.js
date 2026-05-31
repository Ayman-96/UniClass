import { supabase } from "../supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export function useAnnounces(groupId) {
  return useQuery({
    queryKey: ["announcements", groupId], // ← groupId (filter) makes it unique per group
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("group_id", groupId);
      if (error) throw error;
      return data;
    },
  });
}
// Add a new course
export function useAddAnnounce() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAnnouncement) => {
      let img_url = null;
      if (newAnnouncement.imageFile) {
        img_url = await uploadImage(newAnnouncement.imageFile); // URL saved here
      }
      // I passed addCourse here from AddCourse.jsx
      const { data, error } = await supabase
        .from("announcements") // go to the "courses" table
        .insert({ ...newAnnouncement, img_url, imageFile: undefined }) // INSERT this object as a new row
        .select() // return the inserted row back to us
        .single(); // expect exactly 1 row back, not an array
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
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
  const { data, error } = await supabase.storage
    .from("announcement-images")
    .upload(fileName, file); // store FileName to DB first

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("announcement-images")
    .getPublicUrl(fileName); // get the fileName from DB now

  return urlData.publicUrl;
}
