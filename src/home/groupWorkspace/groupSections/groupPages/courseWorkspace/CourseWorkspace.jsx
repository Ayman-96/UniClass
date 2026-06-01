import "./CourseWorkspace.css";
import { useState } from "react";
import LectureView from "./LectureView";
import { PanelRightOpen, PanelLeftOpen } from "lucide-react";
import CourseSidebar from "./CourseSidebar";
import { useParams } from "react-router-dom";
import LectureDiscussion from "./LectureDiscussion";
import { useLectures } from "../../../../../hooks/useLectures";
import useLectureStore from "../../../../../store/useLectureStore";
import LoadingSpinner from "../../../../../components/loadingSpinner/LoadingSpinner";

function CourseWorkspace() {
  const { courseId } = useParams();
  const { selectedLecture } = useLectureStore();
  const [isOpenDiscussion, setIsOpenDiscussion] = useState(false);
  const { data: storedLectures, isLoading, isError } = useLectures(courseId);

  function handleOpenDiscussion() {
    setIsOpenDiscussion((prev) => !prev);
  }
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error Occured!</div>;
  return (
    <div className="course-workspace">
      <CourseSidebar />
      <div className="course-main">
        <LectureView key={selectedLecture?.id} />
      </div>

      <div
        className={`course-discussion ${isOpenDiscussion ? "is-open" : "is-closed"}`}
      >
        {selectedLecture && (
          <button
            className="discussion-toggle-btn"
            onClick={handleOpenDiscussion}
          >
            {!isOpenDiscussion ? <PanelRightOpen /> : <PanelLeftOpen />}
          </button>
        )}
        {isOpenDiscussion && <LectureDiscussion />}
      </div>
    </div>
  );
}

export default CourseWorkspace;
