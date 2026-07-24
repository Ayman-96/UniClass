import "./Homepage.css";
import SideNav from "./SideNav";
import { useState, memo } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X, Bell, Settings, GraduationCap } from "lucide-react";
import { useProfile } from "../hooks/useSaveProfile";
import { useNotifications } from "../hooks/useNotifications";
import defaultAvatar from "../assets/default-avatar.svg";
function Homepage() {
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);

  return (
    <div
      className={`home-page ${isOpenSideBar ? "sidebar-open" : "sidebar-closed"}`}
    >
      <div className="home-sideBar">
        <SideNav />
      </div>
      <div className="home-container">
        <div className="home-header">
          <HomeHeader
            isOpenSideBar={isOpenSideBar}
            setIsOpenSideBar={setIsOpenSideBar}
          />
        </div>
        <div className="home-outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const HomeHeader = memo(function HomeHeader({
  isOpenSideBar,
  setIsOpenSideBar,
}) {
  const { data: myProfile } = useProfile();
  const { unreadCount } = useNotifications();
  return (
    <div className="header-container">
      <div className="header-left">
        <button
          className="toggle-menu"
          onClick={() => setIsOpenSideBar((prev) => !prev)}
        >
          {isOpenSideBar ? <X /> : <Menu />}
        </button>{" "}
        <NavLink to="/Home" className="logo">
          <div className="uniclass-logo">
            <GraduationCap size={28} />
          </div>
          <div className="plat-name">
            <h2 style={{ color: "#0d9488" }}>UniClass</h2>
            <p>Student Learning Platform</p>
          </div>
        </NavLink>
      </div>

      <div className="header-right">
        <NavLink
          to="notifications"
          className={`notifications-btn ${unreadCount > 0 ? "has-unread" : ""}`}
        >
          <Bell />
        </NavLink>

        <NavLink to="settings" className="settings-btn">
          <Settings />
        </NavLink>

        <NavLink to="profile" className="profile-btn">
          <img
            src={myProfile?.avatar_url || defaultAvatar}
            className="my-pro-avatar"
          />
          <p style={{ color: myProfile?.fullname_color }}>
            {myProfile?.username}
          </p>
        </NavLink>
      </div>
    </div>
  );
});
export default Homepage;
