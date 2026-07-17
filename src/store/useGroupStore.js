import { create } from "zustand";
const useGroupStore = create((set) => ({
  currentGroup: null,

  setCurrentGroup: (group) =>
    set({
      currentGroup: group,
    }),
  clearCurrentGroup: () =>
    set({
      currentGroup: null,
    }),
}));
export default useGroupStore;

// const currentGroup = useGroupStore((curr) => curr.currentGroup);
