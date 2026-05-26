import { supabase } from "../supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export function useCourses(groupId) {
  return useQuery({
    queryKey: ["courses", groupId], // ← groupId (filter) makes it unique per group
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("group_id", groupId); //SELECT * FROM courses WHERE group_id = groupId
      if (error) throw error;
      return data;
    },
  });
}
// Add a new course
export function useAddCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCourse) => {
      // I passed addCourse here from AddCourse.jsx
      const { data, error } = await supabase
        .from("courses") // go to the "courses" table
        .insert(newCourse) // INSERT this object as a new row
        .select() // return the inserted row back to us
        .single(); // expect exactly 1 row back, not an array
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log("✅ Course created:", data);
      queryClient.invalidateQueries({ queryKey: ["courses", data.group_id] });
    },
    onError: (error) => {
      console.error("❌ Failed:", error.message);
    },
  });
}
