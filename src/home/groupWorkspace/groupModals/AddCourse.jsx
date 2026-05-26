import "./AddCourse.css";
import {
  colorOptions,
  seasons,
  courseIcons,
} from "../../../data/addCourseData";
import {
  BookOpen,
  X,
  Info,
  LayersPlus,
  InfoIcon,
  LibraryBig,
} from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { useAddCourse } from "../../../hooks/useCourses";
const courseData = {
  id: "",
  name: "",
  lecturer: "",
  color: "#1a9e6e",
  description: "",
  season: "fall",
  year: new Date().getFullYear().toString(),
  icon: "LibraryBig",
};
function courseReducer(state, action) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_LECTURER":
      return { ...state, lecturer: action.payload };
    case "SET_COLOR":
      return { ...state, color: action.payload };
    case "SET_DESC":
      return { ...state, description: action.payload };
    case "SET_SEASON":
      return { ...state, season: action.payload };
    case "SET_YEAR":
      return { ...state, year: action.payload };
    case "SET_ICON":
      return { ...state, icon: action.payload };
    case "RESET":
      return courseData;

    default:
      return state;
  }
}
function AddCourse({ handleCourseModal }) {
  const { groupId } = useParams();
  console.log(groupId);
  const [newCourse, dispatch] = useReducer(courseReducer, courseData);
  const { mutate: addCourse } = useAddCourse();
  // For Requirment Filling
  const [fillWarning, setFillWarning] = useState(false);

  function handleSubmit() {
    if (!newCourse.name || !newCourse.lecturer) {
      setFillWarning(true);
      return;
    }
    addCourse({
      group_id: groupId,
      name: newCourse.name,
      lecturer: newCourse.lecturer,
      color: newCourse.color,
      description: newCourse.description,
      season: newCourse.season,
      year: newCourse.year,
      icon: newCourse.icon,
    });
    dispatch({ type: "RESET" });
    handleCourseModal();
  }

  useEffect(() => {
    dispatch({ type: "RESET" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="add-course-overlay">
      <div className="add-course-modal">
        <div className="course-modal-header">
          <div>
            <BookOpen /> <span>Add New Course</span>
          </div>
          <button
            className="close-modal"
            onClick={() => {
              handleCourseModal();
              dispatch({ type: "RESET" });
            }}
          >
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
              onChange={(e) => {
                dispatch({ type: "SET_NAME", payload: e.target.value });
              }}
            />
          </div>

          {/* Lecturer Name */}
          <div className="add-course-details">
            <label htmlFor="lecturerName">Lecturer Name</label>
            <input
              required
              type="text"
              id="lecturerName"
              className="course-input"
              placeholder="e.g. Dr. Him/Her"
              onChange={(e) => {
                dispatch({ type: "SET_LECTURER", payload: e.target.value });
              }}
            />
          </div>

          {/*Seasons */}
          <div className="course-time">
            <div className="course-season">
              <div>
                <label htmlFor="courseSeason">Season</label>
                <select
                  name="season"
                  id="season"
                  onChange={(e) => {
                    dispatch({ type: "SET_SEASON", payload: e.target.value });
                  }}
                >
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
                type="number"
                id="courseYear"
                className="course-input"
                placeholder="e.g. 2025"
                onChange={(e) => {
                  dispatch({ type: "SET_YEAR", payload: e.target.value });
                }}
              />
            </div>
          </div>

          <div className="add-course-details">
            <label htmlFor="courseIcon">Icon </label>
            <div className="course-icon">
              {courseIcons.map((icon, i) => {
                return (
                  <div
                    key={i}
                    className="icon-opt"
                    onClick={() =>
                      dispatch({ type: "SET_ICON", payload: icon })
                    }
                  >
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
                    onClick={() =>
                      dispatch({ type: "SET_COLOR", payload: color })
                    }
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

        {fillWarning && <RequiredWarning />}

        <div className="course-modal-footer">
          <button
            className="cancel-course"
            onClick={() => {
              handleCourseModal;
              dispatch({ type: "RESET" });
            }}
          >
            Cancel
          </button>
          <button
            className="add-course-button"
            onClick={() => {
              handleSubmit();
              dispatch({ type: "RESET" });
            }}
          >
            <LayersPlus size={18} />
            Add Course
          </button>
        </div>
      </div>
    </div>
  );
}
function RequiredWarning() {
  return (
    <div className="group-warning">
      <span>
        <InfoIcon />
      </span>{" "}
      Please Fill All the Required Fills
    </div>
  );
}
export default AddCourse;
