import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../AuthContext";

// List of conversations: distinct users you've messaged, with last message
export function useConversations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["conversations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          id, content, image_url, created_at, sender_id, receiver_id, read_at,
          sender:sender_id(id, username, avatar_url),
          receiver:receiver_id(id, username, avatar_url)
        `,
        )
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Collapse to one row per other-user, keeping the most recent
      const map = new Map();
      for (const m of data) {
        const otherUser = m.sender_id === user.id ? m.receiver : m.sender;
        if (!map.has(otherUser.id)) {
          map.set(otherUser.id, { otherUser, lastMessage: m });
        }
      }
      return Array.from(map.values());
    },
  });
}

// Messages in a single thread with another user
export function useMessages(otherUserId) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["messages", user?.id, otherUserId];

  const query = useQuery({
    queryKey,
    enabled: !!user && !!otherUserId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`,
        )
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Realtime subscription for this thread
  useEffect(() => {
    if (!user || !otherUserId) return;

    const channel = supabase
      .channel(`messages:${user.id}:${otherUserId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new;
          const isThisThread =
            (m.sender_id === user.id && m.receiver_id === otherUserId) ||
            (m.sender_id === otherUserId && m.receiver_id === user.id);
          if (!isThisThread) return;

          queryClient.setQueryData(queryKey, (old = []) => {
            if (old.some((x) => x.id === m.id)) return old;
            return [...old, m];
          });
          queryClient.invalidateQueries({
            queryKey: ["conversations", user.id],
          });
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user?.id, otherUserId]);

  return query;
}

// Send a message, optionally with an image
export function useSendMessage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ receiverId, content, imageFile }) => {
      let imageUrl = null;

      if (imageFile) {
        const path = `${user.id}/${nanoid()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("chat-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("chat-images")
          .getPublicUrl(path);
        imageUrl = data.publicUrl;
      }

      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: content || null,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, { receiverId }) => {
      queryClient.setQueryData(
        ["messages", user.id, receiverId],
        (old = []) => [...old, data],
      );
      queryClient.invalidateQueries({ queryKey: ["conversations", user.id] });
    },
  });
}

// Mark all messages from a user as read
export function useMarkAsRead() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUserId) => {
      const { error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("receiver_id", user.id)
        .eq("sender_id", otherUserId)
        .is("read_at", null);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", user.id] });
    },
  });
}
