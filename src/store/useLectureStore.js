import { create } from "zustand";
const useLectureStore = create((set) => ({
  selectedLectureId: null,
  selectedLecture: null,
  currentSlide: 1,

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

  setCurrentSlide: (slide) =>
    set({
      currentSlide: slide,
    }),
}));

export default useLectureStore;
