import "./Logo.css";
import { GraduationCap } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Logo({
  logoColor,
  backgroundColor,
  titleColor,
  subtitleColor,
}) {
  return (
    <NavLink to="/Home" className="logo">
      <div
        className="plat-logo"
        style={{ background: backgroundColor, color: logoColor }}
      >
        <GraduationCap />
      </div>
      <div className="plat-name">
        <h2 style={{ color: titleColor }}>UniClass</h2>
        <p style={{ color: subtitleColor }}>Student Learning Platform</p>
      </div>
    </NavLink>
  );
}
