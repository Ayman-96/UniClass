import "./LectureView.css";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  MinusIcon,
  PlusIcon,
  Shrink,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { Logo } from "../../../../../welcomePage/Welcome";
import useLectureStore from "../../../../../store/useLectureStore";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function LectureView() {
  const BASE_SCALE = 0.8;
  const pdfRef = useRef(null);
  const { setCurrentSlide } = useLectureStore();
  const { selectedLecture } = useLectureStore();
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(BASE_SCALE);
  const [pageNumber, setPageNumber] = useState(1);
  const [fullScreen, setFullScreen] = useState(false);
  const displayZoom = Math.round((scale / BASE_SCALE) * 100);

  const handleFullScreen = async () => {
    if (pdfRef.current && !document.fullscreenElement) {
      await pdfRef.current.requestFullscreen();
      setFullScreen(true);
    } else {
      await document.exitFullscreen();
      setFullScreen(false);
    }
  };
  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  async function handleDownload(pdfUrl, title) {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}-UniClass.pdf`;
      link.click();
      toast.success("Lecture downloaded!");
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed. Try again.");
    }
  }

  useEffect(() => {
    setCurrentSlide(pageNumber);
  }, [pageNumber, setCurrentSlide]);

  if (!selectedLecture)
    return (
      <div className="no-lecture-selected">
        Select a lecture from the sidebar
      </div>
    );

  return (
    <div className="pdf-view">
      <div className="pdf-header">
        <div className="slide-counter">
          <input
            type="number"
            max={numPages}
            value={pageNumber}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!value) return;
              setPageNumber(Math.min(Math.max(value, 1), numPages));
            }}
          />
          <span>/{numPages}</span>
        </div>

        <div className="pdf-zoom">
          <button
            onClick={() =>
              setScale((prev) => Math.max(prev - 0.1 * BASE_SCALE, 0.4))
            }
          >
            <MinusIcon />
          </button>
          {displayZoom}%
          <button
            onClick={() =>
              setScale((prev) => Math.min(prev + 0.1 * BASE_SCALE, 3.0))
            }
          >
            <PlusIcon />
          </button>
        </div>

        <div className="pdf-download-view">
          <button
            className="download-pdf-btn"
            onClick={() =>
              handleDownload(selectedLecture.pdf_url, selectedLecture.title)
            }
          >
            <Download />
          </button>
          <button className="full-screen-btn" onClick={handleFullScreen}>
            <Expand />
          </button>
        </div>
      </div>
      <div className="pdf-document-wrapper" ref={pdfRef}>
        {fullScreen && (
          <button className="shrink-screen-btn" onClick={handleFullScreen}>
            <Shrink />
          </button>
        )}
        {fullScreen && (
          <div className="pdf-zoom fullscreen-zoom">
            <button
              onClick={() =>
                setScale((prev) => Math.max(prev - 0.1 * BASE_SCALE, 0.4))
              }
            >
              <MinusIcon />
            </button>
            {displayZoom}%
            <button
              onClick={() =>
                setScale((prev) => Math.min(prev + 0.1 * BASE_SCALE, 3.0))
              }
            >
              <PlusIcon />
            </button>
          </div>
        )}

        <button
          className="pdf-nav-arrow left-arrow"
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
        >
          <ChevronLeft />
        </button>

        <Document file={selectedLecture.pdf_url} onLoadSuccess={onLoadSuccess}>
          <Page pageNumber={pageNumber} scale={scale} width={1000} />
        </Document>

        <button
          className="pdf-nav-arrow right-arrow"
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
          disabled={pageNumber >= numPages}
        >
          <ChevronRight />
        </button>
      </div>
      <div className="pdf-footer">
        <Logo />
        <p>
          {pageNumber} / {numPages}
        </p>
      </div>
    </div>
  );
}
export default LectureView;
