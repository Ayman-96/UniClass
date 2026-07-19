// store/useChatUIStore.js
import { create } from "zustand";

const useChatUIStore = create((set) => ({
  openChatWithUserId: null,
  setOpenChatWithUserId: (id) => set({ openChatWithUserId: id }),
}));

export default useChatUIStore;
