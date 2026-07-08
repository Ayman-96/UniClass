import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";

export function usePostRedirectInfo(postId) {
  return useQuery({
    queryKey: ["post-redirect", postId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_post_redirect_info", {
        p_post_id: postId,
      });
      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
}
