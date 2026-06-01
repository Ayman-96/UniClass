import { create } from "zustand";
const useLectureStore = create((set) => ({
  selectedLectureId: null,
  selectedLecture: null,

  setSelectedLecture: (lecture) =>
    set({
      selectedLectureId: lecture.id,
      selectedLecture: lecture,
    }),
  clearSelectedLecture: () =>
    set({
      selectedLectureId: null,
      selectedLecture: null,
    }),
}));
export default useLectureStore;
