import "./App.css";
import Homepage from "./home/Homepage";
import SignUp from "./signingPages/SignUp";
import SignIn from "./signingPages/SignIn";
import Welcome from "./welcomePage/Welcome";
import OnBoarding from "./home/OnBoarding";
import { Route, Routes } from "react-router-dom";
import ResetPassword from "./signingPages/ResetPassword";
import GroupWorkSpace from "./home/groupWorkspace/GroupWorkspace";
import UserDashboard from "./home/menuContents/dashboard/UserDashboard";
import GroupPostsPage from "./home/groupWorkspace/groupSections/groupPages/GroupPostsPage";
import GroupCoursesPage from "./home/groupWorkspace/groupSections/groupPages/GroupCoursesPage";
import GroupMembersPage from "./home/groupWorkspace/groupSections/groupPages/GroupMembersPage";
import GroupAnnouncementsPage from "./home/groupWorkspace/groupSections/groupPages/GroupAnnouncementsPage";
import CourseWorkspace from "./home/groupWorkspace/groupSections/groupPages/courseWorkspace/CourseWorkspace";
import Profile from "./home/profile/Profile";
import InvitePage from "./Invitation/InvitePage";
import GroupSettingsPage from "./home/groupWorkspace/groupSections/groupPages/GroupSettingsPage";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/setup" element={<OnBoarding />} />
        <Route path="/home" element={<Homepage />}>
          {/* Nested routes for the outlet */}
          <Route index element={<UserDashboard />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="classmates" element={<UserDashboard />} />
          <Route path="profile" element={<Profile />} />

          <Route path="group/:groupId" element={<GroupWorkSpace />}>
            <Route index element={<GroupCoursesPage />} />
            <Route path="courses" element={<GroupCoursesPage />} />
            <Route path="posts" element={<GroupPostsPage />} />
            <Route path="members" element={<GroupMembersPage />} />
            <Route path="announcements" element={<GroupAnnouncementsPage />} />
            <Route path="settings" element={<GroupSettingsPage />} />
          </Route>
        </Route>
        <Route path="/profile/:userId" element={<Profile />} />
        <Route // Flat - compeletely separate
          path="/home/group/:groupId/courses/:courseId"
          element={<CourseWorkspace />}
        />
        <Route path="/join/:groupId" element={<InvitePage />} />
      </Routes>
    </div>
  );
}

export default App;
