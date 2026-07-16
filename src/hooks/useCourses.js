import { toast } from "sonner";
import { supabase } from "../supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../AuthContext";
export function useCourses(groupId) {
  return useQuery({
    queryKey: ["courses", groupId], // ← groupId (filter) makes it unique per group
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, lectures(count)")
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

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId) => {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["saved-courses"] });
    },
    onError: (error) => {
      console.log("❌ Failed to delete:", error.message);
    },
  });
}

export function useSavedCourses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: savedCourses = [], isLoading } = useQuery({
    queryKey: ["saved-courses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_courses")
        .select("id, course_id, courses(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map((row) => ({ savedId: row.id, ...row.courses }));
    },
    enabled: !!user?.id,
  });

  const saveCourse = useMutation({
    mutationFn: async (courseId) => {
      const { error } = await supabase
        .from("saved_courses")
        .insert({ user_id: user.id, course_id: courseId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-courses", user?.id] });
    },
    onError: (error) => {
      if (error.message.includes("Saved course limit reached")) {
        toast.error("You can only save up to 6 courses");
      } else if (error.code === "23505") {
        toast.error("Course already saved");
      } else {
        toast.error("Failed to save course");
      }
    },
  });

  const unsaveCourse = useMutation({
    mutationFn: async (courseId) => {
      const { error } = await supabase
        .from("saved_courses")
        .delete()
        .eq("user_id", user.id)
        .eq("course_id", courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-courses", user?.id] });
    },
    onError: () => toast.error("Failed to unsave course"),
  });

  const isSaved = (courseId) => savedCourses.some((c) => c.id === courseId);

  return { savedCourses, isLoading, saveCourse, unsaveCourse, isSaved };
}
