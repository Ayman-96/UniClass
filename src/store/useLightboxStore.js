// store/useLightboxStore.js
import { create } from "zustand";

const useLightboxStore = create((set) => ({
  openImageUrl: null,
  openLightbox: (url) => {
    console.log(url);
    set({ openImageUrl: url });
  },
  closeLightbox: () => set({ openImageUrl: null }),
}));

export default useLightboxStore;
