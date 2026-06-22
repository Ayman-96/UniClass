import "./CourseCard.css";
import { useState } from "react";
import { DoorOpen, Files, LibraryBig, Trash2, UserStar } from "lucide-react";
import { useDeleteCourse } from "../../../../hooks/useCourses";
import { useNavigate, useParams } from "react-router-dom";
import { useIsRep } from "../../../../hooks/useIsRep";
import { courseIcons } from "../../../../data/addCourseData.jsx";

function CourseCard({ course }) {
  const { groupId } = useParams();
  const { data: isRep } = useIsRep(groupId);
  const navigate = useNavigate();
  const { mutate: deleteCourse, isPending } = useDeleteCourse();
  const [confirmDelete, setConfirmDelete] = useState(false);
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
        {!confirmDelete && isRep && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setConfirmDelete(true);
            }}
            style={{ color: "#aa1e12" }}
          >
            <Trash2 size={14} />
          </div>
        )}
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
        <div>
          <DoorOpen />
        </div>
      </div>
    </div>
  );
}
export default CourseCard;
