import { create } from "zustand";
const useLectureStore = create((set) => ({
  currentSlide: 1,
  setCurrentSlide: (slide) =>
    set({
      currentSlide: slide,
    }),
}));

export default useLectureStore;
