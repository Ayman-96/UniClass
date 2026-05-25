import "./AddCourse.css";
import {
  colorOptions,
  seasons,
  courseIcons,
} from "../../../data/addCourseData";
import { BookOpen, X, Info, LayersPlus } from "lucide-react";
function AddCourse({ handleCourseModal }) {
  return (
    <div className="add-course-overlay">
      <div className="add-course-modal">
        <div className="course-modal-header">
          <div>
            <BookOpen /> <span>Add New Course</span>
          </div>
          <button className="close-modal" onClick={handleCourseModal}>
            <X />
          </button>
        </div>

        <div className="course-modal-body">
          {/* Course Name */}
          <div className="add-course-details">
            <label htmlFor="courseName">Course Name</label>
            <input
              required
              type="text"
              id="courseName"
              className="course-input"
              placeholder="e.g. Database Systems"
            />
          </div>

          {/* Course Name */}
          <div className="add-course-details">
            <label htmlFor="lecturerName">Lecturer Name</label>
            <input
              required
              type="text"
              id="lecturerName"
              className="course-input"
              placeholder="e.g. Dr. Him/Her"
            />
          </div>

          {/*Seasons */}
          <div className="course-time">
            <div className="course-season">
              <div>
                <label htmlFor="courseSeason">Season</label>
                <select name="season" id="season">
                  {seasons.map((season) => {
                    return (
                      <option key={season} value={season}>
                        {season}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="courseYear">Year</label>
              <input
                required
                type="number"
                id="courseYear"
                className="course-input"
                placeholder="e.g. 2025"
              />
            </div>
          </div>

          <div className="add-course-details">
            <label htmlFor="courseIcon">Icon </label>
            <div className="course-icon">
              {courseIcons.map((icon, i) => {
                return (
                  <div key={i} className="icon-opt">
                    {icon}
                  </div>
                );
              })}
            </div>
          </div>

          {/*Group Color */}
          <div className="add-course-details">
            <label htmlFor="courseColor">Color</label>
            <div className="set-course-color">
              {colorOptions.map((color) => {
                return (
                  <div
                    key={color}
                    className="color-placeHolder"
                    style={{ backgroundColor: color }}
                  ></div>
                );
              })}
            </div>
          </div>

          {/* Group Description*/}
          <div className="add-course-details">
            <label htmlFor="courseDesc">
              Description <span>(optional)</span>
            </label>
            <textarea
              name="courseDescription"
              id="courseDesc"
              rows={4}
              className="groupDesc-input"
              placeholder="What is this course about ?"
            ></textarea>
          </div>

          <div className="course-hint">
            <span>
              <Info />
            </span>{" "}
            Only Representatives(You) can Edit the Course Details.
          </div>
        </div>

        <div className="course-modal-footer">
          <button className="cancel-course" onClick={handleCourseModal}>
            Cancel
          </button>
          <button className="add-course-button">
            <LayersPlus size={18} />
            Add Course
          </button>
        </div>
      </div>
    </div>
  );
}
export default AddCourse;
