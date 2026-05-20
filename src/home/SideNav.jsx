import { NavLink } from "react-router-dom";
import { Logo } from "../welcomePage/Welcome.jsx";
import { LayoutGrid, Bell, Users, BookOpen } from "lucide-react";
function SideNav() {
  return (
    <nav className="side-nav">
      <div className="side-nav-logo">
        <Logo />
      </div>

      <h2 className="sideNav-titles">MENU</h2>
      <div className="sideNav-menu-section">
        <NavLink to="/home/dashboard" className="sidebar-link">
          <LayoutGrid className="sidebar-icon" /> Dashboard
        </NavLink>

        <NavLink to="/home/notification" className="sidebar-link">
          <Bell className="sidebar-icon" />
          Notification
        </NavLink>

        <NavLink to="/home/classmates" className="sidebar-link">
          <Users className="sidebar-icon" />
          Classmates
        </NavLink>
      </div>

      <h2 className="sideNav-titles">MY COURSES</h2>
      <div className="sideNav-classes-section">
        <NavLink to="" className="sidebar-link">
          <BookOpen className="sidebar-icon" />
          Course Name
        </NavLink>
      </div>
    </nav>
  );
}
export default SideNav;
