import { BookOpen, BookPlus } from "lucide-react";
import GroupPageHeader from "../GroupWorkspaceHeader";
import { useState } from "react";
import AddCourse from "../groupModals/AddCourse";
function GroupCoursesPage() {
  const [courseModal, setCourseModal] = useState(false);
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
      </div>
    </div>
  );
}
export default GroupCoursesPage;
