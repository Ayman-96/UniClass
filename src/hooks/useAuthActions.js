import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../supabase";
import useGroupStore from "../store/useGroupStore";

export function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearCurrentGroup = useGroupStore((s) => s.setCurrentGroup);

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      clearCurrentGroup();
      queryClient.clear();
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't sign out");
    },
  });
}
