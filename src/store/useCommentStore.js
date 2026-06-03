import { create } from "zustand";
const useCommentStore = create((set) => ({
  commentId: null,

  setCommentId: (id) =>
    set({
      commentId: id,
    }),
}));
export default useCommentStore;
