import { BookOpen, BookPlus } from "lucide-react";
import GroupPageHeader from "./GroupPageHeader";
function GroupCoursesPage() {
  return (
    <div className="courses-page">
      <div className="courses-header">
        <GroupPageHeader
          titleIcon={<BookOpen />}
          title="Courses"
          btnIcon={<BookPlus />}
          btnTitle="Add Course"
        />
      </div>
    </div>
  );
}
export default GroupCoursesPage;
