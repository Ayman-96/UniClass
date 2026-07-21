import "./App.css";
import Profile from "./home/profile/Profile";
import Homepage from "./home/Homepage";
import OnBoarding from "./home/OnBoarding";
import SignIn from "./signingPages/SignIn";
import SignUp from "./signingPages/SignUp";
import Welcome from "./welcomePage/Welcome";
import InvitePage from "./Invitation/InvitePage";
import { Route, Routes } from "react-router-dom";
import SettingsPage from "./settings/SettingsPage";
import DesktopOnlyGate from "./home/DesktopOnlyGate";
import PostRedirect from "./PostRedirect/PostRedirect";
import ResetPassword from "./signingPages/ResetPassword";
import { useGlobalMessageToast } from "./hooks/useGlobalMessageToast";
import GroupWorkSpace from "./home/groupWorkspace/GroupWorkspace";
import Classmates from "./home/menuContents/classmates/Classmates";
import { useNotificationsRealtime } from "./hooks/useNotifications";
import UserDashboard from "./home/menuContents/dashboard/UserDashboard";
import Notifications from "./home/menuContents/notifications/Notifications";
import GroupPostsPage from "./home/groupWorkspace/groupSections/groupPages/GroupPostsPage";
import GroupCoursesPage from "./home/groupWorkspace/groupSections/groupPages/GroupCoursesPage";
import GroupMembersPage from "./home/groupWorkspace/groupSections/groupPages/GroupMembersPage";
import GroupAnnouncementsPage from "./home/groupWorkspace/groupSections/groupPages/GroupAnnouncementsPage";
import CourseWorkspace from "./home/groupWorkspace/groupSections/groupPages/courseWorkspace/CourseWorkspace";
import GroupSettingsPage from "./home/groupWorkspace/groupSections/groupPages/groupSettings/GroupSettingsPage";
import LectureView from "./home/groupWorkspace/groupSections/groupPages/courseWorkspace/LectureView";
import Lightbox from "./components/Lightbox";
function App() {
  useGlobalMessageToast();
  useNotificationsRealtime();
  return (
    <div>
      <Lightbox />
      <DesktopOnlyGate>
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
            <Route path="notifications" element={<Notifications />} />
            <Route path="classmates" element={<Classmates />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<SettingsPage />} />

            <Route path="group/:groupId" element={<GroupWorkSpace />}>
              <Route index element={<GroupCoursesPage />} />
              <Route path="courses" element={<GroupCoursesPage />} />
              <Route path="posts" element={<GroupPostsPage />} />
              <Route path="members" element={<GroupMembersPage />} />
              <Route
                path="announcements"
                element={<GroupAnnouncementsPage />}
              />
              <Route path="settings" element={<GroupSettingsPage />} />
            </Route>
          </Route>
          <Route path="/profile/:userId" element={<Profile />} />
          <Route // Flat - compeletely separate
            path="/home/group/:groupId/courses/:courseId"
            element={<CourseWorkspace />}
          >
            <Route path="lectures/:lectureId" element={<LectureView />} />
          </Route>
          <Route path="/join/:groupId" element={<InvitePage />} />
          <Route path="/post/:postId" element={<PostRedirect />} />
        </Routes>
      </DesktopOnlyGate>
    </div>
  );
}

export default App;
