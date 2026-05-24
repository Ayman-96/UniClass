import GroupSideBar from "./GroupBar";
import { Outlet } from "react-router-dom";

function GroupWorkspace() {
  return (
    <div className="group-page">
      <GroupSideBar />
      <Outlet />
    </div>
  );
}

export default GroupWorkspace;
