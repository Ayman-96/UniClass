import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";

export function useSaveProfile() {
  return useMutation({
    mutationFn: async (profileData) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) throw new Error("Not authenticated");

      let avatar_url = null;

      if (profileData.avatar) {
        const fileExt = profileData.avatar.name.split(".").pop();
        const fileName = `${user.id}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, profileData.avatar, { upsert: true });

        if (uploadError) throw new Error(uploadError.message);

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatar_url = data.publicUrl;
      }

      // eslint-disable-next-line no-unused-vars
      const { avatar, ...rest } = profileData;

      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        ...rest,
        avatar_url,
      });

      if (error) throw new Error(error.message);
    },
  });
}

export function useProfile(userId) {
  const { user } = useAuth();
  const id = userId || user?.id; // if id not passed then its my profiles

  return useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, updates }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile", data.id] });
    },
    onError: (error) => {
      console.error("update failed:", error);
    },
  });
}

export function useSearchProfiles(searchTerm) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profiles", "search", searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .or(
          `username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,tag.ilike.%${searchTerm}%`,
        )
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!searchTerm && !!user?.id,
  });
}
