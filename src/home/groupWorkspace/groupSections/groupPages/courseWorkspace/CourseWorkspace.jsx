import "./CourseWorkspace.css";
import { useParams } from "react-router-dom";
import CourseSidebar from "./CourseSidebar";
import { useLectures } from "../../../../../hooks/useLectures";
import LoadingSpinner from "../../../../../components/loadingSpinner/LoadingSpinner";
import LectureView from "./LectureView";
import useLectureStore from "../../../../../store/useLectureStore";
function CourseWorkspace() {
  const { courseId } = useParams();
  const { selectedLecture } = useLectureStore();
  const { data: storedLectures, isLoading, isError } = useLectures(courseId);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error Occured!</div>;
  return (
    <div className="course-workspace">
      <CourseSidebar />
      <div className="course-main">
        <LectureView key={selectedLecture?.id} />
      </div>
      <div className="course-comments">{/* Comments panel goes here */}</div>
    </div>
  );
}
export default CourseWorkspace;
