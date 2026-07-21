// components/Lightbox.jsx
import useLightboxStore from "../store/useLightboxStore";
import { X } from "lucide-react";

function Lightbox() {
  const { openImageUrl, closeLightbox } = useLightboxStore();

  if (!openImageUrl) return null;

  return (
    <div className="lightbox-overlay" onClick={closeLightbox}>
      <button className="lightbox-close" onClick={closeLightbox}>
        <X />
      </button>
      <img
        src={openImageUrl}
        className="lightbox-img"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default Lightbox;
