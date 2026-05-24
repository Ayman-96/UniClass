import { supabase } from "../supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
/*
useQuery → GET/fetch data
useMutation → POST/PUT/DELETE/update data
useQueryClient → control cache */

// Fetch all groups
export function useGroups() {
  // custom react hook
  // create a query :
  return useQuery({
    queryKey: ["groups"], // TanStack Query stores fetched data under this key.
    queryFn: async () => {
      const { data, error } = await supabase.from("groups").select("*");
      // SQL : SELECT * FROM groups
      if (error) throw error;
      return data; // Now data contains all groups.
    },
  });
}

// Add a new group
export function useAddGroup() {
  const queryClient = useQueryClient(); // This gives access to TanStack Query cache.

  // This function runs when you call: addGroupMutation.mutate(...)
  return useMutation({
    mutationFn: async (newGroup) => {
      const { data, error } = await supabase
        .from("groups")
        .insert(newGroup) // insert new row into groups
        .select() // return inserted row
        .single(); // .single() means expect one object, not array

      if (error) throw error;
      return data;
    },
    // TanStack Query automatically updates UI
    onSuccess: () => {
      queryClient.invalidateQueries(["groups"]);
    },
    // “after adding a group, refetch the groups list”
    // Because the cached "groups" data is now outdated.
    // Without this: UI would still show old groups
  });
}
///////////////////
/*
Fetch groups : 
Component
  ↓
useGroups()
  ↓
TanStack Query cache
  ↓
Supabase
  ↓
Database
 */
///////////////////
/*
 Add group ?
mutate(newGroup)
  ↓
Supabase insert
  ↓
success
  ↓
invalidate "groups"
  ↓
auto refetch
  ↓
UI updates
 */
