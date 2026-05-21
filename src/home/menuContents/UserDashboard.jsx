import "./UserDashboard.css";
import { Users } from "lucide-react";

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
function DashboardHeader() {
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
        <button className="new-hub-button">New Group</button>
        {/* Whether create a group or join one */}
      </div>
    </div>
  );
}
function DashboardBody({ groups }) {
  return (
    <div className="groups">
      {groups.map((group) => {
        return (
          <div
            key={group.id}
            className="group-card"
            style={{ boxShadow: `inset 0 4px 0 0 ${group.color}` }}
          >
            {/*add icons in future */}
            <div
              className="group-avatar-badge"
              style={{
                backgroundColor: group.color,
                color: "#ffff",
              }}
            >
              <Users size={20} />
            </div>

            <div className="group-title">
              <p className="group-name">{group.name}</p>
              <p className="rep-name">
                Representative <span>{group.rep}</span>
              </p>
            </div>

            <div className="group-roster-summary">
              <div className="member-count-row">
                <Users size={16} /> <span>33 members</span>
              </div>
              <div className="courses-count-row">
                <span>4 Courses</span>
                <span className="pill-badge alert">12 new</span>
              </div>
              {/* Add your stack element here */}
            </div>

            <div className="group-subtitle">
              <p className="num-of-lecs"># Leactures : {group.numOfMembers}</p>
              <div className="group-news">ex: new Leacture</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default UserDashboard;
