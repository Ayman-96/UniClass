import "./Homepage.css";
import SideNav from "./SideNav";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X, Search, Bell, Settings, User2 } from "lucide-react";
import { useProfile } from "../hooks/useSaveProfile";
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

function HomeHeader({ isOpenSideBar, setIsOpenSideBar }) {
  const { data: myProfile } = useProfile();
  return (
    <div className="header-container">
      <div className="header-left">
        <button
          className="toggle-menu"
          onClick={() => setIsOpenSideBar((prev) => !prev)}
        >
          {isOpenSideBar ? <X /> : <Menu />}
        </button>

        <div className="search-bar">
          <Search className="search-icon" />
          <input className="search-input" placeholder="Search" />
        </div>
      </div>

      <div className="header-right">
        <button className="notifications-btn">
          <Bell />
        </button>

        <NavLink to="" className="settings-btn">
          <Settings />
        </NavLink>

        <NavLink to="profile" className="profile-btn">
          {myProfile?.avatar_url ? (
            <img src={myProfile?.avatar_url} className="my-pro-avatar" />
          ) : (
            <span className="my-pro-no-avatar">
              <User2 />
            </span>
          )}
          {myProfile?.username}
        </NavLink>
      </div>
    </div>
  );
}
export default Homepage;
