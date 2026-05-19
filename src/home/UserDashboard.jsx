import { Logo } from "../welcomePage/Welcome.jsx";
import { NavLink } from "react-router-dom";
function UserDashboard() {
  return (
    <div>
      <DashboardNav />
    </div>
  );
}
function DashboardNav() {
  return (
    <nav className="dash-nav">
      <div className="dash-nav-logo">
        <Logo />
      </div>

      <div className="dash-nav-menu">
        <NavLink to="/">Dashboard</NavLink>
      </div>

      <div className="dash-nav-classes"></div>
    </nav>
  );
}
export default UserDashboard;
