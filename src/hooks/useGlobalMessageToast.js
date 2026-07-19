import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";
import { toast } from "sonner";
import useChatUIStore from "../store/useChatUiStore";

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
          const openChatWithUserId =
            useChatUIStore.getState().openChatWithUserId;

          if (openChatWithUserId === m.sender_id) {
            await supabase
              .from("messages")
              .update({ read_at: new Date().toISOString() })
              .eq("id", m.id);

            await supabase
              .from("notifications")
              .delete()
              .eq("user_id", user.id)
              .eq("entity_type", "message")
              .eq("entity_id", m.id);

            queryClient.invalidateQueries({
              queryKey: ["conversations", user.id],
            });
            queryClient.invalidateQueries({
              queryKey: ["notifications"],
            });
            return;
          }

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
