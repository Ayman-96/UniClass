import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { toast } from "sonner";

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (newPassword) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    },
    onSuccess: () => toast.success("Password updated"),
    onError: (err) => toast.error(err.message),
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("delete_user_account");
      if (error) throw error;
      await supabase.auth.signOut();
    },
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (err) => toast.error(err.message),
  });
};
