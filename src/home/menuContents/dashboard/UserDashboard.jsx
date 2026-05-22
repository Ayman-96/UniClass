import "./UserDashboard.css";
import { useState } from "react";
import DashboardBody from "./DashboardBody";
import DashboardHeader from "./DashboardHeader";
import NewGroupForm from "../newGroup/NewGroupForm";
const groups = [
  {
    id: "1",
    name: "Software Stage 2",
    rep: "MJM",
    leactures: ["DB", "DC", "OOP", "DS"],
    numOfMembers: 33,
    color: "green",
  },
];
const leacture = {
  id: "111",
  name: "DB",
  u: "a",
  numOfLeactures: "",
  color: "orange",
};
function UserDashboard() {
  const [popNewGroup, setPopNewGroup] = useState(false);
  function handleOpenNewGroup() {
    setPopNewGroup((prev) => !prev);
  }
  return (
    <div className="dashboard-page">
      <div className="dashbord-header">
        <DashboardHeader handleOpenNewGroup={handleOpenNewGroup} />
      </div>

      <div className="dashbord-body">
        <DashboardBody groups={groups} />
      </div>

      <div className="open-group-form">
        {popNewGroup && (
          <NewGroupForm handleOpenNewGroup={handleOpenNewGroup} />
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
