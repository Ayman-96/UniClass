import { FileIcon, Plus } from "lucide-react";

function CourseSidebar() {
  return (
    <div className="lecture-sidebar">
      <div className="lec-nav-head">
        <div className="course-icon"></div>
        <div className="course-detail">
          <p>Name</p>
          <p>season 2026 • # members</p>
        </div>
      </div>

      <div className="lec-nav-body">
        <div className="lecs-head">
          <p>Lectures</p>
          <button className="add-lecture">
            <Plus />
          </button>
        </div>

        <div className="lectures-nav-list">
          <div className="lec-icon">
            <FileIcon />
          </div>
          <div className="lec-details">
            <p>Name</p>
            <p>5/5/2025 • # slides</p>
          </div>
        </div>

        <button className="add-lecture">
          <Plus /> Add Lecture
        </button>
        <p>
          <Lock /> Only Group Representative can add Lectures
        </p>
      </div>
    </div>
  );
}
export default CourseSidebar;
