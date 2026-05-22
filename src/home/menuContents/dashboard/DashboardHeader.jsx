import { PlusIcon } from "lucide-react";
import "./DashboardHeader.css";

function DashboardHeader({ handleOpenNewGroup }) {
  return (
    <div className="dash-header-container">
      <div className="dashbord-title-sec">
        <h2>My Groups</h2>
        <p>
          Select a Group Workspace to enter the hub and continue discussions
          with others.
        </p>
      </div>
      <div className="dashbord-join-sec">
        <button className="new-hub-button" onClick={handleOpenNewGroup}>
          New Group <PlusIcon />
        </button>
      </div>
    </div>
  );
}
export default DashboardHeader;
