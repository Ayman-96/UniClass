import { create } from "zustand";
const useGroupStore = create((set) => ({
  currentGroup: null,

  setCurrentGroup: (group) =>
    set({
      currentGroup: group,
    }),
}));
export default useGroupStore;

// const currentGroup = useGroupStore((curr) => curr.currentGroup);
