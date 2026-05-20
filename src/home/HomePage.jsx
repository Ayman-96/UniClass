import { useState } from "react";
import SideNav from "./SideNav";
import { Menu, X, Search, Bell, Settings } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
function HomePage() {
  return (
    <div className="home-page">
      <div className="home-sideBar">
        <SideNav />
      </div>
      <div className="home-outlet">
        <HomeHeader />
        <Outlet />
      </div>
    </div>
  );
}
function HomeHeader() {
  const [sideBar, setSideBar] = useState(false);
  return (
    <div className="home-header">
      <div className="header-left">
        <button className="toggle-menu">{sideBar ? <Menu /> : <X />}</button>
        <Search className="search-icon" />
        <input className="search-input" placeholder="Search" />
      </div>
      <div className="header-right">
        <button className="notifications-btn">
          <Bell />
        </button>
        <NavLink to="" className="settings-btn">
          <Settings />
        </NavLink>
        <NavLink to="" className="profile-btn">
          PROFILE
        </NavLink>
      </div>
    </div>
  );
}
export default HomePage;
