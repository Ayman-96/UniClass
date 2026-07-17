import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useEffect } from "react";

export function useGlobalMessageToast() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`global-messages:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        async (payload) => {
          const m = payload.new;

          const { data: sender } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", m.sender_id)
            .single();

          toast.message(sender?.username || "New message", {
            description: m.content || "📷 Photo",
          });

          queryClient.invalidateQueries({
            queryKey: ["conversations", user.id],
          });
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user?.id, queryClient]);
}
