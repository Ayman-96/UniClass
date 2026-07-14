import "./CourseCard.css";
import { useState } from "react";
import { Files, LibraryBig, Trash2, UserStar } from "lucide-react";
import { useDeleteCourse } from "../../../../hooks/useCourses";
import { useNavigate, useParams } from "react-router-dom";
import { useIsRep } from "../../../../hooks/useIsRep";
import { courseIcons } from "../../../../data/addCourseData.jsx";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";

function CourseCard({ course }) {
  const { groupId } = useParams();
  const { data: isRep } = useIsRep(groupId);
  const navigate = useNavigate();
  const { mutate: deleteCourse, isPending } = useDeleteCourse();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [markCourse, setMarkCourse] = useState(false);
  return (
    <div
      className="course-card-container"
      onClick={() => navigate(`${course.id}`)}
    >
      <div style={{ height: "5px", background: course.color || "#1a9e6e" }} />
      <div className="course-card-header">
        {courseIcons[course.icon] || <LibraryBig />}
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
          <Files /> {course.lectures?.[0]?.count ?? 0} lectures
        </div>
        <div className="save-delete-course">
          {!confirmDelete && (
            <button
              className={`bookmark-course ${markCourse ? "marked" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setMarkCourse((prev) => !prev);
              }}
            >
              {markCourse ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          )}
          {!confirmDelete && isRep && (
            <button
              id="delete-course"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(true);
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        {confirmDelete && (
          <div className="delete-confirm-course">
            <button
              className="confirm-yes"
              onClick={(e) => {
                (e.stopPropagation(), deleteCourse(course.id));
              }}
              disabled={isPending}
            >
              {isPending ? "..." : "Delete"}
            </button>
            <button
              className="confirm-no"
              onClick={(e) => {
                (e.stopPropagation(), setConfirmDelete(false));
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default CourseCard;
