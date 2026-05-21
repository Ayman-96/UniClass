import "./SideNav.css";
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
          <div className="sidebar-link-left">
            <LayoutGrid className="sidebar-icon" /> <span>Dashboard</span>
          </div>
        </NavLink>

        <NavLink to="/home/notifications" className="sidebar-link">
          <div className="sidebar-link-left">
            <Bell className="sidebar-icon bell-icon" />
            <span>Notifications</span>
          </div>
          {/*Just as Example */}
          <span className="sidebar-badge">3</span>
        </NavLink>

        <NavLink to="/home/classmates" className="sidebar-link">
          <div className="sidebar-link-left">
            <Users className="sidebar-icon" />
            <span>Classmates</span>
          </div>
        </NavLink>
      </div>

      <h2 className="sideNav-titles">MY COURSES</h2>
      <div className="sideNav-classes-section">
        <NavLink to="/home/class/ds101" className="sidebar-link">
          <div className="sidebar-link-left">
            <BookOpen className="sidebar-icon" />
            <span>Data Structures</span>
          </div>
          <span className="status-dot ds-dot"></span>
        </NavLink>
      </div>
    </nav>
  );
}
export default SideNav;
