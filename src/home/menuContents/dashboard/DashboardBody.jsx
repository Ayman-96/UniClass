import "./DashboardBody.css";
import { Users } from "lucide-react";
function DashboardBody({ storedGroup }) {
  return (
    <div className="groups">
      {storedGroup.map((group) => {
        return (
          <div
            key={group.groupId}
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
              <p className="group-name">{group.groupName}</p>
              <p className="rep-name">
                Representative : <span>{group.groupRep}</span>
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

export default DashboardBody;
