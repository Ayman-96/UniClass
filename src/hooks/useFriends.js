// hooks/useFriends.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { toast } from "sonner";
import { useAuth } from "../AuthContext.jsx";

export function useFriends() {
  const { user } = useAuth();
  const userId = user?.id;
  return useQuery({
    queryKey: ["friends", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("friendships")
        .select(
          `
          id,
          requester_id,
          addressee_id,
          status,
          created_at,
          requester:profiles!friendships_requester_id_fkey(id, full_name,username,department,stage,last_seen, avatar_url),
          addressee:profiles!friendships_addressee_id_fkey(id, full_name,username, department,stage,last_seen, avatar_url)
        `,
        )
        .eq("status", "accepted")
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

      if (error) throw error;

      // normalize so each row returns "the other person"
      return data.map((row) => {
        const isRequester = row.requester_id === userId;
        return {
          friendshipId: row.id,
          since: row.created_at,
          profile: isRequester ? row.addressee : row.requester,
        };
      });
    },
    enabled: !!userId,
  });
}

export function useFriendRequests() {
  const { user } = useAuth();
  const userId = user?.id;
  const received = useQuery({
    queryKey: ["friendRequests", "received", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("friendships")
        .select(
          `
          id,
          created_at,
          requester:profiles!friendships_requester_id_fkey(id, full_name,username, avatar_url)
        `,
        )
        .eq("status", "pending")
        .eq("addressee_id", userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const sent = useQuery({
    queryKey: ["friendRequests", "sent", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("friendships")
        .select(
          `
          id,
          created_at,
          addressee:profiles!friendships_addressee_id_fkey(id, full_name,username, avatar_url)
        `,
        )
        .eq("status", "pending")
        .eq("requester_id", userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  return { received, sent };
}

export function useSendFriendRequest() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetId) => {
      const { data, error } = await supabase.rpc("send_friend_request", {
        target_id: targetId,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendRequests", "sent", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["suggestions", userId] });
      toast.success("Friend request sent");
    },
    onError: (error) => {
      toast.error(error.message || "Could not send request");
    },
  });
}

export function useRespondFriendRequest() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, status }) => {
      const { data, error } = await supabase.rpc("respond_friend_request", {
        request_id: requestId,
        new_status: status,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["friendRequests", "received", userId],
      });
      if (variables.status === "accepted") {
        queryClient.invalidateQueries({ queryKey: ["friends", userId] });
        toast.success("Friend request accepted");
      } else {
        toast.success("Request declined");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Could not respond to request");
    },
  });
}

export function useRemoveFriend() {
  const { user } = useAuth();
  const userId = user?.id;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUserId) => {
      const { error } = await supabase.rpc("remove_friend", {
        other_user_id: otherUserId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", userId] });
      toast.success("Removed from your friends list");
    },
    onError: (error) => {
      toast.error(error.message || "Could not remove classmate");
    },
  });
}

// hooks/useFriendMutations.js
export function useCancelFriendRequest() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId) => {
      const { error } = await supabase.rpc("cancel_friend_request", {
        request_id: requestId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["friendRequests", "sent", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["suggestions", user?.id] });
      toast.success("Request cancelled");
    },
    onError: (error) => {
      toast.error(error.message || "Could not cancel request");
    },
  });
}
