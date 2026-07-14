import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";

const NOTIF_KEY = ["notifications"];

/**
 * Fetches the current user's notifications, most recent first.
 * actor is embedded via the actor_id FK -> profiles.
 */
export function useNotifications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: NOTIF_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          id, user_id, actor_id, type, title, body,
          entity_type, entity_id, group_id, metadata,
          is_read, created_at,
          actor:profiles!notifications_actor_id_fkey (id, username, avatar_url)
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

/**
 * Subscribes to realtime INSERTs on notifications for the current user.
 * Mount this ONCE near the app root (persistent layout), not per-page —
 * otherwise the channel gets torn down/recreated on every navigation,
 * the same remount issue you're chasing with SideNav.
 */
export function useNotificationsRealtime() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          let actor = null;
          if (payload.new.actor_id) {
            const { data } = await supabase
              .from("profiles")
              .select("id, username, avatar_url")
              .eq("id", payload.new.actor_id)
              .single();
            actor = data;
          }

          queryClient.setQueryData(NOTIF_KEY, (old = []) => [
            { ...payload.new, actor },
            ...old,
          ]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}

/** Derive unread count from the cached list — no separate store needed. */
export function useUnreadCount() {
  const { data: notifications = [] } = useNotifications();
  return notifications.filter((n) => !n.is_read).length;
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIF_KEY });
    },
  });
}

export function useMarkAllAsRead() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIF_KEY });
    },
  });
}

export function useRespondToInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ notificationId, accept }) => {
      const { error } = await supabase.rpc("respond_group_invite", {
        p_notification_id: notificationId,
        p_accept: accept,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIF_KEY });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useRespondFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, accept, notificationId }) => {
      const { error } = await supabase.rpc("respond_friend_request", {
        request_id: requestId,
        new_status: accept ? "accepted" : "declined",
      });
      if (error) throw error;

      // mark the notification read so the buttons don't linger after responding
      if (notificationId) {
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("id", notificationId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIF_KEY });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
}
