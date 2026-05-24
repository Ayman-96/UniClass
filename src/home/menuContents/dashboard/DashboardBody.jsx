import { Link } from "react-router-dom";
import "./DashboardBody.css";
import { Users } from "lucide-react";
function DashboardBody({ storedGroups }) {
  return (
    <div className="groups">
      {storedGroups.map((group) => {
        console.log(group.group_code);
        return (
          <Link
            to={`/home/group/${group.group_code}`}
            key={group.group_code}
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
                Representative : <span>{group.rep_name}</span>
              </p>
            </div>

            <div className="group-roster-summary">
              <div className="member-count-row">
                <Users size={16} /> <span>{group.members_count} members</span>
              </div>
              <div className="courses-count-row">
                <span>4 Courses</span>
                <span className="pill-badge alert">12 new</span>
              </div>
              {/* Add your stack element here */}
            </div>

            <div className="group-subtitle">
              <p className="num-of-lecs"># Leactures : {group.members_count}</p>
              <div className="group-news">ex: new Leacture</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default DashboardBody;
