import "./CourseSidebar.css";
import { Link, NavLink, useParams } from "react-router-dom";
import {
  BookCopy,
  BookOpen,
  FileIcon,
  House,
  LockIcon,
  Plus,
} from "lucide-react";
import { useCourses } from "../../../../../hooks/useCourses";
import { useAddLectures, useLectures } from "../../../../../hooks/useLectures";
import LoadingSpinner from "../../../../../components/loadingSpinner/LoadingSpinner";
import { useIsRep } from "../../../../../hooks/useIsRep";
import { COURSE_ICON_MAP } from "../../../../../data/addCourseData";
import { useAuth } from "../../../../../AuthContext";

function CourseSidebar() {
  const { user } = useAuth();
  const { courseId, groupId, lectureId } = useParams();
  const { data: isRep } = useIsRep(groupId);

  const { mutate: addLecture } = useAddLectures();
  const { data: storedCourses = [] } = useCourses(groupId);
  const { data: lectures } = useLectures(courseId);
  const selectedLecture = lectures?.find((l) => l.id === lectureId);
  const { data: storedLectures, isLoading, isError } = useLectures(courseId);
  const courseDetails = storedCourses?.find((course) => course.id === courseId);
  const CourseIcon = COURSE_ICON_MAP[courseDetails?.icon] || BookOpen;

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error Occured!</div>;

  function handleAddLecture(e) {
    const file = e.target.files[0];

    if (!file) return;

    addLecture({
      course_id: courseId,
      group_id: groupId,
      title: file.name
        .replace(/^\d+-/, "")
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " "),
      pdfFile: file,
      uploaded_by: user.id,
      slide_count: 0,
    });
  }

  return (
    <div className="lecture-sidebar">
      <div className="return-home">
        <Link to="/home/dashboard">
          <House />
        </Link>
        <Link to={`/home/group/${groupId}/courses`}>
          <BookCopy />
        </Link>
      </div>
      <div className="lec-nav-head">
        <div
          className="course-icon"
          style={{
            backgroundColor: courseDetails?.color + "10", // ← hex opacity (13%)
            color: courseDetails?.color,
          }}
        >
          <CourseIcon size={34} />
        </div>
        <div className="course-detail">
          <p>{courseDetails?.name}</p>

          <p>
            {courseDetails?.season} {courseDetails?.year} •{" "}
            {courseDetails?.lectures[0]?.count}
          </p>
        </div>
      </div>

      <div className="lec-nav-body">
        <div className="lecs-head">
          <p>Lectures</p>
          {isRep && (
            <button
              className="add-lecture"
              onClick={() => document.getElementById("upload-pdf").click()}
            >
              <Plus />
            </button>
          )}
        </div>

        <div className="lectures-nav-list">
          <p className="rotated-lecture-name">
            {selectedLecture ? selectedLecture.title : courseDetails?.name}
          </p>
          {storedLectures.map((lecture, i) => (
            <NavLink
              key={lecture.id}
              to={`lectures/${lecture.id}`}
              className={`lec-item ${selectedLecture.id === lecture.id ? "active" : ""}`}
            >
              <div className="lec-icon">
                <FileIcon />
              </div>
              <div className="lec-details">
                <p>{`${i + 1}- ${lecture.title}`}</p>
                <p>
                  {new Date(lecture.created_at).toLocaleDateString("en-GB")} ·{" "}
                  {lecture.slide_count} slides
                </p>
              </div>
            </NavLink>
          ))}
          <div className="lecture-nav-foote">
            {isRep && (
              <button
                className="add-lecture-btn"
                onClick={() => document.getElementById("upload-pdf").click()}
              >
                <Plus /> Add Lecture
              </button>
            )}
            <p className="rep-only-note">
              <LockIcon /> Only Group Representative can add lectures
            </p>
          </div>
        </div>

        <input
          style={{ display: "none" }}
          accept="application/pdf"
          type="file"
          id="upload-pdf"
          onChange={(e) => {
            handleAddLecture(e);
          }}
        />
      </div>
    </div>
  );
}
export default CourseSidebar;
