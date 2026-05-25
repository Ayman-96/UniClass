import "./GroupWorkspace.css";
import GroupSideBar from "./groupSections/GroupSideBar";
import { Outlet } from "react-router-dom";

function GroupWorkspace() {
  return (
    <div className="group-page">
      <div className="group-space-left">
        <GroupSideBar />
      </div>
      <div className="group-space-right">
        <Outlet />
      </div>
    </div>
  );
}

export default GroupWorkspace;
