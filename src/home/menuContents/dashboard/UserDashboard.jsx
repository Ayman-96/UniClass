import "./UserDashboard.css";
import DashboardBody from "./DashboardBody";
import DashboardHeader from "./DashboardHeader";
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
  return (
    <div className="dashboard-page">
      <div className="dashbord-header">
        <DashboardHeader />
      </div>

      <div className="dashbord-body">
        <DashboardBody groups={groups} />
      </div>
    </div>
  );
}

export default UserDashboard;
