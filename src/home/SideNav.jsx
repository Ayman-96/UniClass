import "./SideNav.css";
import { memo } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Bell,
  Users,
  BookOpen,
  IdCard,
  GraduationCap,
} from "lucide-react";
import { Logo } from "../components/Logo.jsx";
import { FaDoorOpen } from "react-icons/fa6";
import { useSignOut } from "../hooks/useAuthActions.js";
function SideNav() {
  const { mutate: signOut, isPending } = useSignOut();
  const menuSections = [
    {
      id: 1,
      title: "Dashboard",
      icon: <LayoutGrid className="sidebar-icon" />,
    },
    { id: 2, title: "Notifications", icon: <Bell className="sidebar-icon" /> },
    { id: 3, title: "Classmates", icon: <Users className="sidebar-icon" /> },
    { id: 4, title: "Profile", icon: <IdCard className="sidebar-icon" /> },
  ];
  return (
    <nav className="side-nav">
      <div className="side-nav-logo">
        <NavLink to="/Home" className="logo">
          <div className="uniclass-logo">
            <img src="/AppFavicon.png" alt="UniCLass" />
          </div>
          <div className="plat-name">
            <h2>UniClass</h2>
            <p>Student Learning Platform</p>
          </div>
        </NavLink>
      </div>

      <h2 className="sideNav-titles">MENU</h2>

      <div className="sideNav-menu-section">
        {menuSections.map((sec) => {
          return (
            <NavLink
              to={sec.title.toLowerCase()}
              key={sec.id}
              className="sidebar-link"
            >
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

      <button
        className="sign-out-btn"
        onClick={() => signOut()}
        disabled={isPending}
      >
        <FaDoorOpen /> {isPending ? "Signing out..." : "Sign Out"}
      </button>
    </nav>
  );
}
export default memo(SideNav);
