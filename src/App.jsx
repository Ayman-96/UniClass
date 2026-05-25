import "./App.css";
import Homepage from "./home/Homepage";
import Welcome from "./welcomePage/Welcome";
import { Route, Routes } from "react-router-dom";
import GroupWorkSpace from "./home/groupWorkspace/GroupWorkspace";
import UserDashboard from "./home/menuContents/dashboard/UserDashboard";
import GroupPostsPage from "./home/groupWorkspace/groupSections/GroupPostsPage";
import GroupCoursesPage from "./home/groupWorkspace/groupSections/GroupCoursesPage";
import GroupMembersPage from "./home/groupWorkspace/groupSections/GroupMembersPage";
import GroupAnnouncementsPage from "./home/groupWorkspace/groupSections/GroupAnnouncementsPage";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Homepage />}>
          {/* Nested routes for the outlet */}
          <Route index element={<UserDashboard />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="notifications" element={<UserDashboard />} />
          <Route path="classmates" element={<UserDashboard />} />

          <Route path="group/:groupId" element={<GroupWorkSpace />}>
            <Route index element={<GroupCoursesPage />} />
            <Route path="courses" element={<GroupCoursesPage />} />
            <Route path="posts" element={<GroupPostsPage />} />
            <Route path="members" element={<GroupMembersPage />} />
            <Route path="announcements" element={<GroupAnnouncementsPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
