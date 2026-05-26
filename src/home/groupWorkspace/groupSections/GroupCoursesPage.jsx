import "./GroupCoursesPage.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import AddCourse from "../groupModals/AddCourse";
import CourseCard from "./groupCards/CourseCard";
import { BookOpen, BookPlus } from "lucide-react";
import GroupPageHeader from "../GroupWorkspaceHeader";
import { useCourses } from "../../../hooks/useCourses";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";

function GroupCoursesPage() {
  const { groupId } = useParams();

  const [courseModal, setCourseModal] = useState(false);
  const { data: storedCourses, isLoading, isError } = useCourses(groupId);
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Something went Wrong...! *(</div>;
  console.log(storedCourses);
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

        <div className="storedCourses-cards">
          {storedCourses.map((course) => {
            return <CourseCard key={course.id} course={course} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default GroupCoursesPage;
