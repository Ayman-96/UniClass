import "./HomePage.css";
import SideNav from "./SideNav";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X, Search, Bell, Settings } from "lucide-react";

function HomePage() {
  const [isOpenSideBar, setIsOpenSideBar] = useState(true);

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
        <NavLink to="" className="profile-btn">
          <span className="profile-avatar">AK</span>
          Ali Karim
        </NavLink>
      </div>
    </div>
  );
}
export default HomePage;
