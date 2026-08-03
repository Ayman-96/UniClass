import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  isOpenSideBar: false,
  setIsOpenSideBar: (value) =>
    set((state) => ({
      isOpenSideBar:
        typeof value === "function" ? value(state.isOpenSideBar) : value,
    })),
}));
