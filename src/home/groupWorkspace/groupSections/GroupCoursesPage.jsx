import {
  BookOpen,
  BookPlus,
  DoorOpen,
  Files,
  LibraryBig,
  Trash2,
  UserStar,
} from "lucide-react";
import "./GroupCoursesPage.css";
import GroupPageHeader from "../GroupWorkspaceHeader";
import { useState } from "react";
import AddCourse from "../groupModals/AddCourse";
import { useCourses } from "../../../hooks/useCourses";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import { courseIcons } from "../../../data/addCourseData";
import { useDeleteCourse } from "../../../hooks/useCourses";
function GroupCoursesPage() {
  const { groupId } = useParams();

  const { data: storedCourses, isLoading, isError } = useCourses(groupId);
  const [courseModal, setCourseModal] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Something went Wrong...! *(</div>;
  function handleCourseModal() {
    setCourseModal((prev) => !prev);
  }

  return (
    // OUTELT
    <div className="courses-page">
      <div className="courses-header">
        <GroupPageHeader
          titleIcon={<BookOpen />}
          title="Courses"
          btnIcon={<BookPlus />}
          btnTitle="Add Course"
          onButtonClick={handleCourseModal}
        />
      </div>

      <div className="courses-body">
        {courseModal && <AddCourse handleCourseModal={handleCourseModal} />}

        <div className="storedCourses-outlet">
          {storedCourses.map((course) => {
            return <CourseCard key={course.id} course={course} />;
          })}
        </div>
      </div>
    </div>
  );
}
function CourseCard({ course }) {
  const { mutate: deleteCourse, isPending } = useDeleteCourse();
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div className="course-card-container">
      <div style={{ height: "5px", background: course.color || "#1a9e6e" }} />
      <div className="course-card-header">
        {/* {courseIcons[course.icon] || <LibraryBig />} */}
        <LibraryBig />
        <div
          className="course-season-badge"
          style={{
            backgroundColor: course.color + "22", // ← hex opacity (13%)
            color: course.color,
          }}
        >
          {course.season} • {course.year}
        </div>
      </div>

      <div className="course-card-body">
        <p>{course.name}</p>
        <div>
          <UserStar /> <span>{course.lecturer}</span>
        </div>
      </div>

      <div className="course-card-footer">
        <div>
          <Files /> * leactures
        </div>
        {!confirmDelete && (
          <div
            onClick={() => setConfirmDelete(true)}
            style={{ color: "#aa1e12" }}
          >
            <Trash2 size={14} />
          </div>
        )}
        {confirmDelete && (
          <div className="delete-confirm-row">
            <button
              className="confirm-yes"
              onClick={() => deleteCourse(course.id)}
              disabled={isPending}
            >
              {isPending ? "..." : "Delete"}
            </button>
            <button
              className="confirm-no"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        )}
        <div>
          <DoorOpen />
        </div>
      </div>
    </div>
  );
}
export default GroupCoursesPage;
