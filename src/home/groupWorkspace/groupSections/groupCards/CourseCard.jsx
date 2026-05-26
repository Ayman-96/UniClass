import "./CourseCard.css";
import { useState } from "react";
import { DoorOpen, Files, LibraryBig, Trash2, UserStar } from "lucide-react";
import { useDeleteCourse } from "../../../../hooks/useCourses";

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
export default CourseCard;
