import "./LectureView.css";
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
import { supabase } from "../../../../../supabase";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import useLectureStore from "../../../../../store/useLectureStore";
import { Logo } from "../../../../../components/Logo";
import handleDownload from "../../../../../components/DownloadFile";
import { useParams } from "react-router-dom";
import { useLectures } from "../../../../../hooks/useLectures";
import { useDiscussion } from "../../../../../hooks/useDiscussion";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function LectureView({ isMobile }) {
  const BASE_SCALE = 0.8;
  const pdfRef = useRef(null);

  const { courseId, lectureId } = useParams();
  const { data: lectures } = useLectures(courseId);
  const selectedLecture = lectures?.find((l) => l.id === lectureId);

  const { setCurrentSlide } = useLectureStore();
  const [signedPdfUrl, setSignedPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(BASE_SCALE);
  const [pageNumber, setPageNumber] = useState(1);
  const [fullScreen, setFullScreen] = useState(false);
  const displayZoom = Math.round((scale / BASE_SCALE) * 100);

  const { data: storedComments = [] } = useDiscussion(
    selectedLecture?.id,
    pageNumber,
  );

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

  useEffect(() => {
    setCurrentSlide(pageNumber);
  }, [pageNumber, setCurrentSlide]);

  useEffect(() => {
    if (!selectedLecture?.pdf_url) return;

    const path = selectedLecture.pdf_url.split("/lecture-pdfs/")[1];

    supabase.storage
      .from("lecture-pdfs")
      .createSignedUrl(path, 3600) // 1 hour
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to get signed URL:", error.message);
          return;
        }
        setSignedPdfUrl(data.signedUrl);
      });
  }, [selectedLecture]);
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
            min={1}
            max={numPages}
            defaultValue={pageNumber}
            key={pageNumber}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              const value = Number(e.target.value);
              if (Number.isNaN(value)) return;
              setPageNumber(Math.min(Math.max(value, 1), numPages));
              e.target.blur();
            }}
          />
          <span>/{numPages}</span>
        </div>

        <div className="zoom-and-comment-count">
          <div className="pdf-zoom">
            <button
              onClick={() =>
                setScale((prev) => Math.max(prev - 0.1 * BASE_SCALE, 0.24))
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
          <div className="comments-per-slide">
            {isMobile
              ? storedComments?.length
              : storedComments?.length + " Comments"}
          </div>
        </div>

        <div className="pdf-download-view">
          <button
            className="download-pdf-btn"
            onClick={() =>
              handleDownload(
                signedPdfUrl,
                selectedLecture.title,
                "Lecture Downloaded",
              )
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
                setScale((prev) => Math.max(prev - 0.1 * BASE_SCALE, 0.24))
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
        {numPages && (
          <>
            <div
              className="pdf-tap-zone pdf-tap-left"
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            />
            <div
              className="pdf-tap-zone pdf-tap-right"
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, numPages))
              }
            />
          </>
        )}

        {!fullScreen && !isMobile && (
          <button
            className="pdf-nav-arrow left-arrow"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft />
          </button>
        )}
        <Document file={signedPdfUrl} onLoadSuccess={onLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            scale={scale}
            width={isMobile ? undefined : 1000}
          />
        </Document>

        {!fullScreen && !isMobile && (
          <button
            className="pdf-nav-arrow right-arrow"
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages))
            }
            disabled={pageNumber >= numPages}
          >
            <ChevronRight />
          </button>
        )}
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
