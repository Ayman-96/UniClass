import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";

export function useSaveProfile() {
  return useMutation({
    mutationFn: async (profileData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

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

      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        ...profileData,
        avatar_url,
      });

      if (error) throw new Error(error.message);
    },
  });
}
