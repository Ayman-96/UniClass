import "./App.css";
import Homepage from "./home/Homepage";
import Welcome from "./welcomePage/Welcome";
import GroupPage from "./home/groupWorkspace/GroupPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GroupPostsPage from "./home/groupWorkspace/GroupPostsPage";
import GroupCoursesPage from "./home/groupWorkspace/GroupCoursesPage";
import GroupMembersPage from "./home/groupWorkspace/GroupMembersPage";
import UserDashboard from "./home/menuContents/dashboard/UserDashboard";
import GroupAnnouncementsPage from "./home/groupWorkspace/GroupAnnouncementsPage";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Homepage />}>
            {/* Nested routes for the outlet */}
            <Route index element={<UserDashboard />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="notifications" element={<UserDashboard />} />
            <Route path="classmates" element={<UserDashboard />} />

            <Route path="group/:groupId" element={<GroupPage />}>
              <Route path="courses" element={<GroupCoursesPage />} />
              <Route path="posts" element={<GroupPostsPage />} />
              <Route path="members" element={<GroupMembersPage />} />
              <Route
                path="announcements"
                element={<GroupAnnouncementsPage />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
