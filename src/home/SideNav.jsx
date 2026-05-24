import "./SideNav.css";
import { NavLink } from "react-router-dom";
import { Logo } from "../welcomePage/Welcome.jsx";
import { LayoutGrid, Bell, Users, BookOpen } from "lucide-react";
function SideNav() {
  const menuSections = [
    {
      id: 1,
      title: "dashboard",
      icon: <LayoutGrid className="sidebar-icon" />,
    },
    { id: 2, title: "notfications", icon: <Bell className="sidebar-icon" /> },
    { id: 3, title: "classmates", icon: <Users className="sidebar-icon" /> },
  ];
  return (
    <nav className="side-nav">
      <div className="side-nav-logo">
        <Logo />
      </div>

      <h2 className="sideNav-titles">MENU</h2>

      <div className="sideNav-menu-section">
        {menuSections.map((sec) => {
          return (
            <NavLink to={sec.title} key={sec.id} className="sidebar-link">
              <div className="sidebar-link-left">
                {sec.icon}
                <span>{sec.title}</span>
              </div>
            </NavLink>
          );
        })}
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
