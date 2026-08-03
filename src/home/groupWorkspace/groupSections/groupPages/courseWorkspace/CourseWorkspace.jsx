import "./CourseWorkspace.css";
import { useEffect, useState } from "react";
import LectureView from "./LectureView";
import { PanelRightOpen, PanelLeftOpen } from "lucide-react";
import CourseSidebar from "./CourseSidebar";
import { useParams } from "react-router-dom";
import LectureDiscussion from "./LectureDiscussion";
import { useLectures } from "../../../../../hooks/useLectures";
import LoadingSpinner from "../../../../../components/loadingSpinner/LoadingSpinner";

function CourseWorkspace() {
  const { courseId, lectureId } = useParams();
  const [toDelete, setToDelete] = useState(false);
  const { data: lectures } = useLectures(courseId);
  const selectedLecture = lectures?.find((l) => l.id === lectureId);
  const [isOpenDiscussion, setIsOpenDiscussion] = useState(false);
  const { isLoading, isError } = useLectures(courseId);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches,
  );

  function handleOpenDiscussion() {
    setIsOpenDiscussion((prev) => !prev);
  }

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const handleChange = (e) => setIsMobile(e.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error Occured!</div>;

  return (
    <div className="course-workspace">
      <CourseSidebar toDelete={toDelete} setToDelete={setToDelete} />
      <div className="course-main">
        <LectureView key={selectedLecture?.id} isMobile={isMobile} />
      </div>

      <div
        className={`course-discussion ${isOpenDiscussion ? "is-open" : "is-closed"}`}
      >
        {selectedLecture && !toDelete && (
          <button
            className="discussion-toggle-btn"
            onClick={handleOpenDiscussion}
          >
            {!isOpenDiscussion ? <PanelRightOpen /> : <PanelLeftOpen />}
          </button>
        )}
        {isOpenDiscussion && (
          <LectureDiscussion
            selectedLecture={selectedLecture}
            setIsOpenDiscussion={setIsOpenDiscussion}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
}

export default CourseWorkspace;
