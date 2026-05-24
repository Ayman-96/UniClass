import { Outlet } from "react-router-dom";
import GroupSideBar from "./GroupBar";
function GroupWorkspace() {
  return (
    <div className="group-page">
      <GroupSideBar />
      <Outlet />
    </div>
  );
}

export default GroupWorkspace;
