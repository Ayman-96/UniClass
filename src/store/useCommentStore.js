import { create } from "zustand";
const useCommentStore = create((set) => ({
  commentId: null,
  noteId: null,

  setCommentId: (id) =>
    set({
      commentId: id,
    }),

  setNoteId: (id) =>
    set({
      noteId: id,
    }),
}));
export default useCommentStore;
